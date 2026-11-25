# One-Card Pipeline Tests

English-only runs through production parsing, gallery matching, formatting, conversion and preparation in temporary storage. No Garage writes or production card/image changes. Scanless gallery entries count separately from available scans. `image_downloads_checked: false` means metadata/request validation only, not verified downloads. Missing variants and incomplete wiki metadata fail rather than being silently accepted.

## Findings

Blinding Ray produces six variants, with no extra or missing variants and no metadata mismatches. All six expected image filenames reach the production downloader. All six downloads return HTTP 403, so the complete live-image test correctly fails. The failure log below records the actual production-stage requests; no image availability is inferred from card counts.

## Reproduction

```powershell
python -B scripts/python/Wiki/AuditCardImages.py --card BT4-104 --output docs/wiki-one-card-tests.md
```

Repeat `--card` for other cards. Add `--metadata-only` only to explicitly skip image-byte checks.

## Results

| Card | Expected variants | Prepared variants | Available scans | Downloaded | Result |
| --- | --- | --- | --- | --- | --- |
| BT4-104 | 6 | 6 | 6 | 0 | FAIL |

## Evidence

```json
[
  {
    "card": "BT4-104",
    "expected_variants": 6,
    "prepared_variants": 6,
    "available_scans": 6,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": true,
    "requested_images": 6,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": [
      "BT4-104.png",
      "BT4-104_P0.png",
      "BT4-104_P02.png",
      "BT4-104_P1.png",
      "BT4-104_P2.png",
      "BT4-104_P3.png"
    ],
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "00",
          "02",
          "03"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT4-104.webp",
        "cardLv": "-",
        "cardNumber": "BT4-104",
        "cardType": "Option",
        "color": "Yellow",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Main] Trash the top card of your security stack. Then, gain 2 memory.",
        "form": "-",
        "id": "BT4-104",
        "illustrator": "p!k@ru",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Blinding Ray",
          "japanese": "\u7d76\u5149\u885d",
          "korean": "\uc808\uad11\ucda9",
          "simplifiedChinese": "\u7edd\u5149\u51b2",
          "traditionalChinese": "\u7d55\u5149\u885d"
        },
        "notes": "\u25b9BOOSTER GREAT LEGEND [BT-04]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "0",
        "rarity": "R",
        "restrictions": {
          "chinese": "Restricted to 1",
          "english": "Restricted to 1",
          "japanese": "Restricted to 1",
          "korean": "Restricted to 1"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "00",
          "02",
          "03"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT4-104_P0.webp",
        "cardLv": "-",
        "cardNumber": "BT4-104",
        "cardType": "Option",
        "color": "Yellow",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Main] Trash the top card of your security stack. Then, gain 2 memory.",
        "form": "-",
        "id": "BT4-104_P0",
        "illustrator": "p!k@ru",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Blinding Ray",
          "japanese": "\u7d76\u5149\u885d",
          "korean": "\uc808\uad11\ucda9",
          "simplifiedChinese": "\u7edd\u5149\u51b2",
          "traditionalChinese": "\u7d55\u5149\u885d"
        },
        "notes": "Great Legend Pre-Release Pack",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "0",
        "rarity": "R",
        "restrictions": {
          "chinese": "Restricted to 1",
          "english": "Restricted to 1",
          "japanese": "Restricted to 1",
          "korean": "Restricted to 1"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Gold Outline - Pre Release Stamp -\u00a0Rare"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "00",
          "02",
          "03"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT4-104_P1.webp",
        "cardLv": "-",
        "cardNumber": "BT4-104",
        "cardType": "Option",
        "color": "Yellow",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Main] Trash the top card of your security stack. Then, gain 2 memory.",
        "form": "-",
        "id": "BT4-104_P1",
        "illustrator": "p!k@ru",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Blinding Ray",
          "japanese": "\u7d76\u5149\u885d",
          "korean": "\uc808\uad11\ucda9",
          "simplifiedChinese": "\u7edd\u5149\u51b2",
          "traditionalChinese": "\u7d55\u5149\u885d"
        },
        "notes": "RB-01: Resurgence Booster",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "0",
        "rarity": "R",
        "restrictions": {
          "chinese": "Restricted to 1",
          "english": "Restricted to 1",
          "japanese": "Restricted to 1",
          "korean": "Restricted to 1"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Foil -\u00a0Rare"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "00",
          "02",
          "03"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT4-104_P2.webp",
        "cardLv": "-",
        "cardNumber": "BT4-104",
        "cardType": "Option",
        "color": "Yellow",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Main] Trash the top card of your security stack. Then, gain 2 memory.",
        "form": "-",
        "id": "BT4-104_P2",
        "illustrator": "koki",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Blinding Ray",
          "japanese": "\u7d76\u5149\u885d",
          "korean": "\uc808\uad11\ucda9",
          "simplifiedChinese": "\u7edd\u5149\u51b2",
          "traditionalChinese": "\u7d55\u5149\u885d"
        },
        "notes": "ST-17: Advanced Deck Set Double Typhoon",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "0",
        "rarity": "R",
        "restrictions": {
          "chinese": "Restricted to 1",
          "english": "Restricted to 1",
          "japanese": "Restricted to 1",
          "korean": "Restricted to 1"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Foil -\u00a0Alternative Art"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "00",
          "02",
          "03"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT4-104_P02.webp",
        "cardLv": "-",
        "cardNumber": "BT4-104",
        "cardType": "Option",
        "color": "Yellow",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Main] Trash the top card of your security stack. Then, gain 2 memory.",
        "form": "-",
        "id": "BT4-104_P02",
        "illustrator": "koki",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Blinding Ray",
          "japanese": "\u7d76\u5149\u885d",
          "korean": "\uc808\uad11\ucda9",
          "simplifiedChinese": "\u7edd\u5149\u51b2",
          "traditionalChinese": "\u7d55\u5149\u885d"
        },
        "notes": "Double Typhoon Pre-Release Pack",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "0",
        "rarity": "R",
        "restrictions": {
          "chinese": "Restricted to 1",
          "english": "Restricted to 1",
          "japanese": "Restricted to 1",
          "korean": "Restricted to 1"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Foil - Pre Release Stamp -\u00a0Alternative Art"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "00",
          "02",
          "03"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT4-104_P3.webp",
        "cardLv": "-",
        "cardNumber": "BT4-104",
        "cardType": "Option",
        "color": "Yellow",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Main] Trash the top card of your security stack. Then, gain 2 memory.",
        "form": "-",
        "id": "BT4-104_P3",
        "illustrator": "Spareribs",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Blinding Ray",
          "japanese": "\u7d76\u5149\u885d",
          "korean": "\uc808\uad11\ucda9",
          "simplifiedChinese": "\u7edd\u5149\u51b2",
          "traditionalChinese": "\u7d55\u5149\u885d"
        },
        "notes": "BT-25: BOOSTER DUAL REVOLUTION",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "0",
        "rarity": "R",
        "restrictions": {
          "chinese": "Restricted to 1",
          "english": "Restricted to 1",
          "japanese": "Restricted to 1",
          "korean": "Restricted to 1"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Rare Pull"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": false,
    "passed": false,
    "log": "\ud83d\udcca Processing 1 cards using MediaWiki API...\n[1/1] BT4-104 - Blinding Ray\n\n\u2705 Card data extraction completed!\n\ud83d\udcc8 Successfully processed: 1 cards\n\u274c Errors: 0\n\u23f1\ufe0f  Total time: 0.0s\n\ud83d\ude80 Average speed: 1002.0 cards/sec\n\ud83d\ude80 Starting card image download process using MediaWiki API...\n\ud83d\udcca Processing 1 card links...\nChecking /wiki/BT4-104\n\u2b07\ufe0f  Downloading BT4-104.png...\n\u274c HTTP Error 403: Forbidden\n\u274c Failed to download BT4-104.png after 1 attempts.\n\u2b07\ufe0f  Downloading BT4-104_P0.png...\n\u274c HTTP Error 403: Forbidden\n\u274c Failed to download BT4-104_P0.png after 1 attempts.\n\u2b07\ufe0f  Downloading BT4-104_P1.png...\n\u274c HTTP Error 403: Forbidden\n\u274c Failed to download BT4-104_P1.png after 1 attempts.\n\u2b07\ufe0f  Downloading BT4-104_P2.png...\n\u274c HTTP Error 403: Forbidden\n\u274c Failed to download BT4-104_P2.png after 1 attempts.\n\u2b07\ufe0f  Downloading BT4-104_P02.png...\n\u274c HTTP Error 403: Forbidden\n\u274c Failed to download BT4-104_P02.png after 1 attempts.\n\u2b07\ufe0f  Downloading BT4-104_P3.png...\n\u274c HTTP Error 403: Forbidden\n\u274c Failed to download BT4-104_P3.png after 1 attempts.\n\n==================================================\n\ud83d\udcca DOWNLOAD SUMMARY\n==================================================\n\u2705 Successfully downloaded: 0 images\n\u23ed\ufe0f  Skipped (already exist): 0 images\n\u274c Failed downloads: 6 images\n\ud83d\udcc8 Total processed: 6 images\n==================================================\nSaving DigimonCard JSON!\n\nConversion complete: 0 files converted, 0 files failed\n",
    "page_revision": 185606,
    "gallery_revision": 184973
  }
]
```
