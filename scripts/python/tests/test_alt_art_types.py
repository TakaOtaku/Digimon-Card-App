import sys
import unittest
from contextlib import redirect_stdout
from io import BytesIO, StringIO
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "Wiki"))

import GetCardImages as GCI
import GetDataFromWiki as GDW
import AuditCardImages as AUDIT
from bs4 import BeautifulSoup

BOOSTER = "BT-24: BOOSTER TIME STRANGER"


def row(suffix, kind):
    # Rows as GetCardData builds them: '_P<n>' is the table position, matching the gallery numbering
    return {"id": suffix, "note": BOOSTER, "illustrator": "Tonamikanji", "type": kind}


class PickIllustratorRowTests(unittest.TestCase):
    # BT24-034 on the wiki: Alternative Art is _P1, Special Rare is _P2
    rows = [row("_P1", "Alternative Art"), row("_P2", "Special Rare")]

    def type_for(self, image_id, used=()):
        index = GCI.pick_illustrator_row(self.rows, image_id, BOOSTER, set(used))
        return self.rows[index]["type"]

    def test_image_number_picks_the_row(self):
        self.assertEqual(self.type_for("BT24-034_P1"), "Alternative Art")
        self.assertEqual(self.type_for("BT24-034_P2"), "Special Rare")

    def test_sample_image_uses_its_prints_row(self):
        # Gallery order is P1, P1-Sample, P2: the sample must not take the Special Rare row
        self.assertEqual(self.type_for("BT24-034_P1-Sample"), "Alternative Art")

    def test_stored_rows_with_full_ids_match_too(self):
        rows = [row("BT24-034_P1", "Alternative Art"), row("BT24-034_P2", "Special Rare")]
        index = GCI.pick_illustrator_row(rows, "BT24-034_P2", BOOSTER, set())
        self.assertEqual(rows[index]["type"], "Special Rare")

    def test_base_image_falls_back_to_the_booster_note(self):
        self.assertIsNotNone(GCI.pick_illustrator_row(self.rows, "BT24-034", BOOSTER, set()))

    def test_unknown_note_has_no_row(self):
        self.assertIsNone(GCI.pick_illustrator_row(self.rows, "BT24-034", "EX-11", set()))

    def test_omnimon_caption_overrides_provisional_table_number(self):
        rows = [
            {**row("_P2", "Top 2 Prize"), "note": "Evolution Cup 2021"},
            {**row("_P3", "Rare Pull"), "note": "BT-06: Booster Double Diamond"},
        ]
        for language in ("", "-J"):
            with self.subTest(language=language):
                index = GCI.pick_illustrator_row(
                    rows, "BT1-084_P2" + language, "BT-06: Booster Double Diamond", set()
                )
                self.assertEqual(index, 1)

    def test_number_cannot_match_an_unrelated_release(self):
        self.assertIsNone(GCI.pick_illustrator_row(self.rows, "BT24-034_P1", "EX-11", set()))

    def test_distinct_image_does_not_reuse_consumed_row(self):
        self.assertIsNone(GCI.pick_illustrator_row(self.rows[:1], "BT24-034_P2", BOOSTER, {0}))

    def test_used_print_still_matches_its_sample(self):
        self.assertEqual(self.type_for("BT24-034_P1-Sample", {0}), "Alternative Art")

    def test_sample_reuses_resolved_identity_not_table_suffix(self):
        rows = [row("_P2", "Alternative Art")]
        bindings = {}
        self.assertEqual(GCI.pick_illustrator_row(rows, "BT20-063_P1", BOOSTER, set(), bindings), 0)
        self.assertEqual(GCI.pick_illustrator_row(rows, "BT20-063_P1-Sample", BOOSTER, {0}, bindings), 0)
        self.assertIsNone(GCI.pick_illustrator_row(rows, "BT20-063_P3", BOOSTER, {0}, bindings))

    def test_duplicate_gallery_identity_is_not_appended_twice(self):
        bindings = {}
        self.assertEqual(GCI.pick_illustrator_row(self.rows, "BT24-034_P1", BOOSTER, set(), bindings), 0)
        self.assertIsNone(GCI.pick_illustrator_row(self.rows, "BT24-034_P1", BOOSTER, {0}, bindings))

    def test_combined_caption_can_match_secondary_release(self):
        self.assertEqual(GCI.pick_illustrator_row(self.rows, "BT24-034_P2-J", "Other release / " + BOOSTER, set()), 1)

    def test_release_whitespace_is_normalized(self):
        self.assertEqual(GCI.pick_illustrator_row(self.rows, "BT24-034_P2", "  BT-24:  BOOSTER TIME STRANGER\n", set()), 1)

    def test_blinding_ray_has_no_phantom_rare_pull(self):
        releases = ["Great Legend Pre-Release Pack", "RB-01", "ST-17", "Double Typhoon Pre-Release Pack", "BT-25"]
        rows = [
            {**row(suffix, kind), "note": release}
            for suffix, kind, release in zip(
                ("_P0", "_P2", "_P3", "_P0", "_P5"),
                ("Pre Release Stamp - Rare", "Rare", "Alternative Art", "Pre Release Stamp - Alternative Art", "Rare Pull"),
                releases,
            )
        ]
        used = set()
        for expected, (suffix, release) in enumerate(zip(("_P0", "_P1", "_P2", "_P02", "_P3"), releases)):
            index = GCI.pick_illustrator_row(rows, "BT4-104" + suffix, release, used)
            self.assertEqual(index, expected)
            used.add(index)
        self.assertEqual(GCI.missing_special_prints("BT4-104", rows, used), [])

    def test_ids_without_a_number_use_unused_rows_in_order(self):
        rows = [row("-Errata", "Errata Text"), row("-Errata", "Errata Text 2")]
        first = GCI.pick_illustrator_row(rows, "X-Y", BOOSTER, set())
        second = GCI.pick_illustrator_row(rows, "X-Y", BOOSTER, {first})
        self.assertEqual((first, second), (0, 1))


