"""English image/wiki audit and disposable one-card pipeline tests."""

import argparse
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from contextlib import ExitStack, redirect_stdout
from copy import deepcopy
from datetime import datetime, timezone
from io import StringIO
import json
import os
from pathlib import Path
import re
from tempfile import TemporaryDirectory
from types import SimpleNamespace
from unittest.mock import patch

from bs4 import BeautifulSoup
import requests

import CardImageIndex
import GetCardData
import GetCardImages
import FormatCards
import PrepareCards
import TransformPNG
import WikiFunctions
import WikiVariables

ROOT = CardImageIndex.REPOSITORY_ROOT
WIKI = "https://digimoncardgame.fandom.com/wiki/"


def section(soup, name, tag, **attributes):
    heading = soup.find(id=name)
    if heading is None:
        return None
    if heading.name not in ("h2", "h3"):
        heading = heading.find_parent(["h2", "h3"])
    if heading is None:
        return None
    for element in heading.find_all_next():
        if element.name in ("h2", "h3"):
            break
        if element.name == tag and all(
            value in element.get(key, []) if key == "class" else element.get(key) == value
            for key, value in attributes.items()
        ):
            return element
    return None


def gallery_prints(gallery):
    prints = []
    if gallery is None:
        return prints
    for item in gallery.find_all("div", class_="wikia-gallery-item"):
        image = item.find("img")
        caption = item.find("div", class_="lightbox-caption")
        if caption is None:
            continue
        filename = image.get("data-image-key") if image else None
        if not filename:
            missing = item.find("a", class_="image-no-lightbox")
            filename = missing.get_text(strip=True).replace(" ", "_") if missing else None
        if not filename:
            continue
        notes = [link.get_text(" ", strip=True) for link in caption.find_all("a")]
        prints.append({
            "id": filename.removesuffix(".png"),
            "scan": image is not None,
            "note": " / ".join(notes),
            "caption": caption.get_text(" ", strip=True),
        })
    return prints


def old_match(rows, image_id, note, used):
    suffix = GetCardImages.illustrator_suffix(image_id)
    if suffix is not None:
        for index, row in enumerate(rows):
            if GetCardImages.illustrator_suffix(row["id"]) == suffix:
                return index
    matches = [index for index, row in enumerate(rows) if row["note"] == note]
    unused = [index for index in matches if index not in used]
    return (unused or matches or [None])[0]


def replay(card_id, rows, prints, matcher):
    used = set()
    bindings = {}
    mapped = []
    for print_info in prints:
        image_id = print_info["id"]
        if GetCardImages.illustrator_suffix(image_id) is None:
            continue
        note = print_info["note"]
        if matcher is old_match:
            note = note.split(" / ")[0]
        index = matcher(rows, image_id, note, used) if matcher is old_match else matcher(rows, image_id, note, used, bindings)
        mapped.append({"id": image_id, "row": index})
        if index is not None and "Sample" not in image_id:
            used.add(index)
    known = {print_info["id"] for print_info in mapped if print_info["row"] is not None}
    synthetic = [
        print_info for print_info in GetCardImages.missing_special_prints(card_id, rows, used)
        if print_info["id"] not in known
    ]
    return {"mapped": mapped, "synthetic": synthetic}


def fetch_page(title):
    response = requests.get(
        "https://digimoncardgame.fandom.com/api.php",
        params={"action": "parse", "page": title, "prop": "text|revid", "redirects": "true", "format": "json"},
        headers={"User-Agent": "DigimonCardApp/1.0 read-only image audit"},
        timeout=(10, 25),
    )
    response.raise_for_status()
    result = response.json()
    if "error" in result:
        raise ValueError(result["error"].get("code", "wiki error"))
    parsed = result["parse"]
    return BeautifulSoup(parsed["text"]["*"], "lxml"), parsed.get("revid")


def inspect_wiki(card_id):
    try:
        page, page_revision = fetch_page(card_id)
        table = section(page, "English_Sets", "table")
        card = SimpleNamespace(AAs=[], illustrator="", notes="")
        if table is not None:
            GetCardData.getEnglishIllustrator(table.find_all("tr"), card)
        main_images = sorted({image.get("data-image-key") for image in page.find_all("img") if image.get("data-image-key", "").startswith(card_id)})
        try:
            gallery_page, gallery_revision = fetch_page(card_id + "/Gallery")
        except (requests.RequestException, ValueError, KeyError) as error:
            return {
                "card": card_id, "page_revision": page_revision, "english_table": table is not None,
                "rows": card.AAs, "main_images": main_images, "gallery": [],
                "gallery_error": type(error).__name__ + ": " + str(error),
            }
        prints = gallery_prints(section(gallery_page, "English", "div", **{"class": "wikia-gallery"}))
        return {
            "card": card_id, "page_revision": page_revision, "gallery_revision": gallery_revision,
            "english_table": table is not None, "rows": card.AAs, "gallery": prints, "main_images": main_images,
            "before": replay(card_id, card.AAs, prints, old_match),
            "after": replay(card_id, card.AAs, prints, GetCardImages.pick_illustrator_row),
        }
    except (requests.RequestException, ValueError, KeyError) as error:
        return {"card": card_id, "error": type(error).__name__ + ": " + str(error)}