class MissingSpecialPrintsTests(unittest.TestCase):
    # BT18-040: the wiki table lists a Special Rare print that has no gallery image
    rows = [
        row("_P1", "Alternative Art"),
        row("_P2", "Special Rare"),
        row("_P3", "Textured - Stamped - Top 8 Prize"),
    ]

    def test_special_print_without_image_is_kept(self):
        prints = GCI.missing_special_prints("BT18-040", self.rows, {0})
        self.assertEqual([(p["id"], p["type"]) for p in prints], [("BT18-040_P2", "Special Rare")])

    def test_print_with_an_image_is_not_duplicated(self):
        self.assertEqual(GCI.missing_special_prints("BT18-040", self.rows, {0, 1}), [])

    def test_other_missing_prints_stay_dropped(self):
        types = [p["type"] for p in GCI.missing_special_prints("BT18-040", self.rows, set())]
        self.assertNotIn("Textured - Stamped - Top 8 Prize", types)

    def test_rare_pull_is_kept_too(self):
        prints = GCI.missing_special_prints("BT19-067", [row("_P1", "Foil - Rare Pull")], set())
        self.assertEqual([p["id"] for p in prints], ["BT19-067_P1"])


class GalleryPipelineTests(unittest.TestCase):
    def run_gallery(self, card_id, rows, images):
        card = SimpleNamespace(id=card_id, notes="Base release", AAs=rows, JAAs=[dict(entry) for entry in rows])
        galleries = []
        for language, ending in enumerate(("", "-J")):
            items = ''.join(
                f'<div class="wikia-gallery-item"><img data-image-key="{card_id}{suffix}{ending}.png" src="https://example.invalid/latest"><div class="lightbox-caption"><a>{note}</a></div></div>'
                for suffix, note in images
            )
            galleries.append(f'<div id="gallery-{language}">{items}</div>')
        soup = BeautifulSoup(''.join(galleries), 'html.parser')
        with patch.object(GCI.WV, "cards", [card]), patch.object(GCI.WV, "cardLinks", ["/wiki/" + card_id]), patch.object(GCI.WF, "iter_pages_html", return_value=[("Gallery", soup)]), patch.object(GCI, "download_image_with_retry"), redirect_stdout(StringIO()):
            GCI.getCardImages()
        return card

    def test_omnimon_metadata_stays_with_correct_gallery_images_in_both_languages(self):
        rows = [
            {**row("_P2", "Top 2 Prize"), "note": "Evolution Cup 2021", "illustrator": "Tonamikanji"},
            {**row("_P3", "Rare Pull"), "note": "BT-06: Booster Double Diamond", "illustrator": "sasasi"},
        ]
        card = self.run_gallery("BT1-084", rows, [("_P3", "Evolution Cup 2021"), ("_P2", "BT-06: Booster Double Diamond")])
        for prints in (card.AAs, card.JAAs):
            self.assertEqual([(entry['id'].removesuffix('-J'), entry['type'], entry['illustrator']) for entry in prints], [("BT1-084_P3", "Top 2 Prize", "Tonamikanji"), ("BT1-084_P2", "Rare Pull", "sasasi")])

    def test_blinding_ray_outputs_five_alternates_and_no_phantom(self):
        releases = ["Great Legend pre-release", "RB-01", "ST-17", "Double Typhoon pre-release", "BT-25"]
        rows = [
            {**row(suffix, kind), "note": note}
            for suffix, kind, note in zip(("_P0", "_P2", "_P3", "_P0", "_P5"), ("Stamped", "Rare", "Alternative Art", "Stamped", "Rare Pull"), releases)
        ]
        card = self.run_gallery("BT4-104", rows, list(zip(("_P0", "_P1", "_P2", "_P02", "_P3"), releases)))
        self.assertEqual(len(card.AAs) + 1, 6)
        self.assertEqual([entry['id'] for entry in card.AAs], ["BT4-104" + suffix for suffix in ("_P0", "_P1", "_P2", "_P02", "_P3")])
        self.assertEqual(card.AAs[-1]['type'], "Rare Pull")