def fallbacks(filename):
    if not filename.endswith(".webp"):
        return []
    stem = filename[:-5]
    if stem.endswith("-J"):
        return [stem[:-2] + "-Sample-J.webp"]
    return [stem + "-J.webp", stem + "-Sample-J.webp"]


def classify(card, wiki):
    if "error" in wiki:
        return "Wiki card page absent" if wiki["error"] == "ValueError: missingtitle" else "Wiki unavailable; unresolved"
    if "gallery_error" in wiki:
        return "Main page exists; gallery absent" if wiki["gallery_error"] == "ValueError: missingtitle" else "Wiki gallery unavailable; unresolved"
    prints = [print_info for print_info in wiki["gallery"] if print_info["id"] == card["id"]]
    if any(print_info["scan"] for print_info in prints):
        return "Wiki English scan exists; image delivery/download gap"
    if prints:
        return "Wiki gallery lists print without a scan"
    if not wiki["english_table"]:
        return "No English release table; language/release availability"
    rows = [row for row in wiki["rows"] if row["note"] == card.get("notes")]
    if rows:
        return "Table-backed print absent from English gallery; verify identity/no scan"
    return "No matching English gallery identity or table release; possible stale/synthetic variant"


def render_report(cards, candidates, remote_names, wiki_results, local_only):
    counts = Counter(card["id"] for card in cards)
    duplicate_ids = {image_id: count for image_id, count in counts.items() if count > 1}
    statuses = Counter(classify(card, wiki_results[card["cardNumber"]]) for card in candidates)
    lines = [
        "# English Wiki Image Audit", "",
        f"Generated: {datetime.now(timezone.utc).isoformat()}", "",
        f"- English records: {len(cards)}; unique IDs: {len(counts)}.",
        f"- Garage object names: {len(remote_names)}; local-only mode: {local_only}.",
        f"- Images absent from Garage and local staging: {len(candidates)}.",
        f"- Wiki card/gallery checks attempted (including Omnimon/Blinding Ray controls): {len(wiki_results)}.",
        f"- Duplicate IDs: {json.dumps(duplicate_ids, sort_keys=True)}.", "",
        "## Scope And Limits", "",
        "The shipped English prepared JSON is the audited snapshot. Garage key listing is read-only. "
        "Object presence is not a public CDN health check; an absent key can still have a browser fallback. "
        "Wiki failures remain unresolved. No card JSON, images, uploads, or user decks are modified. "
        "This snapshot may differ from the deployed site. Local-only results cannot establish remote absence.", "",
        "## Matching Decision", "",
        "Wiki image filenames remain variant identities. Table-position suffixes are only hints: "
        "the release caption must match before a suffix may select a metadata row. "
        "Real prints cannot reuse consumed rows; sample scans may use their own print's row. "
        "Resolved gallery identities bind samples to the correct row even when provisional table numbering differs. "
        "All linked caption releases are considered. Same-release suffix hints still distinguish AA/RP/SP. "
        "Unmatched legitimate RP/SP table rows remain visible; absence of a scan alone is not grounds for deletion. "
        "Change detection compares release/type/illustrator associations, not provisional table IDs, so "
        "metadata corrections propagate without treating table-vs-gallery suffix differences as perpetual changes. "
        "Ambiguous same-release ordering and stale stored metadata require manual review; this audit does not prove all Japanese variants correct.", "",
        "## Classification Counts", "",
    ]
    lines.extend(f"- {status}: {count}." for status, count in sorted(statuses.items()))
    changed = [card_id for card_id, result in sorted(wiki_results.items()) if "before" in result and result["before"] != result["after"]]
    lines.extend(["", "## Reproduced Script Findings", "",
                  "- Omnimon: table order assigns Cup to provisional _P2 and Rare Pull to _P3, but gallery filenames are the reverse. Caption-constrained matching repairs the associations without renaming images.",
                  "- Blinding Ray: the old matcher reuses the RB-01 row and assigns ST-17 metadata to the Rare Pull image, leaving a table row that generates phantom BT4-104_P5. The repaired replay produces five alternates plus the base, with Rare Pull at _P3.",
                  "- Metadata change detection now includes release/type/illustrator associations so swapping types between releases is not missed.",
                  f"- Cards with changed replay results: {', '.join(changed) or 'None'}.",
                  "- Gallery entries lacking table metadata are left unresolved rather than receiving another print's type. Plain-text captions without release links and missing wiki pages are documented below, not guessed.",
                  "- Duplicate stored IDs are listed above for follow-up; this audit does not rewrite saved card identities.",
                  "", "## Reproduction", "",
                  "With the project Python dependencies installed:", "",
                  "```powershell", "python -B scripts/python/Wiki/AuditCardImages.py --output docs/wiki-image-audit.md",
                  "python -B -m unittest discover -s scripts/python/tests", "```", ""])
    lines.extend(["", "## Missing Requested Images", "", "| Variant | Available browser fallback | Wiki finding |", "| --- | --- | --- |"])
    for card in candidates:
        filename = card.get("cardImage", "").removeprefix("assets/images/cards/")
        available = [name for name in fallbacks(filename) if CardImageIndex.image_exists(name)]
        lines.append(f"| {card['id']} | {', '.join(available) or 'None'} | {classify(card, wiki_results[card['cardNumber']])} |")
    lines.extend(["", "## Wiki Evidence And Parser Replay", "",
                  "Before/after replay starts with fresh table rows, not previously resolved variant IDs. "
                  "A synthetic print is an unmatched RP/SP row invented by the pipeline, not proof of an additional gallery print.", ""])
    for card_id, result in sorted(wiki_results.items()):
        lines.extend([f"### {card_id}", "", f"[Card]({WIKI + card_id}) | [Gallery]({WIKI + card_id}/Gallery)", "",
                      "```json", json.dumps(result, indent=2, ensure_ascii=True), "```", ""])
    return "\n".join(lines)


def run_one_card(card_id, page, gallery_page, download_images=True):
    """Exercise one card serially in disposable storage, with optional real English downloads."""
    gallery_page = deepcopy(gallery_page)
    english = section(gallery_page, "English", "div", **{"class": "wikia-gallery"})
    prints = gallery_prints(english)
    if english is None:
        raise ValueError("English gallery is absent")
    for gallery in list(gallery_page.find_all("div", class_="wikia-gallery")):
        if gallery is not english:
            gallery.decompose()
    english["id"] = "gallery-0"
    expected_ids = {entry["id"] for entry in prints if "Sample" not in entry["id"]}
    expected_scans = {entry["id"] + ".png" for entry in prints if entry["scan"]}
    pages = {card_id: page, card_id + "/Gallery": gallery_page}
    log = StringIO()
    downloader = GetCardImages.download_image_with_retry
    requested_images = set()

    def download_once(url, destination, image_id):
        if Path(image_id).name != image_id or not image_id.startswith(card_id):
            raise ValueError("Unexpected image filename: " + image_id)
        requested_images.add(image_id)
        if download_images:
            downloader(url, destination, image_id, max_retries=1, retry_delay=0)

    with TemporaryDirectory(prefix="digimon-one-card-") as temporary, ExitStack() as stack:
        previous_directory = Path.cwd()
        stack.callback(os.chdir, previous_directory)
        os.chdir(temporary)
        json_directory = Path("scripts/python/Wiki/jsons")
        json_directory.mkdir(parents=True)
        image_directory = Path("scripts/python/Wiki/digimon-images")
        image_directory.mkdir()
        (image_directory / "converted").mkdir()
        stack.enter_context(patch.object(WikiVariables, "cards", []))
        stack.enter_context(patch.object(WikiVariables, "cardLinks", ["/wiki/" + card_id]))
        stack.enter_context(patch.object(WikiVariables, "cardCount", 1))
        stack.enter_context(patch.object(WikiFunctions, "iter_pages_html", side_effect=lambda titles, **options: [(title, pages[title]) for title in titles]))
        stack.enter_context(patch.object(GetCardImages, "download_stats", {"skipped": 0, "downloaded": 0, "failed": 0}))
        stack.enter_context(patch.object(GetCardImages, "check_image_exists_in_assets", return_value=False))
        stack.enter_context(patch.object(GetCardImages, "download_image_with_retry", side_effect=download_once))
        stack.enter_context(patch.object(PrepareCards, "preparedCardsENG", []))
        stack.enter_context(patch.object(PrepareCards, "preparedCardsJAP", []))
        stack.enter_context(patch.object(TransformPNG.ImageFile, "LOAD_TRUNCATED_IMAGES", TransformPNG.ImageFile.LOAD_TRUNCATED_IMAGES))
        stack.enter_context(patch.object(PrepareCards, "check_image_exists", side_effect=lambda filename: (image_directory / "converted" / Path(filename).name).is_file()))
        session = stack.enter_context(requests.Session())
        session.headers.update(WikiFunctions.api_session.headers)
        stack.enter_context(patch.object(WikiFunctions, "api_session", session))
        with redirect_stdout(log):
            GetCardData.getCardData()
            if len(WikiVariables.cards) != 1:
                raise ValueError("Card parser did not produce exactly one base card")
            GetCardImages.getCardImages()
            WikiFunctions.setNotes()
            WikiFunctions.saveCards()
            FormatCards.replaceStrings()
            FormatCards.removeSamples()
            downloaded = {path.name for path in image_directory.glob("*.png")}
            invalid_images = []
            for path in image_directory.glob("*.png"):
                try:
                    with GetCardImages.Image.open(path) as image:
                        image.verify()
                except (OSError, ValueError):
                    invalid_images.append(path.name)
            if not invalid_images:
                TransformPNG.pngToWebP()
            PrepareCards.prepareCards()
        prepared = json.loads((json_directory / "PreparedDigimonCardsENG.json").read_text(encoding="utf-8"))
        actual_ids = [card["id"] for card in prepared]
        table = section(page, "English_Sets", "table")
        metadata_rows = [] if table is None else [
            [" ".join(cell.get_text(" ", strip=True).split()) for cell in row.find_all("td")]
            for row in table.find_all("tr") if len(row.find_all("td")) >= 3
        ]
        metadata_mismatches = []
        for card in prepared:
            if card["id"] == card_id:
                continue
            releases = {" ".join(note.split()) for note in card["notes"].split(" / ")}
            if not any(note in releases and artist == " ".join(card["illustrator"].split()) and kind == " ".join(card["version"].split()) for artist, note, kind, *_ in metadata_rows):
                metadata_mismatches.append(card["id"])
        missing_variants = sorted(expected_ids - set(actual_ids))
        extra_variants = sorted(set(actual_ids) - expected_ids)
        missing_downloads = sorted(expected_scans - downloaded)
        duplicates = [image_id for image_id, count in Counter(actual_ids).items() if count > 1]
        base_card = next((card for card in prepared if card["id"] == card_id), {})
        core_mismatches = []
        main_info = page.find("div", class_="info-main")
        cells = [] if main_info is None else [cell.get_text().replace("\n", "").strip() for cell in main_info.find_all("td")]
        for header, value in zip(cells[::2], cells[1::2]):
            if header not in GetCardData.MAIN_INFO_MAPPINGS:
                continue
            field, transform = GetCardData.MAIN_INFO_MAPPINGS[header]
            expected = transform(value)
            if field == "rarity":
                expected = GetCardData.RARITY_MAPPING.get(expected, expected)
            actual = base_card
            for part in field.split("."):
                actual = actual.get(part) if isinstance(actual, dict) else None
            if str(actual).strip() != str(expected).strip():
                core_mismatches.append({"field": field, "expected": expected, "actual": actual})
        converted = {path.name for path in (image_directory / "converted").glob("*.webp")}
        conversion_failures = sorted(filename for filename in downloaded if filename.removesuffix(".png") + ".webp" not in converted)
        result = {
            "card": card_id, "expected_variants": len(expected_ids), "prepared_variants": len(prepared),
            "available_scans": len(expected_scans), "downloaded_images": len(downloaded),
            "converted_images": len(list((image_directory / "converted").glob("*.webp"))),
            "image_downloads_checked": download_images, "requested_images": len(requested_images),
            "missing_image_requests": sorted(expected_scans - requested_images),
            "missing_variants": missing_variants, "extra_variants": extra_variants,
            "missing_downloads": missing_downloads if download_images else None, "invalid_images": invalid_images,
            "conversion_failures": conversion_failures, "core_data_mismatches": core_mismatches,
            "duplicate_ids": duplicates, "metadata_mismatches": metadata_mismatches,
            "scanless_variants": sorted(entry["id"] for entry in prints if not entry["scan"] and "Sample" not in entry["id"]),
            "prepared": prepared,
        }
        result["card_data_passed"] = not any((missing_variants, extra_variants, duplicates, metadata_mismatches, core_mismatches, result["missing_image_requests"]))
        result["image_check_passed"] = not any((missing_downloads, invalid_images, conversion_failures)) if download_images else None
        result["passed"] = result["card_data_passed"] and result["image_check_passed"] is not False
        if not result["passed"]:
            result["log"] = log.getvalue()
        return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, help="Write the generated Markdown report here; otherwise print it")
    parser.add_argument("--local-only", action="store_true", help="Do not use Garage; remote absence remains unknown")
    parser.add_argument("--card", action="append", default=[], help="Run one card end to end in temporary storage; repeat for several cards")
    parser.add_argument("--metadata-only", action="store_true", help="With --card, check data and image requests without downloading image bytes")
    args = parser.parse_args()
    if args.output and args.output.suffix.lower() != ".md":
        parser.error("The report output must be a Markdown (.md) file")
    if args.card:
        results = []
        for card_id in args.card:
            if re.fullmatch(r"[A-Z]+\d*-\d+", card_id) is None:
                parser.error("Expected a base card number, e.g. BT4-104")
            try:
                page, revision = fetch_page(card_id)
                gallery, gallery_revision = fetch_page(card_id + "/Gallery")
                result = run_one_card(card_id, page, gallery, download_images=not args.metadata_only)
                result.update(page_revision=revision, gallery_revision=gallery_revision)
            except (requests.RequestException, ValueError, KeyError) as error:
                result = {"card": card_id, "passed": False, "blocked": True, "error": str(error)}
            results.append(result)
            print(json.dumps({key: value for key, value in result.items() if key not in ("prepared", "log")}, ensure_ascii=True), flush=True)
        if args.output:
            args.output.parent.mkdir(parents=True, exist_ok=True)
            summary = "\n".join(f"| {result['card']} | {result.get('expected_variants', '?')} | {result.get('prepared_variants', '?')} | {result.get('available_scans', '?')} | {result.get('downloaded_images', '?')} | {'BLOCKED' if result.get('blocked') else 'PASS' if result['passed'] else 'FAIL'} |" for result in results)
            args.output.write_text("# One-Card Pipeline Tests\n\nEnglish-only runs through production parsing, gallery matching, formatting, conversion and preparation in temporary storage. No Garage writes or production card/image changes. Scanless gallery entries count separately from available scans. `image_downloads_checked: false` means metadata/request validation only, not verified downloads. Missing variants and incomplete wiki metadata fail rather than being silently accepted.\n\n## Reproduction\n\n```powershell\npython -B scripts/python/Wiki/AuditCardImages.py --card BT4-104 --output docs/wiki-one-card-tests.md\n```\n\nRepeat `--card` for other cards. Add `--metadata-only` only to explicitly skip image-byte checks.\n\n## Results\n\n| Card | Expected variants | Prepared variants | Available scans | Downloaded | Result |\n| --- | --- | --- | --- | --- | --- |\n" + summary + "\n\n## Evidence\n\n```json\n" + json.dumps(results, indent=2, ensure_ascii=True) + "\n```\n", encoding="utf-8")
        return 0 if all(result["passed"] for result in results) else 1
    source = ROOT / "src/assets/cardlists/PreparedDigimonCardsENG.json"
    if args.output and args.output.resolve() == source.resolve():
        parser.error("The report cannot overwrite card data")
    remote_names = set() if args.local_only else CardImageIndex._load_remote_names()
    if args.local_only:
        CardImageIndex._remote_names = set()
    else:
        import garage_sync
        client, _, _ = garage_sync.client_from_environment()
        if client is None:
            parser.error("Garage is not configured; use --local-only to explicitly audit local files only")
    cards = json.loads(source.read_text(encoding="utf-8"))
    candidates = [
        card for card in cards
        if not card.get("cardImage") or not CardImageIndex.image_exists(card["cardImage"].removeprefix("assets/images/cards/"))
    ]
    card_ids = sorted({card["cardNumber"] for card in candidates} | {"BT1-084", "BT4-104"})
    print(f"Auditing {len(candidates)} missing references across {len(card_ids)} wiki cards.", flush=True)
    with ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(inspect_wiki, card_ids))
    report = render_report(cards, candidates, remote_names, {result["card"]: result for result in results}, args.local_only)
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(report, encoding="utf-8")
        print(f"Report: {args.output}; unavailable main pages/galleries: {sum('error' in result or 'gallery_error' in result for result in results)}")
    else:
        print(report)


if __name__ == "__main__":
    raise SystemExit(main())