class ImageAuditTests(unittest.TestCase):
    def test_section_does_not_take_another_language_gallery(self):
        soup = BeautifulSoup('<h2><span id="English">English</span></h2><h2>Japanese</h2><div class="wikia-gallery"></div>', 'html.parser')
        self.assertIsNone(AUDIT.section(soup, "English", "div", **{"class": "wikia-gallery"}))

    def test_gallery_keeps_exact_filenames_and_scanless_entries(self):
        soup = BeautifulSoup('<div><div class="wikia-gallery-item"><img data-image-key="BT4-104_P02.png"><div class="lightbox-caption"><a>Pre-release</a></div></div><div class="wikia-gallery-item"><a class="image-no-lightbox">BT4-104 P3.png</a><div class="lightbox-caption"><a>BT-25</a></div></div></div>', 'html.parser')
        prints = AUDIT.gallery_prints(soup)
        self.assertEqual([(print_info['id'], print_info['scan']) for print_info in prints], [("BT4-104_P02", True), ("BT4-104_P3", False)])

    def test_browser_fallback_order(self):
        self.assertEqual(AUDIT.fallbacks("BT1-084_P2.webp"), ["BT1-084_P2-J.webp", "BT1-084_P2-Sample-J.webp"])
        self.assertEqual(AUDIT.fallbacks("BT1-084_P2-J.webp"), ["BT1-084_P2-Sample-J.webp"])


class OneCardRunTests(unittest.TestCase):
    def pages(self):
        page = BeautifulSoup('<div class="ctable"><div class="info-main"><table><tr><td>Name</td><td>Testmon</td></tr><tr><td>Card Type</td><td>Digimon</td></tr><tr><td>DP</td><td>15000 DP</td></tr><tr><td>Rarity</td><td>Super Rare</td></tr></table></div></div><h2><span id="English_Sets">English Sets</span></h2><table class="settable"><tr><th>Illustrator</th><th>Set</th><th>Rarity</th></tr><tr><td>Artist</td><td>BT-01</td><td>Super Rare</td></tr><tr><td>Artist</td><td>Cup</td><td>Rare Pull</td></tr></table><h2>Japanese Sets</h2><table class="settable"><tr><th>Illustrator</th></tr><tr><td>Artist</td><td>BT-01 JP</td><td>Super Rare</td></tr></table>', 'html.parser')
        items = ''.join(f'<div class="wikia-gallery-item"><img data-image-key="BT1-084{suffix}.png" src="https://example.invalid/{suffix}/latest"><div class="lightbox-caption"><a>{note}</a></div></div>' for suffix, note in (("", "BT-01"), ("_P1", "Cup")))
        gallery = BeautifulSoup('<h2><span id="English">English</span></h2><div id="gallery-0" class="wikia-gallery">' + items + '</div>', 'html.parser')
        return page, gallery

    def test_real_stages_download_convert_and_prepare_in_isolation(self):
        image_bytes = BytesIO()
        GCI.Image.new("RGB", (2, 3)).save(image_bytes, format="PNG")
        original_directory = Path.cwd()
        original_cards = GCI.WV.cards
        with patch.object(AUDIT.requests, "Session") as session:
            session.return_value.__enter__.return_value.get.return_value.content = image_bytes.getvalue()
            result = AUDIT.run_one_card("BT1-084", *self.pages())
        self.assertTrue(result["passed"], result)
        self.assertTrue(result["card_data_passed"])
        self.assertTrue(result["image_check_passed"])
        self.assertEqual((result["prepared_variants"], result["downloaded_images"], result["converted_images"]), (2, 2, 2))
        self.assertEqual(result["prepared"][0]["name"]["english"], "Testmon")
        self.assertEqual(result["prepared"][0]["dp"], "15000")
        self.assertEqual(Path.cwd(), original_directory)
        self.assertIs(GCI.WV.cards, original_cards)

    def test_metadata_only_does_not_claim_image_verification(self):
        with patch.object(AUDIT.requests, "Session") as session:
            result = AUDIT.run_one_card("BT1-084", *self.pages(), download_images=False)
            session.return_value.__enter__.return_value.get.assert_not_called()
        self.assertTrue(result["passed"])
        self.assertFalse(result["image_downloads_checked"])
        self.assertIsNone(result["image_check_passed"])
        self.assertIsNone(result["missing_downloads"])
        self.assertEqual(result["requested_images"], 2)

    def test_failed_downloads_fail_the_run(self):
        with patch.object(AUDIT.requests, "Session") as session:
            session.return_value.__enter__.return_value.get.side_effect = AUDIT.requests.ConnectionError("offline")
            result = AUDIT.run_one_card("BT1-084", *self.pages())
        self.assertFalse(result["passed"])
        self.assertTrue(result["card_data_passed"])
        self.assertFalse(result["image_check_passed"])
        self.assertEqual(result["missing_downloads"], ["BT1-084.png", "BT1-084_P1.png"])


class ContentHashTests(unittest.TestCase):
    card = {"id": "BT24-101", "AAs": [{"id": "_P1", "type": "Alternative Art"}, {"id": "_P2", "type": "Rare Pull"}]}

    def test_alt_art_type_change_counts_as_changed(self):
        fixed = {**self.card, "AAs": [{"id": "_P1", "type": "Alternative Art"}, {"id": "_P2", "type": "Alternative Art"}]}
        self.assertNotEqual(GDW._card_content_hash(self.card), GDW._card_content_hash(fixed))

    def test_alt_art_order_does_not_count(self):
        reordered = {**self.card, "AAs": list(reversed(self.card["AAs"]))}
        self.assertEqual(GDW._card_content_hash(self.card), GDW._card_content_hash(reordered))

    def test_release_type_reassignment_counts_as_changed(self):
        original = {"AAs": [{"note": "Evolution Cup", "type": "Rare Pull"}, {"note": "BT-06", "type": "Top 2 Prize"}]}
        fixed = {"AAs": [{"note": "Evolution Cup", "type": "Top 2 Prize"}, {"note": "BT-06", "type": "Rare Pull"}]}
        self.assertNotEqual(GDW._card_content_hash(original), GDW._card_content_hash(fixed))

    def test_provisional_and_resolved_ids_do_not_force_an_update(self):
        resolved = {**self.card, "AAs": [{**aa, "id": "BT24-101" + aa["id"]} for aa in self.card["AAs"]]}
        self.assertEqual(GDW._card_content_hash(self.card), GDW._card_content_hash(resolved))

    def test_illustrator_correction_counts_as_changed(self):
        fixed = {**self.card, "AAs": [{**aa, "illustrator": "Correct artist"} for aa in self.card["AAs"]]}
        self.assertNotEqual(GDW._card_content_hash(self.card), GDW._card_content_hash(fixed))


if __name__ == "__main__":
    unittest.main()
