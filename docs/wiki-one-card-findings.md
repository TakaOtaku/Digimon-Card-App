# One-Card Pipeline Tests

English-only runs through production parsing, gallery matching, formatting, conversion and preparation in temporary storage. No Garage writes or production card/image changes. Scanless gallery entries count separately from available scans. `image_downloads_checked: false` means metadata/request validation only, not verified downloads. Missing variants and incomplete wiki metadata fail rather than being silently accepted.

## Findings

- 93 one-card runs: 69 passed metadata and image-request checks, 20 were blocked by missing wiki pages/galleries, and 4 failed variant-count checks.
- Omnimon and Blinding Ray each produce exactly six variants with matching release, illustrator and type metadata.
- BT27-052 lacks a table row for gallery variant BT27-052_P2. P-251 lacks usable linked release metadata for P1/P2. ST25-01 and ST26-01 have gallery P1 entries without usable linked release metadata. These remain failures rather than receiving guessed metadata.
- These batch runs deliberately skipped image bytes. The separate real-image run in [wiki-one-card-tests.md](wiki-one-card-tests.md) passes Blinding Ray's card-data checks but fails downloads: all six original-image requests return HTTP 403, including with production HTTP headers.
- The run also exposed and fixed a zero-duration division in the production parser's progress summary.
- All 39 offline tests pass, including mocked HTTP image downloads through the real PNG decoder, WebP converter and JSON preparation. This does not substitute for successful live CDN downloads.
- The runner changes the process working directory and patches module state temporarily, so one-card runs are serial. Temporary files and patched state are restored after each run. English-only testing does not certify Japanese outputs.

## Reproduction

```powershell
python -B scripts/python/Wiki/AuditCardImages.py --card BT4-104 --output docs/wiki-one-card-tests.md
```

Repeat `--card` for other cards. Add `--metadata-only` only to explicitly skip image-byte checks.

## Results

| Card | Expected variants | Prepared variants | Available scans | Downloaded | Result |
| --- | --- | --- | --- | --- | --- |
| BD01-01 | ? | ? | ? | ? | BLOCKED |
| BD01-04 | ? | ? | ? | ? | BLOCKED |
| BD01-06 | ? | ? | ? | ? | BLOCKED |
| BD01-07 | ? | ? | ? | ? | BLOCKED |
| BD01-08 | ? | ? | ? | ? | BLOCKED |
| BD01-09 | ? | ? | ? | ? | BLOCKED |
| BD02-01 | ? | ? | ? | ? | BLOCKED |
| BD02-05 | ? | ? | ? | ? | BLOCKED |
| BD02-06 | ? | ? | ? | ? | BLOCKED |
| BD02-07 | ? | ? | ? | ? | BLOCKED |
| BD02-09 | ? | ? | ? | ? | BLOCKED |
| BD02-10 | ? | ? | ? | ? | BLOCKED |
| BD03-01 | ? | ? | ? | ? | BLOCKED |
| BT1-084 | 6 | 6 | 6 | 0 | PASS |
| BT17-059 | 2 | 2 | 1 | 0 | PASS |
| BT18-054 | 3 | 3 | 2 | 0 | PASS |
| BT20-013 | 2 | 2 | 2 | 0 | PASS |
| BT20-063 | 3 | 3 | 4 | 0 | PASS |
| BT21-046 | 2 | 2 | 2 | 0 | PASS |
| BT22-004 | 2 | 2 | 1 | 0 | PASS |
| BT22-005 | 2 | 2 | 2 | 0 | PASS |
| BT22-063 | 3 | 3 | 3 | 0 | PASS |
| BT22-099 | 2 | 2 | 1 | 0 | PASS |
| BT23-013 | 3 | 3 | 4 | 0 | PASS |
| BT23-092 | 2 | 2 | 2 | 0 | PASS |
| BT23-099 | 2 | 2 | 2 | 0 | PASS |
| BT24-018 | 3 | 3 | 4 | 0 | PASS |
| BT24-085 | 4 | 4 | 5 | 0 | PASS |
| BT27-001 | 1 | 1 | 0 | 0 | PASS |
| BT27-005 | 1 | 1 | 0 | 0 | PASS |
| BT27-006 | 1 | 1 | 0 | 0 | PASS |
| BT27-011 | 1 | 1 | 0 | 0 | PASS |
| BT27-014 | 1 | 1 | 0 | 0 | PASS |
| BT27-016 | 1 | 1 | 0 | 0 | PASS |
| BT27-018 | 1 | 1 | 0 | 0 | PASS |
| BT27-019 | 1 | 1 | 0 | 0 | PASS |
| BT27-022 | 1 | 1 | 0 | 0 | PASS |
| BT27-024 | 1 | 1 | 0 | 0 | PASS |
| BT27-027 | 1 | 1 | 0 | 0 | PASS |
| BT27-029 | 1 | 1 | 0 | 0 | PASS |
| BT27-030 | 1 | 1 | 0 | 0 | PASS |
| BT27-032 | 1 | 1 | 0 | 0 | PASS |
| BT27-033 | 1 | 1 | 0 | 0 | PASS |
| BT27-035 | 3 | 3 | 2 | 0 | PASS |
| BT27-037 | 1 | 1 | 0 | 0 | PASS |
| BT27-052 | 3 | 2 | 2 | 0 | FAIL |
| BT27-054 | 1 | 1 | 0 | 0 | PASS |
| BT27-059 | 1 | 1 | 0 | 0 | PASS |
| BT27-062 | 1 | 1 | 1 | 0 | PASS |
| BT27-063 | 1 | 1 | 0 | 0 | PASS |
| BT27-068 | 1 | 1 | 0 | 0 | PASS |
| BT27-085 | 3 | 3 | 2 | 0 | PASS |
| BT27-086 | 1 | 1 | 0 | 0 | PASS |
| BT27-088 | 1 | 1 | 0 | 0 | PASS |
| BT27-089 | 1 | 1 | 0 | 0 | PASS |
| BT27-103 | 3 | 3 | 2 | 0 | PASS |
| BT27-104 | 3 | 3 | 1 | 0 | PASS |
| BT4-104 | 6 | 6 | 6 | 0 | PASS |
| BT5-090 | 4 | 4 | 3 | 0 | PASS |
| ED01-01 | ? | ? | ? | ? | BLOCKED |
| ED02-01 | ? | ? | ? | ? | BLOCKED |
| EX14-001 | 2 | 2 | 0 | 0 | PASS |
| EX14-012 | 2 | 2 | 1 | 0 | PASS |
| EX14-054 | 3 | 3 | 1 | 0 | PASS |
| EX5-058 | 2 | 2 | 1 | 0 | PASS |
| EX5-063 | 4 | 4 | 3 | 0 | PASS |
| EX7-051 | 2 | 2 | 1 | 0 | PASS |
| EX7-073 | 4 | 4 | 3 | 0 | PASS |
| EX8-055 | 3 | 3 | 2 | 0 | PASS |
| P-226 | 1 | 1 | 0 | 0 | PASS |
| P-229 | 2 | 2 | 2 | 0 | PASS |
| P-232 | 2 | 2 | 2 | 0 | PASS |
| P-233 | 3 | 3 | 4 | 0 | PASS |
| P-234 | 3 | 3 | 4 | 0 | PASS |
| P-235 | 3 | 3 | 4 | 0 | PASS |
| P-236 | 3 | 3 | 4 | 0 | PASS |
| P-237 | 3 | 3 | 4 | 0 | PASS |
| P-238 | 3 | 3 | 4 | 0 | PASS |
| P-239 | 3 | 3 | 4 | 0 | PASS |
| P-240 | 3 | 3 | 4 | 0 | PASS |
| P-241 | 3 | 3 | 4 | 0 | PASS |
| P-242 | 3 | 3 | 4 | 0 | PASS |
| P-243 | 3 | 3 | 4 | 0 | PASS |
| P-244 | 3 | 3 | 4 | 0 | PASS |
| P-251 | 3 | 1 | 0 | 0 | FAIL |
| SD01-01 | ? | ? | ? | ? | BLOCKED |
| SD02-01 | ? | ? | ? | ? | BLOCKED |
| ST22-13 | 2 | 2 | 2 | 0 | PASS |
| ST25-01 | 2 | 1 | 0 | 0 | FAIL |
| ST25-02 | ? | ? | ? | ? | BLOCKED |
| ST25-03 | ? | ? | ? | ? | BLOCKED |
| ST25-15 | ? | ? | ? | ? | BLOCKED |
| ST26-01 | 2 | 1 | 0 | 0 | FAIL |

## Evidence

```json
[
  {
    "card": "BD01-01",
    "passed": false,
    "blocked": true,
    "error": "missingtitle"
  },
  {
    "card": "BD01-04",
    "passed": false,
    "blocked": true,
    "error": "missingtitle"
  },
  {
    "card": "BD01-06",
    "passed": false,
    "blocked": true,
    "error": "missingtitle"
  },
  {
    "card": "BD01-07",
    "passed": false,
    "blocked": true,
    "error": "missingtitle"
  },
  {
    "card": "BD01-08",
    "passed": false,
    "blocked": true,
    "error": "missingtitle"
  },
  {
    "card": "BD01-09",
    "passed": false,
    "blocked": true,
    "error": "missingtitle"
  },
  {
    "card": "BD02-01",
    "passed": false,
    "blocked": true,
    "error": "missingtitle"
  },
  {
    "card": "BD02-05",
    "passed": false,
    "blocked": true,
    "error": "missingtitle"
  },
  {
    "card": "BD02-06",
    "passed": false,
    "blocked": true,
    "error": "missingtitle"
  },
  {
    "card": "BD02-07",
    "passed": false,
    "blocked": true,
    "error": "missingtitle"
  },
  {
    "card": "BD02-09",
    "passed": false,
    "blocked": true,
    "error": "missingtitle"
  },
  {
    "card": "BD02-10",
    "passed": false,
    "blocked": true,
    "error": "missingtitle"
  },
  {
    "card": "BD03-01",
    "passed": false,
    "blocked": true,
    "error": "missingtitle"
  },
  {
    "card": "BT1-084",
    "expected_variants": 6,
    "prepared_variants": 6,
    "available_scans": 6,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 6,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
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
        "attribute": "Vaccine",
        "block": [
          "00"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT1-084.webp",
        "cardLv": "Lv.7",
        "cardNumber": "BT1-084",
        "cardType": "Digimon",
        "color": "White",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Red",
            "cost": "6",
            "level": "6"
          },
          {
            "color": "Blue",
            "cost": "6",
            "level": "6"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "15000",
        "dualEffect": "-",
        "effect": "[When Digivolving] Choose 1 of your opponent's Digimon. Delete all of your opponent's Digimon that share a name with it.\n[When Attacking] You can unsuspend this Digimon by returning 1 of this Digimon's level 6 digivolution cards to your hand.",
        "form": "Mega",
        "id": "BT1-084",
        "illustrator": "sasasi",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Omnimon",
          "japanese": "\u30aa\u30e1\u30ac\u30e2\u30f3",
          "korean": "\uc624\uba54\uac00\ubaac",
          "simplifiedChinese": "\u5965\u7c73\u52a0\u517d",
          "traditionalChinese": "\u5967\u7c73\u52a0 \u7378"
        },
        "notes": "\u25b9RELEASE SPECIAL BOOSTER 1.0 [BT01-03]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "15",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Holy Warrior/Royal Knight",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Vaccine",
        "block": [
          "00"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT1-084_P1.webp",
        "cardLv": "Lv.7",
        "cardNumber": "BT1-084",
        "cardType": "Digimon",
        "color": "White",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Red",
            "cost": "6",
            "level": "6"
          },
          {
            "color": "Blue",
            "cost": "6",
            "level": "6"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "15000",
        "dualEffect": "-",
        "effect": "[When Digivolving] Choose 1 of your opponent's Digimon. Delete all of your opponent's Digimon that share a name with it.\n[When Attacking] You can unsuspend this Digimon by returning 1 of this Digimon's level 6 digivolution cards to your hand.",
        "form": "Mega",
        "id": "BT1-084_P1",
        "illustrator": "Kenji Watanabe",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Omnimon",
          "japanese": "\u30aa\u30e1\u30ac\u30e2\u30f3",
          "korean": "\uc624\uba54\uac00\ubaac",
          "simplifiedChinese": "\u5965\u7c73\u52a0\u517d",
          "traditionalChinese": "\u5967\u7c73\u52a0 \u7378"
        },
        "notes": "BT01-03: Release Special Booster Ver.1.0",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "15",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Holy Warrior/Royal Knight",
        "version": "Gold Foil -\u00a0Alternative Art"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Vaccine",
        "block": [
          "00"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT1-084_P3.webp",
        "cardLv": "Lv.7",
        "cardNumber": "BT1-084",
        "cardType": "Digimon",
        "color": "White",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Red",
            "cost": "6",
            "level": "6"
          },
          {
            "color": "Blue",
            "cost": "6",
            "level": "6"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "15000",
        "dualEffect": "-",
        "effect": "[When Digivolving] Choose 1 of your opponent's Digimon. Delete all of your opponent's Digimon that share a name with it.\n[When Attacking] You can unsuspend this Digimon by returning 1 of this Digimon's level 6 digivolution cards to your hand.",
        "form": "Mega",
        "id": "BT1-084_P3",
        "illustrator": "Tonamikanji",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Omnimon",
          "japanese": "\u30aa\u30e1\u30ac\u30e2\u30f3",
          "korean": "\uc624\uba54\uac00\ubaac",
          "simplifiedChinese": "\u5965\u7c73\u52a0\u517d",
          "traditionalChinese": "\u5967\u7c73\u52a0 \u7378"
        },
        "notes": "Evolution Cup 2021",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "15",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Holy Warrior/Royal Knight",
        "version": "Textured - Evolution Cup Stamp -\u00a0Top 2 Prize"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Vaccine",
        "block": [
          "00"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT1-084_P2.webp",
        "cardLv": "Lv.7",
        "cardNumber": "BT1-084",
        "cardType": "Digimon",
        "color": "White",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Red",
            "cost": "6",
            "level": "6"
          },
          {
            "color": "Blue",
            "cost": "6",
            "level": "6"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "15000",
        "dualEffect": "-",
        "effect": "[When Digivolving] Choose 1 of your opponent's Digimon. Delete all of your opponent's Digimon that share a name with it.\n[When Attacking] You can unsuspend this Digimon by returning 1 of this Digimon's level 6 digivolution cards to your hand.",
        "form": "Mega",
        "id": "BT1-084_P2",
        "illustrator": "sasasi",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Omnimon",
          "japanese": "\u30aa\u30e1\u30ac\u30e2\u30f3",
          "korean": "\uc624\uba54\uac00\ubaac",
          "simplifiedChinese": "\u5965\u7c73\u52a0\u517d",
          "traditionalChinese": "\u5967\u7c73\u52a0 \u7378"
        },
        "notes": "BT-06: Booster Double Diamond",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "15",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Holy Warrior/Royal Knight",
        "version": "Textured -\u00a0Rare Pull"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Vaccine",
        "block": [
          "00"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT1-084_P4.webp",
        "cardLv": "Lv.7",
        "cardNumber": "BT1-084",
        "cardType": "Digimon",
        "color": "White",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Red",
            "cost": "6",
            "level": "6"
          },
          {
            "color": "Blue",
            "cost": "6",
            "level": "6"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "15000",
        "dualEffect": "-",
        "effect": "[When Digivolving] Choose 1 of your opponent's Digimon. Delete all of your opponent's Digimon that share a name with it.\n[When Attacking] You can unsuspend this Digimon by returning 1 of this Digimon's level 6 digivolution cards to your hand.",
        "form": "Mega",
        "id": "BT1-084_P4",
        "illustrator": "Tonamikanji",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Omnimon",
          "japanese": "\u30aa\u30e1\u30ac\u30e2\u30f3",
          "korean": "\uc624\uba54\uac00\ubaac",
          "simplifiedChinese": "\u5965\u7c73\u52a0\u517d",
          "traditionalChinese": "\u5967\u7c73\u52a0 \u7378"
        },
        "notes": "Ultimate Cup 2022",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "15",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Holy Warrior/Royal Knight",
        "version": "Textured - Ultimate Cup Stamp -\u00a0Top 2 Prize"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Vaccine",
        "block": [
          "00"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT1-084_P5.webp",
        "cardLv": "Lv.7",
        "cardNumber": "BT1-084",
        "cardType": "Digimon",
        "color": "White",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Red",
            "cost": "6",
            "level": "6"
          },
          {
            "color": "Blue",
            "cost": "6",
            "level": "6"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "15000",
        "dualEffect": "-",
        "effect": "[When Digivolving] Choose 1 of your opponent's Digimon. Delete all of your opponent's Digimon that share a name with it.\n[When Attacking] You can unsuspend this Digimon by returning 1 of this Digimon's level 6 digivolution cards to your hand.",
        "form": "Mega",
        "id": "BT1-084_P5",
        "illustrator": "Kenji Watanabe",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Omnimon",
          "japanese": "\u30aa\u30e1\u30ac\u30e2\u30f3",
          "korean": "\uc624\uba54\uac00\ubaac",
          "simplifiedChinese": "\u5965\u7c73\u52a0\u517d",
          "traditionalChinese": "\u5967\u7c73\u52a0 \u7378"
        },
        "notes": "PB-12E: Digimon Card Game 2nd Anniversary Set",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "15",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Holy Warrior/Royal Knight",
        "version": "Gold Foil - Gold Background -\u00a0Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 163310,
    "gallery_revision": 120057
  },
  {
    "card": "BT17-059",
    "expected_variants": 2,
    "prepared_variants": 2,
    "available_scans": 1,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 1,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT17-059_P1"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Unknown",
        "block": [
          "03"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT17-059.webp",
        "cardLv": "Lv.6",
        "cardNumber": "BT17-059",
        "cardType": "Digimon",
        "color": "Black",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Black",
            "cost": "4",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "12000",
        "dualEffect": "-",
        "effect": "[When Digivolving] By placing 1 [Doomsday Clock] from your hand or trash as this Digimon's bottom digivolution card, you may play 2 [Diaboromon] Tokens without paying the cost. (Digimon/Cost 14/Lv.6/White/Mega/Unknown/Unidentified/3000 DP)\n[Opponent's Turn] [Once Per Turn] When one of your opponent's Digimon attacks, you may switch the attack target to 1 of your Digimon with [Diaboromon]\u00a0in its name.",
        "form": "Mega",
        "id": "BT17-059",
        "illustrator": "sasasi",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Diaboromon",
          "japanese": "\u30c7\u30a3\u30a2\u30dc\u30ed\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Pre-Release Pack Secret Crisis",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "12",
        "rarity": "R",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Unidentified",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Unknown",
        "block": [
          "03"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT17-059_P1.webp",
        "cardLv": "Lv.6",
        "cardNumber": "BT17-059",
        "cardType": "Digimon",
        "color": "Black",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Black",
            "cost": "4",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "12000",
        "dualEffect": "-",
        "effect": "[When Digivolving] By placing 1 [Doomsday Clock] from your hand or trash as this Digimon's bottom digivolution card, you may play 2 [Diaboromon] Tokens without paying the cost. (Digimon/Cost 14/Lv.6/White/Mega/Unknown/Unidentified/3000 DP)\n[Opponent's Turn] [Once Per Turn] When one of your opponent's Digimon attacks, you may switch the attack target to 1 of your Digimon with [Diaboromon]\u00a0in its name.",
        "form": "Mega",
        "id": "BT17-059_P1",
        "illustrator": "koki",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Diaboromon",
          "japanese": "\u30c7\u30a3\u30a2\u30dc\u30ed\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "2025 Evolution Cup Season 2",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "12",
        "rarity": "R",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Unidentified",
        "version": "Participation Stamp -\u00a0Top 4 Prize"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 179899,
    "gallery_revision": 170802
  },
  {
    "card": "BT18-054",
    "expected_variants": 3,
    "prepared_variants": 3,
    "available_scans": 2,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 2,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT18-054_P0"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Vaccine",
        "block": [
          "04"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT18-054.webp",
        "cardLv": "Lv.6",
        "cardNumber": "BT18-054",
        "cardType": "Digimon",
        "color": "Green/Red",
        "digiXros": "[DigiXros\u00a0-2] [Kazemon] x [Zephyrmon] When this would be played, you may place specified cards from your hand/battle area under it. Each one reduces the play cost.",
        "digivolveCondition": [
          {
            "color": "Green",
            "cost": "3",
            "level": "5"
          },
          {
            "color": "Red",
            "cost": "3",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "11000",
        "dualEffect": "-",
        "effect": "[On Play] [When Digivolving] Suspend all of your opponent's Digimon with as much or less DP as this Digimon. None of your opponent's Digimon can unsuspend until the end of their turn.\n[All Turns] When this Digimon would leave the battle area, you may play 1 level 4 or lower Digimon card with the [Hybrid]\u00a0trait or [Avian], [Bird] or [Fairy]\u00a0in any of its traits from this Digimon's digivolution cards without paying the cost.",
        "form": "Mega",
        "id": "BT18-054",
        "illustrator": "tyuga",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "AncientKazemon",
          "japanese": "\u30a8\u30f3\u30b7\u30a7\u30f3\u30c8\u30a4\u30ea\u30b9\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9SPECIAL BOOSTER VER.2.0 [BT18-19]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "11",
        "rarity": "R",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Ancient Birdkin/Ten Warriors",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Vaccine",
        "block": [
          "04"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT18-054_P0.webp",
        "cardLv": "Lv.6",
        "cardNumber": "BT18-054",
        "cardType": "Digimon",
        "color": "Green/Red",
        "digiXros": "[DigiXros\u00a0-2] [Kazemon] x [Zephyrmon] When this would be played, you may place specified cards from your hand/battle area under it. Each one reduces the play cost.",
        "digivolveCondition": [
          {
            "color": "Green",
            "cost": "3",
            "level": "5"
          },
          {
            "color": "Red",
            "cost": "3",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "11000",
        "dualEffect": "-",
        "effect": "[On Play] [When Digivolving] Suspend all of your opponent's Digimon with as much or less DP as this Digimon. None of your opponent's Digimon can unsuspend until the end of their turn.\n[All Turns] When this Digimon would leave the battle area, you may play 1 level 4 or lower Digimon card with the [Hybrid]\u00a0trait or [Avian], [Bird] or [Fairy]\u00a0in any of its traits from this Digimon's digivolution cards without paying the cost.",
        "form": "Mega",
        "id": "BT18-054_P0",
        "illustrator": "tyuga",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "AncientKazemon",
          "japanese": "\u30a8\u30f3\u30b7\u30a7\u30f3\u30c8\u30a4\u30ea\u30b9\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Special Booster Ver.2.0 Celebration Event Pack",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "11",
        "rarity": "R",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Ancient Birdkin/Ten Warriors",
        "version": "Foil - Pre Release Stamp -\u00a0Rare"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Vaccine",
        "block": [
          "04"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT18-054_P1.webp",
        "cardLv": "Lv.6",
        "cardNumber": "BT18-054",
        "cardType": "Digimon",
        "color": "Green/Red",
        "digiXros": "[DigiXros\u00a0-2] [Kazemon] x [Zephyrmon] When this would be played, you may place specified cards from your hand/battle area under it. Each one reduces the play cost.",
        "digivolveCondition": [
          {
            "color": "Green",
            "cost": "3",
            "level": "5"
          },
          {
            "color": "Red",
            "cost": "3",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "11000",
        "dualEffect": "-",
        "effect": "[On Play] [When Digivolving] Suspend all of your opponent's Digimon with as much or less DP as this Digimon. None of your opponent's Digimon can unsuspend until the end of their turn.\n[All Turns] When this Digimon would leave the battle area, you may play 1 level 4 or lower Digimon card with the [Hybrid]\u00a0trait or [Avian], [Bird] or [Fairy]\u00a0in any of its traits from this Digimon's digivolution cards without paying the cost.",
        "form": "Mega",
        "id": "BT18-054_P1",
        "illustrator": "Ryodan",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "AncientKazemon",
          "japanese": "\u30a8\u30f3\u30b7\u30a7\u30f3\u30c8\u30a4\u30ea\u30b9\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Tamer's Selection Box ver. Championship 2024",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "11",
        "rarity": "R",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Ancient Birdkin/Ten Warriors",
        "version": "Foil -\u00a0Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 179996,
    "gallery_revision": 159471
  },
  {
    "card": "BT20-013",
    "expected_variants": 2,
    "prepared_variants": 2,
    "available_scans": 2,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 2,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT20-013_P1"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Data",
        "block": [
          "04"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT20-013.webp",
        "cardLv": "Lv.4",
        "cardNumber": "BT20-013",
        "cardType": "Digimon",
        "color": "Red",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Red",
            "cost": "2",
            "level": "3"
          }
        ],
        "digivolveEffect": "[Your Turn] All of your Diigmon get +1000 DP.",
        "dnaDigivolve": "-",
        "dp": "5000",
        "dualEffect": "-",
        "effect": "[Main] [Once Per Turn] You may play 1 Digimon with [Sistermon] or [Gankoomon]\u00a0in its name from your hand with the play cost reduced by 2.",
        "form": "Champion",
        "id": "BT20-013",
        "illustrator": "GOSSAN",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "BaoHuckmon",
          "japanese": "\u30d0\u30aa\u30cf\u30c3\u30af\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9SPECIAL BOOSTER VER.2.5 [BT19-20]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "5",
        "rarity": "C",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Dinosaur",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Data",
        "block": [
          "04"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT20-013_P1.webp",
        "cardLv": "Lv.4",
        "cardNumber": "BT20-013",
        "cardType": "Digimon",
        "color": "Red",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Red",
            "cost": "2",
            "level": "3"
          }
        ],
        "digivolveEffect": "[Your Turn] All of your Diigmon get +1000 DP.",
        "dnaDigivolve": "-",
        "dp": "5000",
        "dualEffect": "-",
        "effect": "[Main] [Once Per Turn] You may play 1 Digimon with [Sistermon] or [Gankoomon]\u00a0in its name from your hand with the play cost reduced by 2.",
        "form": "Champion",
        "id": "BT20-013_P1",
        "illustrator": "GOSSAN",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "BaoHuckmon",
          "japanese": "\u30d0\u30aa\u30cf\u30c3\u30af\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "5",
        "rarity": "C",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Dinosaur",
        "version": "Foil - Coloured Border -\u00a0Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 190822,
    "gallery_revision": 187854
  },
  {
    "card": "BT20-063",
    "expected_variants": 3,
    "prepared_variants": 3,
    "available_scans": 4,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 4,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT20-063_P0"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Data",
        "block": [
          "04"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT20-063.webp",
        "cardLv": "Lv.3",
        "cardNumber": "BT20-063",
        "cardType": "Digimon",
        "color": "Purple",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Purple",
            "cost": "0",
            "level": "2"
          }
        ],
        "digivolveEffect": "[On Deletion] Gain 1 memory.",
        "dnaDigivolve": "-",
        "dp": "1000",
        "dualEffect": "-",
        "effect": "[On Play] Reveal the top 3 cards of your deck. Add 1 card with the [Ghost]\u00a0trait and 1 card with the [LIBERATOR]\u00a0trait among them to the hand. Return the rest to the bottom of the deck.",
        "form": "Rookie",
        "id": "BT20-063",
        "illustrator": "Takeuchi Moto",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Ghostmon",
          "japanese": "\u30b4\u30fc\u30b9\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9SPECIAL BOOSTER VER.2.5 [BT19-20]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "C",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Ghost/LIBERATOR",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Data",
        "block": [
          "04"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT20-063_P0.webp",
        "cardLv": "Lv.3",
        "cardNumber": "BT20-063",
        "cardType": "Digimon",
        "color": "Purple",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Purple",
            "cost": "0",
            "level": "2"
          }
        ],
        "digivolveEffect": "[On Deletion] Gain 1 memory.",
        "dnaDigivolve": "-",
        "dp": "1000",
        "dualEffect": "-",
        "effect": "[On Play] Reveal the top 3 cards of your deck. Add 1 card with the [Ghost]\u00a0trait and 1 card with the [LIBERATOR]\u00a0trait among them to the hand. Return the rest to the bottom of the deck.",
        "form": "Rookie",
        "id": "BT20-063_P0",
        "illustrator": "Takeuchi Moto",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Ghostmon",
          "japanese": "\u30b4\u30fc\u30b9\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Special Booster Ver.2.5 Celebration Event Pack",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "C",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Ghost/LIBERATOR",
        "version": "Foil - Pre Release Stamp -\u00a0Uncommon"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Data",
        "block": [
          "04"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT20-063_P1.webp",
        "cardLv": "Lv.3",
        "cardNumber": "BT20-063",
        "cardType": "Digimon",
        "color": "Purple",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Purple",
            "cost": "0",
            "level": "2"
          }
        ],
        "digivolveEffect": "[On Deletion] Gain 1 memory.",
        "dnaDigivolve": "-",
        "dp": "1000",
        "dualEffect": "-",
        "effect": "[On Play] Reveal the top 3 cards of your deck. Add 1 card with the [Ghost]\u00a0trait and 1 card with the [LIBERATOR]\u00a0trait among them to the hand. Return the rest to the bottom of the deck.",
        "form": "Rookie",
        "id": "BT20-063_P1",
        "illustrator": "Takase",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Ghostmon",
          "japanese": "\u30b4\u30fc\u30b9\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "BT19-20: Special Booster Ver.2.5",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "C",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Ghost/LIBERATOR",
        "version": "Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 180203,
    "gallery_revision": 151056
  },
  {
    "card": "BT21-046",
    "expected_variants": 2,
    "prepared_variants": 2,
    "available_scans": 2,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 2,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT21-046_P1"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Data",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT21-046.webp",
        "cardLv": "Lv.3",
        "cardNumber": "BT21-046",
        "cardType": "Digimon",
        "color": "Green/Blue",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Green",
            "cost": "1",
            "level": "2"
          },
          {
            "color": "Blue",
            "cost": "1",
            "level": "2"
          }
        ],
        "digivolveEffect": "[End of Your Turn] This Digimon and any of your other Digimon may DNA digivolve into a Digimon card in the hand.",
        "dnaDigivolve": "-",
        "dp": "3000",
        "dualEffect": "-",
        "effect": "[Start of Your Main Phase] [When Digivolving] This Digimon may digivolve into [Coredramon] in the hand without paying the cost.",
        "form": "Rookie",
        "id": "BT21-046",
        "illustrator": "toriyufu",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Dracomon (X Antibody)",
          "japanese": "\u30c9\u30e9\u30b3\u30e2\u30f3X\u6297\u4f53",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER WORLD CONVERGENCE [BT-21]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "4",
        "rarity": "R",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "[Digivolve]  [Dracomon]: Cost 0 ",
        "type": "Dragon/X Antibody",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Data",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT21-046_P1.webp",
        "cardLv": "Lv.3",
        "cardNumber": "BT21-046",
        "cardType": "Digimon",
        "color": "Green/Blue",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Green",
            "cost": "1",
            "level": "2"
          },
          {
            "color": "Blue",
            "cost": "1",
            "level": "2"
          }
        ],
        "digivolveEffect": "[End of Your Turn] This Digimon and any of your other Digimon may DNA digivolve into a Digimon card in the hand.",
        "dnaDigivolve": "-",
        "dp": "3000",
        "dualEffect": "-",
        "effect": "[Start of Your Main Phase] [When Digivolving] This Digimon may digivolve into [Coredramon] in the hand without paying the cost.",
        "form": "Rookie",
        "id": "BT21-046_P1",
        "illustrator": "toriyufu",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Dracomon (X Antibody)",
          "japanese": "\u30c9\u30e9\u30b3\u30e2\u30f3X\u6297\u4f53",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "4",
        "rarity": "R",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "[Digivolve]  [Dracomon]: Cost 0 ",
        "type": "Dragon/X Antibody",
        "version": "Foil - Coloured Border -\u00a0Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 190098,
    "gallery_revision": 187858
  },
  {
    "card": "BT22-004",
    "expected_variants": 2,
    "prepared_variants": 2,
    "available_scans": 1,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 1,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT22-004_P1"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT22-004.webp",
        "cardLv": "Lv.2",
        "cardNumber": "BT22-004",
        "cardType": "Digi-Egg",
        "color": "Green",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "[Your Turn] [Once Per Turn] When effects place [CS]\u00a0trait Digimon cards in this Digimon's digivolution cards, it may digivolve into a [CS]\u00a0trait Digimon card in the hand with the digivolution cost reduced by 1.",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "In-Training",
        "id": "BT22-004",
        "illustrator": "Iori Sunakura",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Wanyamon",
          "japanese": "\u30ef\u30cb\u30e3\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER CYBER EDEN [BT-22]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "C",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Lesser/CS",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT22-004_P1.webp",
        "cardLv": "Lv.2",
        "cardNumber": "BT22-004",
        "cardType": "Digi-Egg",
        "color": "Green",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "[Your Turn] [Once Per Turn] When effects place [CS]\u00a0trait Digimon cards in this Digimon's digivolution cards, it may digivolve into a [CS]\u00a0trait Digimon card in the hand with the digivolution cost reduced by 1.",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "In-Training",
        "id": "BT22-004_P1",
        "illustrator": "Takase",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Wanyamon",
          "japanese": "\u30ef\u30cb\u30e3\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "2026 Evolution Cup Season 2",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "C",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Lesser/CS",
        "version": "Participation Stamp -\u00a0Participation"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 185617,
    "gallery_revision": 185620
  },
  {
    "card": "BT22-005",
    "expected_variants": 2,
    "prepared_variants": 2,
    "available_scans": 2,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 2,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT22-005_P1"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT22-005.webp",
        "cardLv": "Lv.2",
        "cardNumber": "BT22-005",
        "cardType": "Digi-Egg",
        "color": "Black",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "[Your Turn] [Once Per Turn] When any of your Digimon with the [Unidentified] or [CS]\u00a0trait are played, \uff1cDraw 1\uff1e (Draw 1 card from your deck.)",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "In-Training",
        "id": "BT22-005",
        "illustrator": "Kazumasa Yasukuni",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Tsumemon",
          "japanese": "\u30c4\u30e1\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER CYBER EDEN [BT-22]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "C",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Unidentified/CS",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT22-005_P1.webp",
        "cardLv": "Lv.2",
        "cardNumber": "BT22-005",
        "cardType": "Digi-Egg",
        "color": "Black",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "[Your Turn] [Once Per Turn] When any of your Digimon with the [Unidentified] or [CS]\u00a0trait are played, \uff1cDraw 1\uff1e (Draw 1 card from your deck.)",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "In-Training",
        "id": "BT22-005_P1",
        "illustrator": "koki",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Tsumemon",
          "japanese": "\u30c4\u30e1\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "C",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Unidentified/CS",
        "version": "Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 185971,
    "gallery_revision": 185979
  },
  {
    "card": "BT22-063",
    "expected_variants": 3,
    "prepared_variants": 3,
    "available_scans": 3,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 3,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT22-063_P2"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Vaccine",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT22-063.webp",
        "cardLv": "Lv.6",
        "cardNumber": "BT22-063",
        "cardType": "Digimon",
        "color": "Black/Yellow",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Black",
            "cost": "4",
            "level": "5"
          },
          {
            "color": "Yellow",
            "cost": "4",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "12000",
        "dualEffect": "-",
        "effect": "\uff1cReboot\uff1e (This Digimon also unsuspends in your opponent's unsuspend phase.)\n\uff1cBlocker\uff1e (This Digimon can block in the blocker timing.)\n[On Play] [When Digivolving] [When Attacking] 1 of your opponent's Digimon gets -5000 DP for the turn.\n[All Turns] [Once Per Turn] When this Digimon suspends, if [Kyoko Kuremi] is in this Digimon's digivolution cards or if this Digimon's stack has 2 or more same-level cards, it gets +3000 DP until your opponent's turn ends. Then, this Digimon unsuspends.",
        "form": "Mega",
        "id": "BT22-063",
        "illustrator": "Spareribs",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Alphamon",
          "japanese": "\u30a2\u30eb\u30d5\u30a1\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER CYBER EDEN [BT-22]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "12",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "[Digivolve]  Lv.5 w/[CS]\u00a0trait: Cost 3\n[Digivolve]  While you have 3 or fewer security cards, [Kyoko Kuremi]: Cost 5 ",
        "type": "Holy Warrior/X Antibody/Royal Knight/CS",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Vaccine",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT22-063_P1.webp",
        "cardLv": "Lv.6",
        "cardNumber": "BT22-063",
        "cardType": "Digimon",
        "color": "Black/Yellow",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Black",
            "cost": "4",
            "level": "5"
          },
          {
            "color": "Yellow",
            "cost": "4",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "12000",
        "dualEffect": "-",
        "effect": "\uff1cReboot\uff1e (This Digimon also unsuspends in your opponent's unsuspend phase.)\n\uff1cBlocker\uff1e (This Digimon can block in the blocker timing.)\n[On Play] [When Digivolving] [When Attacking] 1 of your opponent's Digimon gets -5000 DP for the turn.\n[All Turns] [Once Per Turn] When this Digimon suspends, if [Kyoko Kuremi] is in this Digimon's digivolution cards or if this Digimon's stack has 2 or more same-level cards, it gets +3000 DP until your opponent's turn ends. Then, this Digimon unsuspends.",
        "form": "Mega",
        "id": "BT22-063_P1",
        "illustrator": "Tonamikanji",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Alphamon",
          "japanese": "\u30a2\u30eb\u30d5\u30a1\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "BT-22: BOOSTER CYBER EDEN",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "12",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "[Digivolve]  Lv.5 w/[CS]\u00a0trait: Cost 3\n[Digivolve]  While you have 3 or fewer security cards, [Kyoko Kuremi]: Cost 5 ",
        "type": "Holy Warrior/X Antibody/Royal Knight/CS",
        "version": "Alternative Art"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Vaccine",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT22-063_P2.webp",
        "cardLv": "Lv.6",
        "cardNumber": "BT22-063",
        "cardType": "Digimon",
        "color": "Black/Yellow",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Black",
            "cost": "4",
            "level": "5"
          },
          {
            "color": "Yellow",
            "cost": "4",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "12000",
        "dualEffect": "-",
        "effect": "\uff1cReboot\uff1e (This Digimon also unsuspends in your opponent's unsuspend phase.)\n\uff1cBlocker\uff1e (This Digimon can block in the blocker timing.)\n[On Play] [When Digivolving] [When Attacking] 1 of your opponent's Digimon gets -5000 DP for the turn.\n[All Turns] [Once Per Turn] When this Digimon suspends, if [Kyoko Kuremi] is in this Digimon's digivolution cards or if this Digimon's stack has 2 or more same-level cards, it gets +3000 DP until your opponent's turn ends. Then, this Digimon unsuspends.",
        "form": "Mega",
        "id": "BT22-063_P2",
        "illustrator": "Nakano Haito",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Alphamon",
          "japanese": "\u30a2\u30eb\u30d5\u30a1\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "2026 Evolution Cup Season 2",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "12",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "[Digivolve]  Lv.5 w/[CS]\u00a0trait: Cost 3\n[Digivolve]  While you have 3 or fewer security cards, [Kyoko Kuremi]: Cost 5 ",
        "type": "Holy Warrior/X Antibody/Royal Knight/CS",
        "version": "Participation Stamp -\u00a01st Place Prize"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 190079,
    "gallery_revision": 185622
  },
  {
    "card": "BT22-099",
    "expected_variants": 2,
    "prepared_variants": 2,
    "available_scans": 1,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 1,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT22-099_P1"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT22-099.webp",
        "cardLv": "-",
        "cardNumber": "BT22-099",
        "cardType": "Option",
        "color": "Black/Yellow",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "While you have a [CS]\u00a0trait Digimon or Tamer on the field, you can ignore this card's color requirements.\n[Main] Reveal the top 3 cards of your deck. Add 1 [CS]\u00a0trait card among them to the hand. Return the rest to the bottom of the deck. Then, place this card in the battle area.\n[Main] \uff1cDelay\uff1e (By trashing this card after the placing turn, activate the effect below.)\n\u30fbGain 2 memory.",
        "form": "-",
        "id": "BT22-099",
        "illustrator": "itohiro",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Kuremi Detective Agency",
          "japanese": "\u66ae\u6d77\u63a2\u5075\u4e8b\u52d9\u6240",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER CYBER EDEN [BT-22]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "U",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Place this card in the battle area.",
        "specialDigivolve": "-",
        "type": "CS",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT22-099_P1.webp",
        "cardLv": "-",
        "cardNumber": "BT22-099",
        "cardType": "Option",
        "color": "Black/Yellow",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "While you have a [CS]\u00a0trait Digimon or Tamer on the field, you can ignore this card's color requirements.\n[Main] Reveal the top 3 cards of your deck. Add 1 [CS]\u00a0trait card among them to the hand. Return the rest to the bottom of the deck. Then, place this card in the battle area.\n[Main] \uff1cDelay\uff1e (By trashing this card after the placing turn, activate the effect below.)\n\u30fbGain 2 memory.",
        "form": "-",
        "id": "BT22-099_P1",
        "illustrator": "Tonamikanji",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Kuremi Detective Agency",
          "japanese": "\u66ae\u6d77\u63a2\u5075\u4e8b\u52d9\u6240",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "2026 Evolution Cup Season 2",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "U",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Place this card in the battle area.",
        "specialDigivolve": "-",
        "type": "CS",
        "version": "Participation Stamp -\u00a0Top 4 Prize"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 185618,
    "gallery_revision": 185621
  },
  {
    "card": "BT23-013",
    "expected_variants": 3,
    "prepared_variants": 3,
    "available_scans": 4,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 4,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT23-013_P2"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Data",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT23-013.webp",
        "cardLv": "Lv.6",
        "cardNumber": "BT23-013",
        "cardType": "Digimon",
        "color": "Red",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Red",
            "cost": "4",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "12000",
        "dualEffect": "-",
        "effect": "\uff1cRush\uff1e (This Digimon can attack the turn it was played.)\n\uff1cAlliance\uff1e (When this Digimon attacks, by suspending 1 of your other Digimon, this Digimon gains \uff1cSecurity A. +1\uff1e and the suspended Digimon's DP for the attack.)\n[When Digivolving] [When Attacking] You may play 1 [Atho, Ren\u00e9 & Por] Token (Digimon/White/6000 DP/\uff1cReboot\uff1e \uff1cBlocker\uff1e \uff1cDecoy (Red)/(Black)\uff1e) or, from your hand or trash, 1 Digimon card with [Sistermon]\u00a0in its name without paying the cost. This effect can't play cards with the same names as any of your Digimon.\n[Your Turn] [Once Per Turn] When any of your other Digimon are played, this Digimon may attack.",
        "form": "Mega",
        "id": "BT23-013",
        "illustrator": "Ishibashi Yosuke",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Jesmon",
          "japanese": "\u30b8\u30a8\u30b9\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "BT-23: BOOSTER HACKERS' SLUMBER",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "12",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "[Digivolve]  [SaviorHuckmon]/Lv.5 w/[CS]\u00a0trait: Cost 3\n[Digivolve]  While opponent has a 10000 DP or higher Digimon, [Huckmon]: Cost 5 ",
        "type": "Holy Warrior/Royal Knight/CS",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Data",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT23-013_P1.webp",
        "cardLv": "Lv.6",
        "cardNumber": "BT23-013",
        "cardType": "Digimon",
        "color": "Red",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Red",
            "cost": "4",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "12000",
        "dualEffect": "-",
        "effect": "\uff1cRush\uff1e (This Digimon can attack the turn it was played.)\n\uff1cAlliance\uff1e (When this Digimon attacks, by suspending 1 of your other Digimon, this Digimon gains \uff1cSecurity A. +1\uff1e and the suspended Digimon's DP for the attack.)\n[When Digivolving] [When Attacking] You may play 1 [Atho, Ren\u00e9 & Por] Token (Digimon/White/6000 DP/\uff1cReboot\uff1e \uff1cBlocker\uff1e \uff1cDecoy (Red)/(Black)\uff1e) or, from your hand or trash, 1 Digimon card with [Sistermon]\u00a0in its name without paying the cost. This effect can't play cards with the same names as any of your Digimon.\n[Your Turn] [Once Per Turn] When any of your other Digimon are played, this Digimon may attack.",
        "form": "Mega",
        "id": "BT23-013_P1",
        "illustrator": "Spareribs",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Jesmon",
          "japanese": "\u30b8\u30a8\u30b9\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "BT-23: BOOSTER HACKERS' SLUMBER",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "12",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "[Digivolve]  [SaviorHuckmon]/Lv.5 w/[CS]\u00a0trait: Cost 3\n[Digivolve]  While opponent has a 10000 DP or higher Digimon, [Huckmon]: Cost 5 ",
        "type": "Holy Warrior/Royal Knight/CS",
        "version": "Alternative Art"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Data",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT23-013_P2.webp",
        "cardLv": "Lv.6",
        "cardNumber": "BT23-013",
        "cardType": "Digimon",
        "color": "Red",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Red",
            "cost": "4",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "12000",
        "dualEffect": "-",
        "effect": "\uff1cRush\uff1e (This Digimon can attack the turn it was played.)\n\uff1cAlliance\uff1e (When this Digimon attacks, by suspending 1 of your other Digimon, this Digimon gains \uff1cSecurity A. +1\uff1e and the suspended Digimon's DP for the attack.)\n[When Digivolving] [When Attacking] You may play 1 [Atho, Ren\u00e9 & Por] Token (Digimon/White/6000 DP/\uff1cReboot\uff1e \uff1cBlocker\uff1e \uff1cDecoy (Red)/(Black)\uff1e) or, from your hand or trash, 1 Digimon card with [Sistermon]\u00a0in its name without paying the cost. This effect can't play cards with the same names as any of your Digimon.\n[Your Turn] [Once Per Turn] When any of your other Digimon are played, this Digimon may attack.",
        "form": "Mega",
        "id": "BT23-013_P2",
        "illustrator": "Moyasi",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Jesmon",
          "japanese": "\u30b8\u30a8\u30b9\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "12",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "[Digivolve]  [SaviorHuckmon]/Lv.5 w/[CS]\u00a0trait: Cost 3\n[Digivolve]  While opponent has a 10000 DP or higher Digimon, [Huckmon]: Cost 5 ",
        "type": "Holy Warrior/Royal Knight/CS",
        "version": "Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 190835,
    "gallery_revision": 185978
  },
  {
    "card": "BT23-092",
    "expected_variants": 2,
    "prepared_variants": 2,
    "available_scans": 2,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 2,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT23-092_P1"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT23-092.webp",
        "cardLv": "-",
        "cardNumber": "BT23-092",
        "cardType": "Option",
        "color": "Blue",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "While you have a Digimon or Tamer with the [CS]\u00a0trait on the field, you can ignore this card's color requirements.\n[Main] Until your opponent's turn ends, 1 of their Digimon and 1 of their Tamers can't suspend. Then, place this card in the battle area.\n[Your Turn] When one of your [CS]\u00a0trait Digimon attacks, \uff1cDelay\uff1e (By trashing this card after the placing turn, activate the effect below.)\n\u30fbUntil your opponent's turn ends, 1 of their Digimon and 1 of their Tamers can't suspend.",
        "form": "-",
        "id": "BT23-092",
        "illustrator": "poroze",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Ice Archery",
          "japanese": "\u30a2\u30a4\u30b9\u30a2\u30fc\u30c1\u30a7\u30ea\u30fc",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "BT-23: BOOSTER HACKERS' SLUMBER",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "5",
        "rarity": "C",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Until your opponent's turn ends, 1 of their Digimon and 1 of their Tamers can't suspend. Then, place this card in the battle area.",
        "specialDigivolve": "-",
        "type": "CS",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT23-092_P1.webp",
        "cardLv": "-",
        "cardNumber": "BT23-092",
        "cardType": "Option",
        "color": "Blue",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "While you have a Digimon or Tamer with the [CS]\u00a0trait on the field, you can ignore this card's color requirements.\n[Main] Until your opponent's turn ends, 1 of their Digimon and 1 of their Tamers can't suspend. Then, place this card in the battle area.\n[Your Turn] When one of your [CS]\u00a0trait Digimon attacks, \uff1cDelay\uff1e (By trashing this card after the placing turn, activate the effect below.)\n\u30fbUntil your opponent's turn ends, 1 of their Digimon and 1 of their Tamers can't suspend.",
        "form": "-",
        "id": "BT23-092_P1",
        "illustrator": "poroze",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Ice Archery",
          "japanese": "\u30a2\u30a4\u30b9\u30a2\u30fc\u30c1\u30a7\u30ea\u30fc",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "5",
        "rarity": "C",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Until your opponent's turn ends, 1 of their Digimon and 1 of their Tamers can't suspend. Then, place this card in the battle area.",
        "specialDigivolve": "-",
        "type": "CS",
        "version": "Foil - Coloured Border -\u00a0Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 187847,
    "gallery_revision": 187861
  },
  {
    "card": "BT23-099",
    "expected_variants": 2,
    "prepared_variants": 2,
    "available_scans": 2,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 2,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT23-099_P1"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT23-099.webp",
        "cardLv": "-",
        "cardNumber": "BT23-099",
        "cardType": "Option",
        "color": "White",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "While you have a Digimon with [Huckmon]\u00a0in its name the field, you can ignore this card's color requirements.\n[Main] \uff1cDraw 1\uff1e (Draw 1 card from your deck.) Then, place this card in the battle area.\n[Your Turn] When any of your Digimon digivolve into a Digimon with [Huckmon] or [Jesmon]\u00a0in its name, \uff1cDelay\uff1e (By trashing this card after the placing turn, activate the effect below.)\n\u30fbYou may play 1 card with [Sistermon]\u00a0in its name from your hand or trash without paying the cost.",
        "form": "-",
        "id": "BT23-099",
        "illustrator": "Tsunemi Aosa",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "The Sistermon Sisters Training Gym",
          "japanese": "\u30b7\u30b9\u30bf\u30e2\u30f3\u59c9\u59b9\u306e\u30c8\u30ec\u30fc\u30cb\u30f3\u30b0\u30b8\u30e0",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "BT-23: BOOSTER HACKERS' SLUMBER",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "2",
        "rarity": "U",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] You may play 1 card with [Sistermon]\u00a0in its name from your hand or trash without paying the cost. Then, place this card in the battle area.",
        "specialDigivolve": "-",
        "type": "CS",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT23-099_P1.webp",
        "cardLv": "-",
        "cardNumber": "BT23-099",
        "cardType": "Option",
        "color": "White",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "While you have a Digimon with [Huckmon]\u00a0in its name the field, you can ignore this card's color requirements.\n[Main] \uff1cDraw 1\uff1e (Draw 1 card from your deck.) Then, place this card in the battle area.\n[Your Turn] When any of your Digimon digivolve into a Digimon with [Huckmon] or [Jesmon]\u00a0in its name, \uff1cDelay\uff1e (By trashing this card after the placing turn, activate the effect below.)\n\u30fbYou may play 1 card with [Sistermon]\u00a0in its name from your hand or trash without paying the cost.",
        "form": "-",
        "id": "BT23-099_P1",
        "illustrator": "Tsunemi Aosa",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "The Sistermon Sisters Training Gym",
          "japanese": "\u30b7\u30b9\u30bf\u30e2\u30f3\u59c9\u59b9\u306e\u30c8\u30ec\u30fc\u30cb\u30f3\u30b0\u30b8\u30e0",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "2",
        "rarity": "U",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] You may play 1 card with [Sistermon]\u00a0in its name from your hand or trash without paying the cost. Then, place this card in the battle area.",
        "specialDigivolve": "-",
        "type": "CS",
        "version": "Foil - Coloured Border -\u00a0Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 190847,
    "gallery_revision": 187855
  },
  {
    "card": "BT24-018",
    "expected_variants": 3,
    "prepared_variants": 3,
    "available_scans": 4,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 4,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT24-018_P2"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Data",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT24-018.webp",
        "cardLv": "Lv.7",
        "cardNumber": "BT24-018",
        "cardType": "Digimon",
        "color": "Red",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Red",
            "cost": "4",
            "level": "6"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "14000",
        "dualEffect": "-",
        "effect": "\uff1cProgress\uff1e (While attacking, your opponent's effects don't affect this Digimon.)\n\uff1cPiercing\uff1e (When this Digimon deletes your opponent's Digimon in battle while attacking, it checks security before the attack ends.)\n\uff1cBlocker\uff1e (This Digimon can block in the blocker timing.)\n\uff1cArmor Purge\uff1e  (When this Digimon would be deleted, you may trash the top card of this Digimon to prevent that deletion.)\n[When Digivolving] You may trash any 1 of your opponent's security cards. Then, this Digimon may unsuspend.\n[All Turns] [Once Per Turn] When your opponent's security stack is removed from, you may delete 1 of their Digimon.\n[All Turns] [Once Per Turn] When any of your [Reptile] or [Dragonkin]\u00a0trait Digimon would leave the battle area, by deleting 1 of your opponent's lowest DP Digimon, they don't leave.",
        "form": "Mega",
        "id": "BT24-018",
        "illustrator": "koki",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Styracomon",
          "japanese": "\u30b9\u30c6\u30a3\u30e9\u30b3\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER TIME STRANGER [BT-24]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "14",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "[Digivolve]  While you have [Owen Dreadnought], [Lamiamon]: Cost 6 ",
        "type": "Dragonkin/LIBERATOR",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Data",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT24-018_P1.webp",
        "cardLv": "Lv.7",
        "cardNumber": "BT24-018",
        "cardType": "Digimon",
        "color": "Red",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Red",
            "cost": "4",
            "level": "6"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "14000",
        "dualEffect": "-",
        "effect": "\uff1cProgress\uff1e (While attacking, your opponent's effects don't affect this Digimon.)\n\uff1cPiercing\uff1e (When this Digimon deletes your opponent's Digimon in battle while attacking, it checks security before the attack ends.)\n\uff1cBlocker\uff1e (This Digimon can block in the blocker timing.)\n\uff1cArmor Purge\uff1e  (When this Digimon would be deleted, you may trash the top card of this Digimon to prevent that deletion.)\n[When Digivolving] You may trash any 1 of your opponent's security cards. Then, this Digimon may unsuspend.\n[All Turns] [Once Per Turn] When your opponent's security stack is removed from, you may delete 1 of their Digimon.\n[All Turns] [Once Per Turn] When any of your [Reptile] or [Dragonkin]\u00a0trait Digimon would leave the battle area, by deleting 1 of your opponent's lowest DP Digimon, they don't leave.",
        "form": "Mega",
        "id": "BT24-018_P1",
        "illustrator": "Spareribs",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Styracomon",
          "japanese": "\u30b9\u30c6\u30a3\u30e9\u30b3\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "BT-24: BOOSTER TIME STRANGER",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "14",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "[Digivolve]  While you have [Owen Dreadnought], [Lamiamon]: Cost 6 ",
        "type": "Dragonkin/LIBERATOR",
        "version": "Alternative Art"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Data",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT24-018_P2.webp",
        "cardLv": "Lv.7",
        "cardNumber": "BT24-018",
        "cardType": "Digimon",
        "color": "Red",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Red",
            "cost": "4",
            "level": "6"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "14000",
        "dualEffect": "-",
        "effect": "\uff1cProgress\uff1e (While attacking, your opponent's effects don't affect this Digimon.)\n\uff1cPiercing\uff1e (When this Digimon deletes your opponent's Digimon in battle while attacking, it checks security before the attack ends.)\n\uff1cBlocker\uff1e (This Digimon can block in the blocker timing.)\n\uff1cArmor Purge\uff1e  (When this Digimon would be deleted, you may trash the top card of this Digimon to prevent that deletion.)\n[When Digivolving] You may trash any 1 of your opponent's security cards. Then, this Digimon may unsuspend.\n[All Turns] [Once Per Turn] When your opponent's security stack is removed from, you may delete 1 of their Digimon.\n[All Turns] [Once Per Turn] When any of your [Reptile] or [Dragonkin]\u00a0trait Digimon would leave the battle area, by deleting 1 of your opponent's lowest DP Digimon, they don't leave.",
        "form": "Mega",
        "id": "BT24-018_P2",
        "illustrator": "Spareribs",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Styracomon",
          "japanese": "\u30b9\u30c6\u30a3\u30e9\u30b3\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "14",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "[Digivolve]  While you have [Owen Dreadnought], [Lamiamon]: Cost 6 ",
        "type": "Dragonkin/LIBERATOR",
        "version": "Foil - Coloured Border -\u00a0Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 187848,
    "gallery_revision": 187862
  },
  {
    "card": "BT24-085",
    "expected_variants": 4,
    "prepared_variants": 4,
    "available_scans": 5,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 5,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT24-085_P3"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT24-085.webp",
        "cardLv": "-",
        "cardNumber": "BT24-085",
        "cardType": "Tamer",
        "color": "Green/Red",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Start of Your Main Phase] If you have 4 or less memory, gain 1 memory.\n[End of Your Turn] By suspending this Tamer, you may use 1 [TS]\u00a0trait Option card with as high or lower a use cost as your opponent's memory from your hand without paying the cost. Then, 1 of your Digimon with the [TS]\u00a0trait may attack.",
        "form": "-",
        "id": "BT24-085",
        "illustrator": "Takase",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Dan Yuki & Kanan Yuki",
          "japanese": "\u7d50\u57ce\u30c0\u30f3\uff06\u7d50\u57ce\u30ab\u30ca\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER TIME STRANGER [BT-24]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "4",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Play this card without paying the cost.",
        "specialDigivolve": "-",
        "type": "ADAMAS/TS",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT24-085_P1.webp",
        "cardLv": "-",
        "cardNumber": "BT24-085",
        "cardType": "Tamer",
        "color": "Green/Red",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Start of Your Main Phase] If you have 4 or less memory, gain 1 memory.\n[End of Your Turn] By suspending this Tamer, you may use 1 [TS]\u00a0trait Option card with as high or lower a use cost as your opponent's memory from your hand without paying the cost. Then, 1 of your Digimon with the [TS]\u00a0trait may attack.",
        "form": "-",
        "id": "BT24-085_P1",
        "illustrator": "Tonamikanji",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Dan Yuki & Kanan Yuki",
          "japanese": "\u7d50\u57ce\u30c0\u30f3\uff06\u7d50\u57ce\u30ab\u30ca\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "BT-24: BOOSTER TIME STRANGER",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "4",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Play this card without paying the cost.",
        "specialDigivolve": "-",
        "type": "ADAMAS/TS",
        "version": "Alternative Art"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT24-085_P2.webp",
        "cardLv": "-",
        "cardNumber": "BT24-085",
        "cardType": "Tamer",
        "color": "Green/Red",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Start of Your Main Phase] If you have 4 or less memory, gain 1 memory.\n[End of Your Turn] By suspending this Tamer, you may use 1 [TS]\u00a0trait Option card with as high or lower a use cost as your opponent's memory from your hand without paying the cost. Then, 1 of your Digimon with the [TS]\u00a0trait may attack.",
        "form": "-",
        "id": "BT24-085_P2",
        "illustrator": "Tonamikanji",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Dan Yuki & Kanan Yuki",
          "japanese": "\u7d50\u57ce\u30c0\u30f3\uff06\u7d50\u57ce\u30ab\u30ca\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "BT-24: BOOSTER TIME STRANGER",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "4",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Play this card without paying the cost.",
        "specialDigivolve": "-",
        "type": "ADAMAS/TS",
        "version": "Special Rare"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT24-085_P3.webp",
        "cardLv": "-",
        "cardNumber": "BT24-085",
        "cardType": "Tamer",
        "color": "Green/Red",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Start of Your Main Phase] If you have 4 or less memory, gain 1 memory.\n[End of Your Turn] By suspending this Tamer, you may use 1 [TS]\u00a0trait Option card with as high or lower a use cost as your opponent's memory from your hand without paying the cost. Then, 1 of your Digimon with the [TS]\u00a0trait may attack.",
        "form": "-",
        "id": "BT24-085_P3",
        "illustrator": "Tonamikanji",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Dan Yuki & Kanan Yuki",
          "japanese": "\u7d50\u57ce\u30c0\u30f3\uff06\u7d50\u57ce\u30ab\u30ca\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "4",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Play this card without paying the cost.",
        "specialDigivolve": "-",
        "type": "ADAMAS/TS",
        "version": "Foil - Coloured Border -\u00a0Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 187849,
    "gallery_revision": 187852
  },
  {
    "card": "BT27-001",
    "expected_variants": 1,
    "prepared_variants": 1,
    "available_scans": 0,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 0,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-001"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-001.webp",
        "cardLv": "-",
        "cardNumber": "BT27-001",
        "cardType": "",
        "color": "[[]]",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "-",
        "id": "BT27-001",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "[[:Category:|]]",
          "japanese": "",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "-",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Normal"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 193189,
    "gallery_revision": 188408
  },
  {
    "card": "BT27-005",
    "expected_variants": 1,
    "prepared_variants": 1,
    "available_scans": 0,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 0,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-005"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-005.webp",
        "cardLv": "-",
        "cardNumber": "BT27-005",
        "cardType": "Digi-Egg",
        "color": "[[]]",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "-",
        "id": "BT27-005",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "[[:Category:|]]",
          "japanese": "",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "-",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Normal"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 193372,
    "gallery_revision": 192315
  },
  {
    "card": "BT27-006",
    "expected_variants": 1,
    "prepared_variants": 1,
    "available_scans": 0,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 0,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-006"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-006.webp",
        "cardLv": "-",
        "cardNumber": "BT27-006",
        "cardType": "",
        "color": "[[]]",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "-",
        "id": "BT27-006",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "[[:Category:|]]",
          "japanese": "",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "-",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Normal"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 191995,
    "gallery_revision": 192316
  },
  {
    "card": "BT27-011",
    "expected_variants": 1,
    "prepared_variants": 1,
    "available_scans": 0,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 0,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-011"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-011.webp",
        "cardLv": "Lv.4",
        "cardNumber": "BT27-011",
        "cardType": "Digimon",
        "color": "Red",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "Champion",
        "id": "BT27-011",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "[[:Category:|]]",
          "japanese": "",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "-",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Normal"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 193412,
    "gallery_revision": 192321
  },
  {
    "card": "BT27-014",
    "expected_variants": 1,
    "prepared_variants": 1,
    "available_scans": 0,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 0,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-014"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-014.webp",
        "cardLv": "-",
        "cardNumber": "BT27-014",
        "cardType": "",
        "color": "[[]]",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "-",
        "id": "BT27-014",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "[[:Category:|]]",
          "japanese": "",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "-",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Normal"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 192003,
    "gallery_revision": 192324
  },
  {
    "card": "BT27-016",
    "expected_variants": 1,
    "prepared_variants": 1,
    "available_scans": 0,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 0,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-016"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-016.webp",
        "cardLv": "Lv.6",
        "cardNumber": "BT27-016",
        "cardType": "",
        "color": "Red",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "Mega",
        "id": "BT27-016",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "[[:Category:|]]",
          "japanese": "",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "-",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Normal"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 193413,
    "gallery_revision": 192326
  },
  {
    "card": "BT27-018",
    "expected_variants": 1,
    "prepared_variants": 1,
    "available_scans": 0,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 0,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-018"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-018.webp",
        "cardLv": "-",
        "cardNumber": "BT27-018",
        "cardType": "",
        "color": "[[]]",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "-",
        "id": "BT27-018",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "[[:Category:|]]",
          "japanese": "",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "-",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Normal"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 192007,
    "gallery_revision": 192328
  },
  {
    "card": "BT27-019",
    "expected_variants": 1,
    "prepared_variants": 1,
    "available_scans": 0,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 0,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-019"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-019.webp",
        "cardLv": "-",
        "cardNumber": "BT27-019",
        "cardType": "",
        "color": "[[]]",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "-",
        "id": "BT27-019",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "[[:Category:|]]",
          "japanese": "",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "-",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Normal"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 192008,
    "gallery_revision": 192329
  },
  {
    "card": "BT27-022",
    "expected_variants": 1,
    "prepared_variants": 1,
    "available_scans": 0,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 0,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-022"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-022.webp",
        "cardLv": "-",
        "cardNumber": "BT27-022",
        "cardType": "",
        "color": "[[]]",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "-",
        "id": "BT27-022",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "[[:Category:|]]",
          "japanese": "",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "-",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Normal"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 193196,
    "gallery_revision": 192332
  },
  {
    "card": "BT27-024",
    "expected_variants": 1,
    "prepared_variants": 1,
    "available_scans": 0,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 0,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-024"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-024.webp",
        "cardLv": "Lv.4",
        "cardNumber": "BT27-024",
        "cardType": "Digimon",
        "color": "Blue",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "Champion",
        "id": "BT27-024",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "[[:Category:|]]",
          "japanese": "",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "-",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Normal"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 193277,
    "gallery_revision": 192334
  },
  {
    "card": "BT27-027",
    "expected_variants": 1,
    "prepared_variants": 1,
    "available_scans": 0,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 0,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-027"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-027.webp",
        "cardLv": "-",
        "cardNumber": "BT27-027",
        "cardType": "",
        "color": "[[]]",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "-",
        "id": "BT27-027",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "[[:Category:|]]",
          "japanese": "",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "-",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Normal"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 193200,
    "gallery_revision": 192337
  },
  {
    "card": "BT27-029",
    "expected_variants": 1,
    "prepared_variants": 1,
    "available_scans": 0,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 0,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-029"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-029.webp",
        "cardLv": "-",
        "cardNumber": "BT27-029",
        "cardType": "",
        "color": "[[]]",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "-",
        "id": "BT27-029",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "[[:Category:|]]",
          "japanese": "",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "-",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Normal"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 193201,
    "gallery_revision": 192339
  },
  {
    "card": "BT27-030",
    "expected_variants": 1,
    "prepared_variants": 1,
    "available_scans": 0,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 0,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-030"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-030.webp",
        "cardLv": "-",
        "cardNumber": "BT27-030",
        "cardType": "",
        "color": "[[]]",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "-",
        "id": "BT27-030",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "[[:Category:|]]",
          "japanese": "",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "-",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Normal"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 193202,
    "gallery_revision": 192340
  },
  {
    "card": "BT27-032",
    "expected_variants": 1,
    "prepared_variants": 1,
    "available_scans": 0,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 0,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-032"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Data",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-032.webp",
        "cardLv": "Lv.6",
        "cardNumber": "BT27-032",
        "cardType": "Digimon/Option",
        "color": "Blue/Black",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Blue",
            "cost": "4",
            "level": "5"
          },
          {
            "color": "Black",
            "cost": "4",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "12000",
        "dualEffect": "[Arts Digivolve] (Instead of trashing after use, your cards may digivolve into this card without paying the cost.)",
        "effect": "\uff1cReboot\uff1e (This Digimon also unsuspends in your opponent's unsuspend phase.)\n\uff1cBlocker\uff1e (This Digimon can block in the blocker timing.)\n\uff1cEvade\uff1e (When this Digimon would be deleted, you may suspend it to prevent that deletion.)\n[When Digivolving] For every 4 cards your opponent's hand has, 1 of their Digimon or Tamers can't suspend until their turn ends.\n[All Turns] [Once Per Turn] When effects add to your opponent's hand, or effects trash cards under your Tamers, you may activate 1 [Main] effect on this card's Option side.",
        "form": "Mega",
        "id": "BT27-032",
        "illustrator": "SENNSU",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "MirageGaogamon/Full Moon Blaster",
          "japanese": "\u30df\u30e9\u30fc\u30b8\u30e5\u30ac\u30aa\u30ac\u30e2\u30f3/\u30d5\u30eb\u30e0\u30fc\u30f3\u30d6\u30e9\u30b9\u30bf\u30fc",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "Blue",
        "optionCardEffect": "\uff1cUse Req. ([DATA SQUAD] trait)\uff1e (Specified conditions meet color requirements.)\n[Main] Return 1 of your opponent's highest level Digimon to the hand.",
        "playCost": "5",
        "rarity": "R",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "[Digivolve]  Lv.5 w/[Gaogamon]\u00a0in name or w/[DATA SQUAD]\u00a0trait: Cost 3 ",
        "type": "Beast Knight/DATA SQUAD",
        "version": "Normal"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 193368,
    "gallery_revision": 193366
  },
  {
    "card": "BT27-033",
    "expected_variants": 1,
    "prepared_variants": 1,
    "available_scans": 0,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 0,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-033"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-033.webp",
        "cardLv": "-",
        "cardNumber": "BT27-033",
        "cardType": "",
        "color": "[[]]",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "-",
        "id": "BT27-033",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "[[:Category:|]]",
          "japanese": "",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "-",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Normal"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 193204,
    "gallery_revision": 192343
  },
  {
    "card": "BT27-035",
    "expected_variants": 3,
    "prepared_variants": 3,
    "available_scans": 2,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 2,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-035",
      "BT27-035_P1",
      "BT27-035_P2"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Data",
        "block": [
          "06"
        ],
        "burstDigivolve": "[Digivolve]  Lv.6 w/[DATA SQUAD]\u00a0trait: Cost 5 [Burst Digivolve] [MirageGaogamon]: Cost 0 by returning 1 [Thomas H. Norstein] to the hand.At the end of the burst digivolution turn, trash this Digimon's top card.",
        "cardImage": "assets/images/cards/BT27-035.webp",
        "cardLv": "Lv.7",
        "cardNumber": "BT27-035",
        "cardType": "Digimon/Option",
        "color": "Blue/Black",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Blue",
            "cost": "5",
            "level": "6"
          },
          {
            "color": "Black",
            "cost": "5",
            "level": "6"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "15000",
        "dualEffect": "[Arts Digivolve] (Instead of trashing after use, your cards may digivolve into this card without paying the cost.)",
        "effect": "\uff1cReboot\uff1e (This Digimon also unsuspends in your opponent's unsuspend phase.)\n\uff1cBlocker\uff1e (This Digimon can block in the blocker timing.)\n\uff1cEvade\uff1e (When this Digimon would be deleted, you may suspend it to prevent that deletion.)\n[When Digivolving] [When Attacking] [Once Per Turn] You may activate 1 [Main] effect on this card's Option side.\n[When Digivolving] [When Attacking] If your opponent's hand has 8 or more cards, by returning cards without looking to the bottom of the deck so that it has 7 left, return their top security card to the bottom of the deck.",
        "form": "Mega",
        "id": "BT27-035",
        "illustrator": "Kazumasa Yasukuni",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "MirageGaogamon: Burst Mode/Full Moon Meteor Impact",
          "japanese": "\u30df\u30e9\u30fc\u30b8\u30e5\u30ac\u30aa\u30ac\u30e2\u30f3\uff1a\u30d0\u30fc\u30b9\u30c8\u30e2\u30fc\u30c9/\u30d5\u30eb\u30e0\u30fc\u30f3\u30e1\u30c6\u30aa\u30a4\u30f3\u30d1\u30af\u30c8",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "Blue",
        "optionCardEffect": "\uff1cUse Req. ([DATA SQUAD] trait)\uff1e (Specified conditions meet color requirements.)\n[Main] Return 1 of your opponent's Digimon to the hand. Then, if their hand has 8 or more cards, 1 of your Digimon may unsuspend.",
        "playCost": "6",
        "rarity": "UR",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Beast Knight/DATA SQUAD",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Data",
        "block": [
          "06"
        ],
        "burstDigivolve": "[Digivolve]  Lv.6 w/[DATA SQUAD]\u00a0trait: Cost 5 [Burst Digivolve] [MirageGaogamon]: Cost 0 by returning 1 [Thomas H. Norstein] to the hand.At the end of the burst digivolution turn, trash this Digimon's top card.",
        "cardImage": "assets/images/cards/BT27-035_P1.webp",
        "cardLv": "Lv.7",
        "cardNumber": "BT27-035",
        "cardType": "Digimon/Option",
        "color": "Blue/Black",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Blue",
            "cost": "5",
            "level": "6"
          },
          {
            "color": "Black",
            "cost": "5",
            "level": "6"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "15000",
        "dualEffect": "[Arts Digivolve] (Instead of trashing after use, your cards may digivolve into this card without paying the cost.)",
        "effect": "\uff1cReboot\uff1e (This Digimon also unsuspends in your opponent's unsuspend phase.)\n\uff1cBlocker\uff1e (This Digimon can block in the blocker timing.)\n\uff1cEvade\uff1e (When this Digimon would be deleted, you may suspend it to prevent that deletion.)\n[When Digivolving] [When Attacking] [Once Per Turn] You may activate 1 [Main] effect on this card's Option side.\n[When Digivolving] [When Attacking] If your opponent's hand has 8 or more cards, by returning cards without looking to the bottom of the deck so that it has 7 left, return their top security card to the bottom of the deck.",
        "form": "Mega",
        "id": "BT27-035_P1",
        "illustrator": "toriyufu",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "MirageGaogamon: Burst Mode/Full Moon Meteor Impact",
          "japanese": "\u30df\u30e9\u30fc\u30b8\u30e5\u30ac\u30aa\u30ac\u30e2\u30f3\uff1a\u30d0\u30fc\u30b9\u30c8\u30e2\u30fc\u30c9/\u30d5\u30eb\u30e0\u30fc\u30f3\u30e1\u30c6\u30aa\u30a4\u30f3\u30d1\u30af\u30c8",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "BT-27: BOOSTER IGNITION OF X",
        "optionCardColourRequirement": "Blue",
        "optionCardEffect": "\uff1cUse Req. ([DATA SQUAD] trait)\uff1e (Specified conditions meet color requirements.)\n[Main] Return 1 of your opponent's Digimon to the hand. Then, if their hand has 8 or more cards, 1 of your Digimon may unsuspend.",
        "playCost": "6",
        "rarity": "UR",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Beast Knight/DATA SQUAD",
        "version": "Alternative Art"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Data",
        "block": [
          "06"
        ],
        "burstDigivolve": "[Digivolve]  Lv.6 w/[DATA SQUAD]\u00a0trait: Cost 5 [Burst Digivolve] [MirageGaogamon]: Cost 0 by returning 1 [Thomas H. Norstein] to the hand.At the end of the burst digivolution turn, trash this Digimon's top card.",
        "cardImage": "assets/images/cards/BT27-035_P2.webp",
        "cardLv": "Lv.7",
        "cardNumber": "BT27-035",
        "cardType": "Digimon/Option",
        "color": "Blue/Black",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Blue",
            "cost": "5",
            "level": "6"
          },
          {
            "color": "Black",
            "cost": "5",
            "level": "6"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "15000",
        "dualEffect": "[Arts Digivolve] (Instead of trashing after use, your cards may digivolve into this card without paying the cost.)",
        "effect": "\uff1cReboot\uff1e (This Digimon also unsuspends in your opponent's unsuspend phase.)\n\uff1cBlocker\uff1e (This Digimon can block in the blocker timing.)\n\uff1cEvade\uff1e (When this Digimon would be deleted, you may suspend it to prevent that deletion.)\n[When Digivolving] [When Attacking] [Once Per Turn] You may activate 1 [Main] effect on this card's Option side.\n[When Digivolving] [When Attacking] If your opponent's hand has 8 or more cards, by returning cards without looking to the bottom of the deck so that it has 7 left, return their top security card to the bottom of the deck.",
        "form": "Mega",
        "id": "BT27-035_P2",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "MirageGaogamon: Burst Mode/Full Moon Meteor Impact",
          "japanese": "\u30df\u30e9\u30fc\u30b8\u30e5\u30ac\u30aa\u30ac\u30e2\u30f3\uff1a\u30d0\u30fc\u30b9\u30c8\u30e2\u30fc\u30c9/\u30d5\u30eb\u30e0\u30fc\u30f3\u30e1\u30c6\u30aa\u30a4\u30f3\u30d1\u30af\u30c8",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "BT-27: BOOSTER IGNITION OF X",
        "optionCardColourRequirement": "Blue",
        "optionCardEffect": "\uff1cUse Req. ([DATA SQUAD] trait)\uff1e (Specified conditions meet color requirements.)\n[Main] Return 1 of your opponent's Digimon to the hand. Then, if their hand has 8 or more cards, 1 of your Digimon may unsuspend.",
        "playCost": "6",
        "rarity": "UR",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Beast Knight/DATA SQUAD",
        "version": "Special Rare"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 192826,
    "gallery_revision": 193055
  },
  {
    "card": "BT27-037",
    "expected_variants": 1,
    "prepared_variants": 1,
    "available_scans": 0,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 0,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-037"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-037.webp",
        "cardLv": "-",
        "cardNumber": "BT27-037",
        "cardType": "Digimon",
        "color": "[[]]",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "-",
        "id": "BT27-037",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "[[:Category:|]]",
          "japanese": "",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "-",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Normal"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 193747,
    "gallery_revision": 192347
  },
  {
    "card": "BT27-052",
    "expected_variants": 3,
    "prepared_variants": 2,
    "available_scans": 2,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 2,
    "missing_image_requests": [],
    "missing_variants": [
      "BT27-052_P2"
    ],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-052",
      "BT27-052_P1",
      "BT27-052_P2"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "[Assembly\u00a0-5] Lv.5 \u00d7 Lv.4 \u00d7 Lv.3, all w/[Glowing Dawn]\u00a0traitWhen this would be played, by placing the specified cards from the trash under it, reduce the play cost.",
        "attribute": "Data",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-052.webp",
        "cardLv": "Lv.6",
        "cardNumber": "BT27-052",
        "cardType": "Digimon",
        "color": "Green/Black",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Green",
            "cost": "5",
            "level": "5"
          },
          {
            "color": "Black",
            "cost": "5",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "13000",
        "dualEffect": "-",
        "effect": "\uff1cSecurity A. +1\uff1e (This Digimon checks 1 additional security card.)\n\uff1cReboot\uff1e (This Digimon also unsuspends in your opponent's unsuspend phase.)\n\uff1cBlocker\uff1e (This Digimon can block in the blocker timing.)\n[On Play] [When Digivolving] [When Attacking] [Once Per Turn] This Digimon may battle 1 of your opponent's Digimon.\n[On Play] [When Digivolving] By trashing 2 bottom face-down cards from under any of your Tamers, you may play or use 1 play or use cost 6 or lower [Glowing Dawn]\u00a0trait card from your hand or your Digimon's digivolution cards without paying the cost.",
        "form": "Mega",
        "id": "BT27-052",
        "illustrator": "sasasi",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Atratusmon",
          "japanese": "\u30a2\u30c8\u30e9\u30bf\u30b9\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "13",
        "rarity": "UR",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "[Digivolve]  Lv.5 w/[Glowing Dawn]\u00a0trait: Cost 4\n[Digivolve]  [Atratusmon] w/o play Cost: Cost 2 ",
        "type": "Mutant/Glowing Dawn/BEATBREAK",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "[Assembly\u00a0-5] Lv.5 \u00d7 Lv.4 \u00d7 Lv.3, all w/[Glowing Dawn]\u00a0traitWhen this would be played, by placing the specified cards from the trash under it, reduce the play cost.",
        "attribute": "Data",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-052_P1.webp",
        "cardLv": "Lv.6",
        "cardNumber": "BT27-052",
        "cardType": "Digimon",
        "color": "Green/Black",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Green",
            "cost": "5",
            "level": "5"
          },
          {
            "color": "Black",
            "cost": "5",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "13000",
        "dualEffect": "-",
        "effect": "\uff1cSecurity A. +1\uff1e (This Digimon checks 1 additional security card.)\n\uff1cReboot\uff1e (This Digimon also unsuspends in your opponent's unsuspend phase.)\n\uff1cBlocker\uff1e (This Digimon can block in the blocker timing.)\n[On Play] [When Digivolving] [When Attacking] [Once Per Turn] This Digimon may battle 1 of your opponent's Digimon.\n[On Play] [When Digivolving] By trashing 2 bottom face-down cards from under any of your Tamers, you may play or use 1 play or use cost 6 or lower [Glowing Dawn]\u00a0trait card from your hand or your Digimon's digivolution cards without paying the cost.",
        "form": "Mega",
        "id": "BT27-052_P1",
        "illustrator": "Tonamikanji",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Atratusmon",
          "japanese": "\u30a2\u30c8\u30e9\u30bf\u30b9\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "BT-27: BOOSTER IGNITION OF X",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "13",
        "rarity": "UR",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "[Digivolve]  Lv.5 w/[Glowing Dawn]\u00a0trait: Cost 4\n[Digivolve]  [Atratusmon] w/o play Cost: Cost 2 ",
        "type": "Mutant/Glowing Dawn/BEATBREAK",
        "version": "Alternative Art"
      }
    ],
    "card_data_passed": false,
    "image_check_passed": null,
    "passed": false,
    "log": "\ud83d\udcca Processing 1 cards using MediaWiki API...\n[1/1] BT27-052 - Atratusmon\n\n\u2705 Card data extraction completed!\n\ud83d\udcc8 Successfully processed: 1 cards\n\u274c Errors: 0\n\u23f1\ufe0f  Total time: 0.0s\n\ud83d\ude80 Average speed: 500.6 cards/sec\n\ud83d\ude80 Starting card image download process using MediaWiki API...\n\ud83d\udcca Processing 1 card links...\nChecking /wiki/BT27-052\n\n==================================================\n\ud83d\udcca DOWNLOAD SUMMARY\n==================================================\n\u2705 Successfully downloaded: 0 images\n\u23ed\ufe0f  Skipped (already exist): 0 images\n\u274c Failed downloads: 0 images\n\ud83d\udcc8 Total processed: 0 images\n==================================================\nSaving DigimonCard JSON!\n\nConversion complete: 0 files converted, 0 files failed\n",
    "page_revision": 193249,
    "gallery_revision": 193243
  },
  {
    "card": "BT27-054",
    "expected_variants": 1,
    "prepared_variants": 1,
    "available_scans": 0,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 0,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-054"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-054.webp",
        "cardLv": "-",
        "cardNumber": "BT27-054",
        "cardType": "Digimon",
        "color": "[[]]",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "-",
        "id": "BT27-054",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "[[:Category:|]]",
          "japanese": "",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "-",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Normal"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 193748,
    "gallery_revision": 192364
  },
  {
    "card": "BT27-059",
    "expected_variants": 1,
    "prepared_variants": 1,
    "available_scans": 0,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 0,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-059"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-059.webp",
        "cardLv": "Lv.4",
        "cardNumber": "BT27-059",
        "cardType": "Digimon",
        "color": "Black",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "Champion",
        "id": "BT27-059",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "[[:Category:|]]",
          "japanese": "",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "-",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Normal"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 193371,
    "gallery_revision": 192369
  },
  {
    "card": "BT27-062",
    "expected_variants": 1,
    "prepared_variants": 1,
    "available_scans": 1,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 1,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-062"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Free",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-062.webp",
        "cardLv": "Lv.4",
        "cardNumber": "BT27-062",
        "cardType": "Digimon",
        "color": "Black",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Black",
            "cost": "2",
            "level": "3"
          }
        ],
        "digivolveEffect": "[All Turns] [Once Per Turn] When this Digimon would leave the battle area, by deleting 1 of your other Digimon with [Knightmon]\u00a0in its text, it doesn't leave.",
        "dnaDigivolve": "-",
        "dp": "4000",
        "dualEffect": "-",
        "effect": "[When Attacking] [Once Per Turn] You may play or use 1 card with [Knightmon]\u00a0in its text from your hand with the cost reduced by 2.",
        "form": "Armor Form",
        "id": "BT27-062",
        "illustrator": "SENNSU",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Maildramon",
          "japanese": "\u30e1\u30a4\u30eb\u30c9\u30e9\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "4",
        "rarity": "C",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Cyborg",
        "version": "Normal"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 193746,
    "gallery_revision": 193742
  },
  {
    "card": "BT27-063",
    "expected_variants": 1,
    "prepared_variants": 1,
    "available_scans": 0,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 0,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-063"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-063.webp",
        "cardLv": "-",
        "cardNumber": "BT27-063",
        "cardType": "",
        "color": "[[]]",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "-",
        "id": "BT27-063",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "[[:Category:|]]",
          "japanese": "",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "-",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Normal"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 192052,
    "gallery_revision": 192373
  },
  {
    "card": "BT27-068",
    "expected_variants": 1,
    "prepared_variants": 1,
    "available_scans": 0,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 0,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-068"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-068.webp",
        "cardLv": "-",
        "cardNumber": "BT27-068",
        "cardType": "Digimon",
        "color": "[[]]",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "-",
        "id": "BT27-068",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "[[:Category:|]]",
          "japanese": "",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "-",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Normal"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 193749,
    "gallery_revision": 192378
  },
  {
    "card": "BT27-085",
    "expected_variants": 3,
    "prepared_variants": 3,
    "available_scans": 2,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 2,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-085",
      "BT27-085_P1",
      "BT27-085_P2"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Vaccine",
        "block": [
          "06"
        ],
        "burstDigivolve": "[Digivolve]  Lv.6 w/[DATA SQUAD]\u00a0trait: Cost 5 [Burst Digivolve] [Ravemon]: Cost 0 by returning 1 [Keenan Crier] to the hand.At the end of the burst digivolution turn, trash this Digimon's top card.",
        "cardImage": "assets/images/cards/BT27-085.webp",
        "cardLv": "Lv.7",
        "cardNumber": "BT27-085",
        "cardType": "Digimon/Option",
        "color": "Purple/Green",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Purple",
            "cost": "5",
            "level": "6"
          },
          {
            "color": "Green",
            "cost": "5",
            "level": "6"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "15000",
        "dualEffect": "[Arts Digivolve] (Instead of trashing after use, your cards may digivolve into this card without paying the cost.)",
        "effect": "\uff1cPiercing\uff1e (When this Digimon deletes your opponent's Digimon in battle while attacking, it checks security before the attack ends.)\n\uff1cBlocker\uff1e (This Digimon can block in the blocker timing.)\n[When Digivolving] [When Attacking] You may activate 1 [Main] effect on this card's Option side.\n[All Turns] [Once Per Turn] When your opponent's hand is trashed from, this Digimon may unsuspend.",
        "form": "Mega",
        "id": "BT27-085",
        "illustrator": "NAOKI AKAMINE",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Ravemon: Burst Mode/Mourning Dance",
          "japanese": "\u30ec\u30a4\u30f4\u30e2\u30f3\uff1a\u30d0\u30fc\u30b9\u30c8\u30e2\u30fc\u30c9/\u6012\u6d9b\u95c7\u4f9b\u55aa\u4e4b\u821e",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "Purple",
        "optionCardEffect": "\uff1cUse Req. ([DATA SQUAD] trait)\uff1e (Specified conditions meet color requirements.)\n[Main] Your opponent trashes any 1 card from their hand or security stack. Then, delete 1 of their Digimon with a level as high as the number of cards in their hand or higher.",
        "playCost": "6",
        "rarity": "UR",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Cyborg/DATA SQUAD",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Vaccine",
        "block": [
          "06"
        ],
        "burstDigivolve": "[Digivolve]  Lv.6 w/[DATA SQUAD]\u00a0trait: Cost 5 [Burst Digivolve] [Ravemon]: Cost 0 by returning 1 [Keenan Crier] to the hand.At the end of the burst digivolution turn, trash this Digimon's top card.",
        "cardImage": "assets/images/cards/BT27-085_P1.webp",
        "cardLv": "Lv.7",
        "cardNumber": "BT27-085",
        "cardType": "Digimon/Option",
        "color": "Purple/Green",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Purple",
            "cost": "5",
            "level": "6"
          },
          {
            "color": "Green",
            "cost": "5",
            "level": "6"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "15000",
        "dualEffect": "[Arts Digivolve] (Instead of trashing after use, your cards may digivolve into this card without paying the cost.)",
        "effect": "\uff1cPiercing\uff1e (When this Digimon deletes your opponent's Digimon in battle while attacking, it checks security before the attack ends.)\n\uff1cBlocker\uff1e (This Digimon can block in the blocker timing.)\n[When Digivolving] [When Attacking] You may activate 1 [Main] effect on this card's Option side.\n[All Turns] [Once Per Turn] When your opponent's hand is trashed from, this Digimon may unsuspend.",
        "form": "Mega",
        "id": "BT27-085_P1",
        "illustrator": "k.Dra",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Ravemon: Burst Mode/Mourning Dance",
          "japanese": "\u30ec\u30a4\u30f4\u30e2\u30f3\uff1a\u30d0\u30fc\u30b9\u30c8\u30e2\u30fc\u30c9/\u6012\u6d9b\u95c7\u4f9b\u55aa\u4e4b\u821e",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "BT-27: BOOSTER IGNITION OF X",
        "optionCardColourRequirement": "Purple",
        "optionCardEffect": "\uff1cUse Req. ([DATA SQUAD] trait)\uff1e (Specified conditions meet color requirements.)\n[Main] Your opponent trashes any 1 card from their hand or security stack. Then, delete 1 of their Digimon with a level as high as the number of cards in their hand or higher.",
        "playCost": "6",
        "rarity": "UR",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Cyborg/DATA SQUAD",
        "version": "Alternative Art"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Vaccine",
        "block": [
          "06"
        ],
        "burstDigivolve": "[Digivolve]  Lv.6 w/[DATA SQUAD]\u00a0trait: Cost 5 [Burst Digivolve] [Ravemon]: Cost 0 by returning 1 [Keenan Crier] to the hand.At the end of the burst digivolution turn, trash this Digimon's top card.",
        "cardImage": "assets/images/cards/BT27-085_P2.webp",
        "cardLv": "Lv.7",
        "cardNumber": "BT27-085",
        "cardType": "Digimon/Option",
        "color": "Purple/Green",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Purple",
            "cost": "5",
            "level": "6"
          },
          {
            "color": "Green",
            "cost": "5",
            "level": "6"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "15000",
        "dualEffect": "[Arts Digivolve] (Instead of trashing after use, your cards may digivolve into this card without paying the cost.)",
        "effect": "\uff1cPiercing\uff1e (When this Digimon deletes your opponent's Digimon in battle while attacking, it checks security before the attack ends.)\n\uff1cBlocker\uff1e (This Digimon can block in the blocker timing.)\n[When Digivolving] [When Attacking] You may activate 1 [Main] effect on this card's Option side.\n[All Turns] [Once Per Turn] When your opponent's hand is trashed from, this Digimon may unsuspend.",
        "form": "Mega",
        "id": "BT27-085_P2",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Ravemon: Burst Mode/Mourning Dance",
          "japanese": "\u30ec\u30a4\u30f4\u30e2\u30f3\uff1a\u30d0\u30fc\u30b9\u30c8\u30e2\u30fc\u30c9/\u6012\u6d9b\u95c7\u4f9b\u55aa\u4e4b\u821e",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "BT-27: BOOSTER IGNITION OF X",
        "optionCardColourRequirement": "Purple",
        "optionCardEffect": "\uff1cUse Req. ([DATA SQUAD] trait)\uff1e (Specified conditions meet color requirements.)\n[Main] Your opponent trashes any 1 card from their hand or security stack. Then, delete 1 of their Digimon with a level as high as the number of cards in their hand or higher.",
        "playCost": "6",
        "rarity": "UR",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Cyborg/DATA SQUAD",
        "version": "Special Rare"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 193134,
    "gallery_revision": 193239
  },
  {
    "card": "BT27-086",
    "expected_variants": 1,
    "prepared_variants": 1,
    "available_scans": 0,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 0,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-086"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-086.webp",
        "cardLv": "-",
        "cardNumber": "BT27-086",
        "cardType": "",
        "color": "[[]]",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "-",
        "id": "BT27-086",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "[[:Category:|]]",
          "japanese": "",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "-",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Normal"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 193440,
    "gallery_revision": 192396
  },
  {
    "card": "BT27-088",
    "expected_variants": 1,
    "prepared_variants": 1,
    "available_scans": 0,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 0,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-088"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-088.webp",
        "cardLv": "-",
        "cardNumber": "BT27-088",
        "cardType": "Tamer",
        "color": "Blue",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "-",
        "id": "BT27-088",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "[[:Category:|]]",
          "japanese": "",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "-",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Normal"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 193414,
    "gallery_revision": 192398
  },
  {
    "card": "BT27-089",
    "expected_variants": 1,
    "prepared_variants": 1,
    "available_scans": 0,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 0,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-089"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-089.webp",
        "cardLv": "-",
        "cardNumber": "BT27-089",
        "cardType": "Tamer",
        "color": "Blue",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "-",
        "id": "BT27-089",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "[[:Category:|]]",
          "japanese": "",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "-",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Normal"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 193238,
    "gallery_revision": 192399
  },
  {
    "card": "BT27-103",
    "expected_variants": 3,
    "prepared_variants": 3,
    "available_scans": 2,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 2,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-103",
      "BT27-103_P1",
      "BT27-103_P2"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Vaccine",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-103.webp",
        "cardLv": "Lv.7",
        "cardNumber": "BT27-103",
        "cardType": "Digimon/Option",
        "color": "Black/Yellow/Red",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Black",
            "cost": "6",
            "level": "6"
          },
          {
            "color": "Yellow",
            "cost": "6",
            "level": "6"
          },
          {
            "color": "Red",
            "cost": "6",
            "level": "6"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "[DNA Digivolve] [Alphamon] + [Ouryumon]\u00a0: Cost 0Stack the 2 specified Digimon and digivolve unsuspended.",
        "dp": "16000",
        "dualEffect": "[Arts Digivolve] (Instead of trashing after use, your cards may digivolve into this card without paying the cost.)",
        "effect": "\uff1cPiercing\uff1e (When this Digimon deletes your opponent's Digimon in battle while attacking, it checks security before the attack ends.)\n\uff1cSecurity A. +1\uff1e (This Digimon checks 1 additional security card.)\n\uff1cBlocker\uff1e (This Digimon can block in the blocker timing.)\n\uff1cPartition ([Alphamon] & [Ouryumon])\uff1e (When this Digimon with each of the specified digivolution cards would leave the battle area other than by your own effects or by battle, you may play 1 each of the specified cards without paying the costs.)\n[When Digivolving] [When Attacking] [Once Per Turn] You may delete 1 of your opponent's Digimon. Then, if DNA digivolving, \uff1cRecovery +2\uff1e (Place the top 2 cards of your deck as your top 2 security cards.)\n[All Turns] During attacks, your opponent's effects don't affect this Digimon.",
        "form": "Mega",
        "id": "BT27-103",
        "illustrator": "kaz",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Alphamon: Ouryuken/Ultimate Ouryuken",
          "japanese": "\u30a2\u30eb\u30d5\u30a1\u30e2\u30f3\uff1a\u738b\u7adc\u5263/\u7a76\u6975\u6226\u5203\u738b\u7adc\u5263",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "Black",
        "optionCardEffect": "[Main] Delete 1 of your opponent's Digimon. Then, 2 of your Digimon may DNA digivolve into this card.",
        "playCost": "6",
        "rarity": "SEC",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "NO DATA/X Antibody/Royal Knight/Chronicle",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Vaccine",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-103_P1.webp",
        "cardLv": "Lv.7",
        "cardNumber": "BT27-103",
        "cardType": "Digimon/Option",
        "color": "Black/Yellow/Red",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Black",
            "cost": "6",
            "level": "6"
          },
          {
            "color": "Yellow",
            "cost": "6",
            "level": "6"
          },
          {
            "color": "Red",
            "cost": "6",
            "level": "6"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "[DNA Digivolve] [Alphamon] + [Ouryumon]\u00a0: Cost 0Stack the 2 specified Digimon and digivolve unsuspended.",
        "dp": "16000",
        "dualEffect": "[Arts Digivolve] (Instead of trashing after use, your cards may digivolve into this card without paying the cost.)",
        "effect": "\uff1cPiercing\uff1e (When this Digimon deletes your opponent's Digimon in battle while attacking, it checks security before the attack ends.)\n\uff1cSecurity A. +1\uff1e (This Digimon checks 1 additional security card.)\n\uff1cBlocker\uff1e (This Digimon can block in the blocker timing.)\n\uff1cPartition ([Alphamon] & [Ouryumon])\uff1e (When this Digimon with each of the specified digivolution cards would leave the battle area other than by your own effects or by battle, you may play 1 each of the specified cards without paying the costs.)\n[When Digivolving] [When Attacking] [Once Per Turn] You may delete 1 of your opponent's Digimon. Then, if DNA digivolving, \uff1cRecovery +2\uff1e (Place the top 2 cards of your deck as your top 2 security cards.)\n[All Turns] During attacks, your opponent's effects don't affect this Digimon.",
        "form": "Mega",
        "id": "BT27-103_P1",
        "illustrator": "k.Dra",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Alphamon: Ouryuken/Ultimate Ouryuken",
          "japanese": "\u30a2\u30eb\u30d5\u30a1\u30e2\u30f3\uff1a\u738b\u7adc\u5263/\u7a76\u6975\u6226\u5203\u738b\u7adc\u5263",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "BT-27: BOOSTER IGNITION OF X",
        "optionCardColourRequirement": "Black",
        "optionCardEffect": "[Main] Delete 1 of your opponent's Digimon. Then, 2 of your Digimon may DNA digivolve into this card.",
        "playCost": "6",
        "rarity": "SEC",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "NO DATA/X Antibody/Royal Knight/Chronicle",
        "version": "Alternative Art"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Vaccine",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-103_P2.webp",
        "cardLv": "Lv.7",
        "cardNumber": "BT27-103",
        "cardType": "Digimon/Option",
        "color": "Black/Yellow/Red",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Black",
            "cost": "6",
            "level": "6"
          },
          {
            "color": "Yellow",
            "cost": "6",
            "level": "6"
          },
          {
            "color": "Red",
            "cost": "6",
            "level": "6"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "[DNA Digivolve] [Alphamon] + [Ouryumon]\u00a0: Cost 0Stack the 2 specified Digimon and digivolve unsuspended.",
        "dp": "16000",
        "dualEffect": "[Arts Digivolve] (Instead of trashing after use, your cards may digivolve into this card without paying the cost.)",
        "effect": "\uff1cPiercing\uff1e (When this Digimon deletes your opponent's Digimon in battle while attacking, it checks security before the attack ends.)\n\uff1cSecurity A. +1\uff1e (This Digimon checks 1 additional security card.)\n\uff1cBlocker\uff1e (This Digimon can block in the blocker timing.)\n\uff1cPartition ([Alphamon] & [Ouryumon])\uff1e (When this Digimon with each of the specified digivolution cards would leave the battle area other than by your own effects or by battle, you may play 1 each of the specified cards without paying the costs.)\n[When Digivolving] [When Attacking] [Once Per Turn] You may delete 1 of your opponent's Digimon. Then, if DNA digivolving, \uff1cRecovery +2\uff1e (Place the top 2 cards of your deck as your top 2 security cards.)\n[All Turns] During attacks, your opponent's effects don't affect this Digimon.",
        "form": "Mega",
        "id": "BT27-103_P2",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Alphamon: Ouryuken/Ultimate Ouryuken",
          "japanese": "\u30a2\u30eb\u30d5\u30a1\u30e2\u30f3\uff1a\u738b\u7adc\u5263/\u7a76\u6975\u6226\u5203\u738b\u7adc\u5263",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "BT-27: BOOSTER IGNITION OF X",
        "optionCardColourRequirement": "Black",
        "optionCardEffect": "[Main] Delete 1 of your opponent's Digimon. Then, 2 of your Digimon may DNA digivolve into this card.",
        "playCost": "6",
        "rarity": "SEC",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "NO DATA/X Antibody/Royal Knight/Chronicle",
        "version": "Rare Pull"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 193498,
    "gallery_revision": 192778
  },
  {
    "card": "BT27-104",
    "expected_variants": 3,
    "prepared_variants": 3,
    "available_scans": 1,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 1,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT27-104",
      "BT27-104_P1",
      "BT27-104_P2"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-104.webp",
        "cardLv": "-",
        "cardNumber": "BT27-104",
        "cardType": "Tamer",
        "color": "White",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Start of Your Main Phase] By placing 1 card from your hand under this Tamer, \uff1cDraw 1\uff1e (Draw 1 card from your deck.) and gain 1 memory.\n[End of Your Turn] By suspending this Tamer, activate 1 of the effects below:\n\u30fb1 of your Digimon may digivolve into a [Royal Knight]\u00a0trait card under this Tamer with the cost reduced by 2.\n\u30fbYou may use 1 use cost 5 or higher [Royal Knight]\u00a0trait Option card from your hand or under this Tamer with the cost reduced by 3.",
        "form": "-",
        "id": "BT27-104",
        "illustrator": "tyuga",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "King Drasil",
          "japanese": "\u30a4\u30b0\u30c9\u30e9\u30b7\u30eb",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9BOOSTER IGNITION OF X [BT-27]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "4",
        "rarity": "SEC",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "[Security] Play this card without paying the cost.",
        "specialDigivolve": "-",
        "type": "TS",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-104_P1.webp",
        "cardLv": "-",
        "cardNumber": "BT27-104",
        "cardType": "Tamer",
        "color": "White",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Start of Your Main Phase] By placing 1 card from your hand under this Tamer, \uff1cDraw 1\uff1e (Draw 1 card from your deck.) and gain 1 memory.\n[End of Your Turn] By suspending this Tamer, activate 1 of the effects below:\n\u30fb1 of your Digimon may digivolve into a [Royal Knight]\u00a0trait card under this Tamer with the cost reduced by 2.\n\u30fbYou may use 1 use cost 5 or higher [Royal Knight]\u00a0trait Option card from your hand or under this Tamer with the cost reduced by 3.",
        "form": "-",
        "id": "BT27-104_P1",
        "illustrator": "Tonamikanji",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "King Drasil",
          "japanese": "\u30a4\u30b0\u30c9\u30e9\u30b7\u30eb",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "BT-27: BOOSTER IGNITION OF X",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "4",
        "rarity": "SEC",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "[Security] Play this card without paying the cost.",
        "specialDigivolve": "-",
        "type": "TS",
        "version": "Alternative Art"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT27-104_P2.webp",
        "cardLv": "-",
        "cardNumber": "BT27-104",
        "cardType": "Tamer",
        "color": "White",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Start of Your Main Phase] By placing 1 card from your hand under this Tamer, \uff1cDraw 1\uff1e (Draw 1 card from your deck.) and gain 1 memory.\n[End of Your Turn] By suspending this Tamer, activate 1 of the effects below:\n\u30fb1 of your Digimon may digivolve into a [Royal Knight]\u00a0trait card under this Tamer with the cost reduced by 2.\n\u30fbYou may use 1 use cost 5 or higher [Royal Knight]\u00a0trait Option card from your hand or under this Tamer with the cost reduced by 3.",
        "form": "-",
        "id": "BT27-104_P2",
        "illustrator": "Tonamikanji",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "King Drasil",
          "japanese": "\u30a4\u30b0\u30c9\u30e9\u30b7\u30eb",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "BT-27: BOOSTER IGNITION OF X",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "4",
        "rarity": "SEC",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "[Security] Play this card without paying the cost.",
        "specialDigivolve": "-",
        "type": "TS",
        "version": "Gold Foil -\u00a0Rare Pull"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 193756,
    "gallery_revision": 193752
  },
  {
    "card": "BT4-104",
    "expected_variants": 6,
    "prepared_variants": 6,
    "available_scans": 6,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 6,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
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
    "image_check_passed": null,
    "passed": true,
    "page_revision": 185606,
    "gallery_revision": 184973
  },
  {
    "card": "BT5-090",
    "expected_variants": 4,
    "prepared_variants": 4,
    "available_scans": 3,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 3,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "BT5-090_P2"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "00"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT5-090.webp",
        "cardLv": "-",
        "cardNumber": "BT5-090",
        "cardType": "Tamer",
        "color": "Black",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Start of Your Turn] If a Digimon card with the [Unidentified]\u00a0trait is in your trash, gain 1 memory.\n[Your Turn] When one of your Digimon digivolves into [Diaboromon], you may suspend this Tamer to play 1 [Diaboromon] Token without paying the cost. (Digimon/Cost 14/Lv.6/White/Mega/Unknown/Unidentified/3000 DP)",
        "form": "-",
        "id": "BT5-090",
        "illustrator": "No Illustrator",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Arata Sanada",
          "japanese": "\u771f\u7530\u30a2\u30e9\u30bf",
          "korean": "\uc0ac\ub098\ub2e4 \uc544\ub77c\ud0c0",
          "simplifiedChinese": "\u771f\u7530\u65b0",
          "traditionalChinese": "\u771f\u7530\u65b0"
        },
        "notes": "\u25b9BOOSTER BATTLE OF OMNI [BT-05]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "R",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Play this card without paying the cost.",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "00"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT5-090_P1.webp",
        "cardLv": "-",
        "cardNumber": "BT5-090",
        "cardType": "Tamer",
        "color": "Black",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Start of Your Turn] If a Digimon card with the [Unidentified]\u00a0trait is in your trash, gain 1 memory.\n[Your Turn] When one of your Digimon digivolves into [Diaboromon], you may suspend this Tamer to play 1 [Diaboromon] Token without paying the cost. (Digimon/Cost 14/Lv.6/White/Mega/Unknown/Unidentified/3000 DP)",
        "form": "-",
        "id": "BT5-090_P1",
        "illustrator": "No Illustrator",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Arata Sanada",
          "japanese": "\u771f\u7530\u30a2\u30e9\u30bf",
          "korean": "\uc0ac\ub098\ub2e4 \uc544\ub77c\ud0c0",
          "simplifiedChinese": "\u771f\u7530\u65b0",
          "traditionalChinese": "\u771f\u7530\u65b0"
        },
        "notes": "BT-05: Booster Battle Of Omni",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "R",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Play this card without paying the cost.",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Foil - Full Art -\u00a0Box Topper"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "00"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT5-090_P0.webp",
        "cardLv": "-",
        "cardNumber": "BT5-090",
        "cardType": "Tamer",
        "color": "Black",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Start of Your Turn] If a Digimon card with the [Unidentified]\u00a0trait is in your trash, gain 1 memory.\n[Your Turn] When one of your Digimon digivolves into [Diaboromon], you may suspend this Tamer to play 1 [Diaboromon] Token without paying the cost. (Digimon/Cost 14/Lv.6/White/Mega/Unknown/Unidentified/3000 DP)",
        "form": "-",
        "id": "BT5-090_P0",
        "illustrator": "No Illustrator",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Arata Sanada",
          "japanese": "\u771f\u7530\u30a2\u30e9\u30bf",
          "korean": "\uc0ac\ub098\ub2e4 \uc544\ub77c\ud0c0",
          "simplifiedChinese": "\u771f\u7530\u65b0",
          "traditionalChinese": "\u771f\u7530\u65b0"
        },
        "notes": "Battle of Omni Pre-Release Pack",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "R",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Play this card without paying the cost.",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Gold Outline - Pre Release Stamp -\u00a0Rare"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "00"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/BT5-090_P2.webp",
        "cardLv": "-",
        "cardNumber": "BT5-090",
        "cardType": "Tamer",
        "color": "Black",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Start of Your Turn] If a Digimon card with the [Unidentified]\u00a0trait is in your trash, gain 1 memory.\n[Your Turn] When one of your Digimon digivolves into [Diaboromon], you may suspend this Tamer to play 1 [Diaboromon] Token without paying the cost. (Digimon/Cost 14/Lv.6/White/Mega/Unknown/Unidentified/3000 DP)",
        "form": "-",
        "id": "BT5-090_P2",
        "illustrator": "No Illustrator",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Arata Sanada",
          "japanese": "\u771f\u7530\u30a2\u30e9\u30bf",
          "korean": "\uc0ac\ub098\ub2e4 \uc544\ub77c\ud0c0",
          "simplifiedChinese": "\u771f\u7530\u65b0",
          "traditionalChinese": "\u771f\u7530\u65b0"
        },
        "notes": "2025 Evolution Cup Season 2",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "R",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Play this card without paying the cost.",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Participation Stamp -\u00a01st Place Prize"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 170798,
    "gallery_revision": 170804
  },
  {
    "card": "ED01-01",
    "passed": false,
    "blocked": true,
    "error": "missingtitle"
  },
  {
    "card": "ED02-01",
    "passed": false,
    "blocked": true,
    "error": "missingtitle"
  },
  {
    "card": "EX14-001",
    "expected_variants": 2,
    "prepared_variants": 2,
    "available_scans": 0,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 0,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "EX14-001",
      "EX14-001_P1"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/EX14-001.webp",
        "cardLv": "-",
        "cardNumber": "EX14-001",
        "cardType": "",
        "color": "[[]]",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "-",
        "id": "EX14-001",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "[[:Category:|]]",
          "japanese": "",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9EXTRA BOOSTER MALEVOLENT VII [EX-14]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "-",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
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
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/EX14-001_P1.webp",
        "cardLv": "-",
        "cardNumber": "EX14-001",
        "cardType": "",
        "color": "[[]]",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "-",
        "id": "EX14-001_P1",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "[[:Category:|]]",
          "japanese": "",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "EX-14: EXTRA BOOSTER MALEVOLENT VII",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "-",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Foil - Coloured Border -\u00a0"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 185808,
    "gallery_revision": 181985
  },
  {
    "card": "EX14-012",
    "expected_variants": 2,
    "prepared_variants": 2,
    "available_scans": 1,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 1,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "EX14-012",
      "EX14-012_P1"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Vaccine",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/EX14-012.webp",
        "cardLv": "Lv.6",
        "cardNumber": "EX14-012",
        "cardType": "Digimon/Option",
        "color": "Red",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Red",
            "cost": "3",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "12000",
        "dualEffect": "[Arts Digivolve] (Instead of trashing after use, your cards may digivolve into this card without paying the cost.)",
        "effect": "\uff1cSecurity A. +1\uff1e (This Digimon checks 1 additional security card.)\n\uff1cEngage\uff1e (At the end of your turn, this Digimon may attack.)\n[When Digivolving] [When Attacking] [Once Per Turn] 1 of your Digimon gets +3000 DP until your opponent's turn ends. Then, by trashing the bottom face-down card from under any of your Tamers, delete 1 of their Digimon with as much DP as this Digimon or less.\n[Security] [On Deletion] You may use this card without paying the cost.",
        "form": "Mega",
        "id": "EX14-012",
        "illustrator": "sasasi",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "VictoryGreymon/Dramon Breaker",
          "japanese": "\u30d3\u30af\u30c8\u30ea\u30fc\u30b0\u30ec\u30a4\u30e2\u30f3/\u30c9\u30e9\u30e2\u30f3\u30d6\u30ec\u30a4\u30ab\u30fc",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9EXTRA BOOSTER MALEVOLENT VII [EX-14]",
        "optionCardColourRequirement": "Red",
        "optionCardEffect": "\uff1cUse Req. ([TERMINAL] trait)\uff1e (Specified conditions meet color requirements.)\n[Main] Delete up to 15000 DP total worth of your opponent's Digimon.",
        "playCost": "7",
        "rarity": "UR",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "[Digivolve]  Lv.5 w/[TERMINAL]\u00a0trait: Cost 3 ",
        "type": "Dragonkin/TWIN/TERMINAL",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Vaccine",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/EX14-012_P1.webp",
        "cardLv": "Lv.6",
        "cardNumber": "EX14-012",
        "cardType": "Digimon/Option",
        "color": "Red",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Red",
            "cost": "3",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "12000",
        "dualEffect": "[Arts Digivolve] (Instead of trashing after use, your cards may digivolve into this card without paying the cost.)",
        "effect": "\uff1cSecurity A. +1\uff1e (This Digimon checks 1 additional security card.)\n\uff1cEngage\uff1e (At the end of your turn, this Digimon may attack.)\n[When Digivolving] [When Attacking] [Once Per Turn] 1 of your Digimon gets +3000 DP until your opponent's turn ends. Then, by trashing the bottom face-down card from under any of your Tamers, delete 1 of their Digimon with as much DP as this Digimon or less.\n[Security] [On Deletion] You may use this card without paying the cost.",
        "form": "Mega",
        "id": "EX14-012_P1",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "VictoryGreymon/Dramon Breaker",
          "japanese": "\u30d3\u30af\u30c8\u30ea\u30fc\u30b0\u30ec\u30a4\u30e2\u30f3/\u30c9\u30e9\u30e2\u30f3\u30d6\u30ec\u30a4\u30ab\u30fc",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "EX-14: EXTRA BOOSTER MALEVOLENT VII",
        "optionCardColourRequirement": "Red",
        "optionCardEffect": "\uff1cUse Req. ([TERMINAL] trait)\uff1e (Specified conditions meet color requirements.)\n[Main] Delete up to 15000 DP total worth of your opponent's Digimon.",
        "playCost": "7",
        "rarity": "UR",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "[Digivolve]  Lv.5 w/[TERMINAL]\u00a0trait: Cost 3 ",
        "type": "Dragonkin/TWIN/TERMINAL",
        "version": "Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 192808,
    "gallery_revision": 192786
  },
  {
    "card": "EX14-054",
    "expected_variants": 3,
    "prepared_variants": 3,
    "available_scans": 1,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 1,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "EX14-054",
      "EX14-054_P1",
      "EX14-054_P2"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "[Assembly\u00a0-5] 3 [Greed]\u00a0trait cards w/different levelsWhen this would be played, by placing the specified cards from the trash under it, reduce the play cost.",
        "attribute": "Virus",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/EX14-054.webp",
        "cardLv": "Lv.6",
        "cardNumber": "EX14-054",
        "cardType": "Digimon",
        "color": "Purple/Red",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Purple",
            "cost": "4",
            "level": "5"
          },
          {
            "color": "Red",
            "cost": "4",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "13000",
        "dualEffect": "-",
        "effect": "\uff1cAlliance\uff1e (When this Digimon attacks, by suspending 1 of your other Digimon, this Digimon gains \uff1cSecurity A. +1\uff1e and the suspended Digimon's DP for the attack.)\n\uff1cEngage\uff1e (At the end of your turn, this Digimon may attack.)\n[On Play] [When Digivolving] [When Attacking] [Once Per Turn] You may play 1 play cost 6 or lower [Evil], [Wizard], [Fallen Angel] or [Greed]\u00a0trait Digimon card from your trash without paying the cost. Then, your opponent trashes 1 card in their hand.\n[All Turns] [Once Per Turn] When your opponent's hand is trashed from, you may delete all of their lowest level Digimon.",
        "form": "Mega",
        "id": "EX14-054",
        "illustrator": "k.Dra",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Barbamon",
          "japanese": "\u30d0\u30eb\u30d0\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9EXTRA BOOSTER MALEVOLENT VII [EX-14]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "13",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "[Digivolve]  Lv.5 w/[Fallen Angel]/[Greed]\u00a0trait: Cost 3 ",
        "type": "Demon Lord/Greed/Seven Great Demon Lords",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "[Assembly\u00a0-5] 3 [Greed]\u00a0trait cards w/different levelsWhen this would be played, by placing the specified cards from the trash under it, reduce the play cost.",
        "attribute": "Virus",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/EX14-054_P1.webp",
        "cardLv": "Lv.6",
        "cardNumber": "EX14-054",
        "cardType": "Digimon",
        "color": "Purple/Red",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Purple",
            "cost": "4",
            "level": "5"
          },
          {
            "color": "Red",
            "cost": "4",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "13000",
        "dualEffect": "-",
        "effect": "\uff1cAlliance\uff1e (When this Digimon attacks, by suspending 1 of your other Digimon, this Digimon gains \uff1cSecurity A. +1\uff1e and the suspended Digimon's DP for the attack.)\n\uff1cEngage\uff1e (At the end of your turn, this Digimon may attack.)\n[On Play] [When Digivolving] [When Attacking] [Once Per Turn] You may play 1 play cost 6 or lower [Evil], [Wizard], [Fallen Angel] or [Greed]\u00a0trait Digimon card from your trash without paying the cost. Then, your opponent trashes 1 card in their hand.\n[All Turns] [Once Per Turn] When your opponent's hand is trashed from, you may delete all of their lowest level Digimon.",
        "form": "Mega",
        "id": "EX14-054_P1",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Barbamon",
          "japanese": "\u30d0\u30eb\u30d0\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "EX-14: EXTRA BOOSTER MALEVOLENT VII",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "13",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "[Digivolve]  Lv.5 w/[Fallen Angel]/[Greed]\u00a0trait: Cost 3 ",
        "type": "Demon Lord/Greed/Seven Great Demon Lords",
        "version": "Alternative Art"
      },
      {
        "aceEffect": "-",
        "assembly": "[Assembly\u00a0-5] 3 [Greed]\u00a0trait cards w/different levelsWhen this would be played, by placing the specified cards from the trash under it, reduce the play cost.",
        "attribute": "Virus",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/EX14-054_P2.webp",
        "cardLv": "Lv.6",
        "cardNumber": "EX14-054",
        "cardType": "Digimon",
        "color": "Purple/Red",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Purple",
            "cost": "4",
            "level": "5"
          },
          {
            "color": "Red",
            "cost": "4",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "13000",
        "dualEffect": "-",
        "effect": "\uff1cAlliance\uff1e (When this Digimon attacks, by suspending 1 of your other Digimon, this Digimon gains \uff1cSecurity A. +1\uff1e and the suspended Digimon's DP for the attack.)\n\uff1cEngage\uff1e (At the end of your turn, this Digimon may attack.)\n[On Play] [When Digivolving] [When Attacking] [Once Per Turn] You may play 1 play cost 6 or lower [Evil], [Wizard], [Fallen Angel] or [Greed]\u00a0trait Digimon card from your trash without paying the cost. Then, your opponent trashes 1 card in their hand.\n[All Turns] [Once Per Turn] When your opponent's hand is trashed from, you may delete all of their lowest level Digimon.",
        "form": "Mega",
        "id": "EX14-054_P2",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Barbamon",
          "japanese": "\u30d0\u30eb\u30d0\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "EX-14: EXTRA BOOSTER MALEVOLENT VII",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "13",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "[Digivolve]  Lv.5 w/[Fallen Angel]/[Greed]\u00a0trait: Cost 3 ",
        "type": "Demon Lord/Greed/Seven Great Demon Lords",
        "version": "Gold Foil -\u00a0Rare Pull"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 192811,
    "gallery_revision": 192800
  },
  {
    "card": "EX5-058",
    "expected_variants": 2,
    "prepared_variants": 2,
    "available_scans": 1,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 1,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "EX5-058_P1"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Virus",
        "block": [
          "03"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/EX5-058.webp",
        "cardLv": "Lv.4",
        "cardNumber": "EX5-058",
        "cardType": "Digimon",
        "color": "Purple",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Purple",
            "cost": "2",
            "level": "3"
          }
        ],
        "digivolveEffect": "[All Turns] [Once Per Turn] When an effect plays an opponent's Digimon, gain 1 memory.",
        "dnaDigivolve": "-",
        "dp": "5000",
        "dualEffect": "-",
        "effect": "[On Play] [When Digivolving] If there are 4 or more total Digimon, play 1 [Fujitsumon] Token suspended to your battle area. (Digimon/Purple/3000 DP/[All Turns] This Digimon doesn't unsuspend.\n[On Deletion] Trash 1 card in your hand.) If there are 3 or fewer, play it suspended to your opponent's battle area.",
        "form": "Champion",
        "id": "EX5-058",
        "illustrator": "GOSSAN",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Octomon",
          "japanese": "\u30aa\u30af\u30bf\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9THEME BOOSTER ANIMAL COLOSSEUM [EX-05]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "5",
        "rarity": "U",
        "restrictions": {
          "chinese": "Not released",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Mollusk",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Virus",
        "block": [
          "03"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/EX5-058_P1.webp",
        "cardLv": "Lv.4",
        "cardNumber": "EX5-058",
        "cardType": "Digimon",
        "color": "Purple",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Purple",
            "cost": "2",
            "level": "3"
          }
        ],
        "digivolveEffect": "[All Turns] [Once Per Turn] When an effect plays an opponent's Digimon, gain 1 memory.",
        "dnaDigivolve": "-",
        "dp": "5000",
        "dualEffect": "-",
        "effect": "[On Play] [When Digivolving] If there are 4 or more total Digimon, play 1 [Fujitsumon] Token suspended to your battle area. (Digimon/Purple/3000 DP/[All Turns] This Digimon doesn't unsuspend.\n[On Deletion] Trash 1 card in your hand.) If there are 3 or fewer, play it suspended to your opponent's battle area.",
        "form": "Champion",
        "id": "EX5-058_P1",
        "illustrator": "GOSSAN",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Octomon",
          "japanese": "\u30aa\u30af\u30bf\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "5",
        "rarity": "U",
        "restrictions": {
          "chinese": "Not released",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Mollusk",
        "version": "Foil - Coloured Border -\u00a0Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 187844,
    "gallery_revision": 187859
  },
  {
    "card": "EX5-063",
    "expected_variants": 4,
    "prepared_variants": 4,
    "available_scans": 3,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 3,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "EX5-063_P3"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Virus",
        "block": [
          "03"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/EX5-063.webp",
        "cardLv": "Lv.6",
        "cardNumber": "EX5-063",
        "cardType": "Digimon",
        "color": "Purple",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Purple",
            "cost": "5",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "13000",
        "dualEffect": "-",
        "effect": "\uff1cSecurity A. +1\uff1e (This Digimon checks 1 additional security card.)\n[On Play] [When Digivolving] If your opponent has as many or more total Digimon and Tamers as you, delete 1 of your opponent's highest level Digimon. Then, delete 1 of your opponent's lowest level Digimon.\n[All Turns] When an opponent's Digimon is deleted, gain 1 memory for each Digimon deleted.",
        "form": "Mega",
        "id": "EX5-063",
        "illustrator": "Spareribs",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Leviamon",
          "japanese": "\u30ea\u30f4\u30a1\u30a4\u30a2\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9THEME BOOSTER ANIMAL COLOSSEUM [EX-05]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "13",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Not released",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Demon Lord/Seven Great Demon Lords",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Virus",
        "block": [
          "03"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/EX5-063_P1.webp",
        "cardLv": "Lv.6",
        "cardNumber": "EX5-063",
        "cardType": "Digimon",
        "color": "Purple",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Purple",
            "cost": "5",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "13000",
        "dualEffect": "-",
        "effect": "\uff1cSecurity A. +1\uff1e (This Digimon checks 1 additional security card.)\n[On Play] [When Digivolving] If your opponent has as many or more total Digimon and Tamers as you, delete 1 of your opponent's highest level Digimon. Then, delete 1 of your opponent's lowest level Digimon.\n[All Turns] When an opponent's Digimon is deleted, gain 1 memory for each Digimon deleted.",
        "form": "Mega",
        "id": "EX5-063_P1",
        "illustrator": "Naochika Morishita",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Leviamon",
          "japanese": "\u30ea\u30f4\u30a1\u30a4\u30a2\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "EX-05: Theme Booster Animal Colosseum",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "13",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Not released",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Demon Lord/Seven Great Demon Lords",
        "version": "Alternative Art"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Virus",
        "block": [
          "03"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/EX5-063_P2.webp",
        "cardLv": "Lv.6",
        "cardNumber": "EX5-063",
        "cardType": "Digimon",
        "color": "Purple",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Purple",
            "cost": "5",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "13000",
        "dualEffect": "-",
        "effect": "\uff1cSecurity A. +1\uff1e (This Digimon checks 1 additional security card.)\n[On Play] [When Digivolving] If your opponent has as many or more total Digimon and Tamers as you, delete 1 of your opponent's highest level Digimon. Then, delete 1 of your opponent's lowest level Digimon.\n[All Turns] When an opponent's Digimon is deleted, gain 1 memory for each Digimon deleted.",
        "form": "Mega",
        "id": "EX5-063_P2",
        "illustrator": "Nakano Haito",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Leviamon",
          "japanese": "\u30ea\u30f4\u30a1\u30a4\u30a2\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "PB-21: Tamer's Evolution Box - Rise of Digimon",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "13",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Not released",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Demon Lord/Seven Great Demon Lords",
        "version": "Textured -\u00a0Alternative Art"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Virus",
        "block": [
          "03"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/EX5-063_P3.webp",
        "cardLv": "Lv.6",
        "cardNumber": "EX5-063",
        "cardType": "Digimon",
        "color": "Purple",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Purple",
            "cost": "5",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "13000",
        "dualEffect": "-",
        "effect": "\uff1cSecurity A. +1\uff1e (This Digimon checks 1 additional security card.)\n[On Play] [When Digivolving] If your opponent has as many or more total Digimon and Tamers as you, delete 1 of your opponent's highest level Digimon. Then, delete 1 of your opponent's lowest level Digimon.\n[All Turns] When an opponent's Digimon is deleted, gain 1 memory for each Digimon deleted.",
        "form": "Mega",
        "id": "EX5-063_P3",
        "illustrator": "Hisashi Fujiwara",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Leviamon",
          "japanese": "\u30ea\u30f4\u30a1\u30a4\u30a2\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "13",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Not released",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Demon Lord/Seven Great Demon Lords",
        "version": "Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 185972,
    "gallery_revision": 185980
  },
  {
    "card": "EX7-051",
    "expected_variants": 2,
    "prepared_variants": 2,
    "available_scans": 1,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 1,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "EX7-051_P1"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Data",
        "block": [
          "04"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/EX7-051.webp",
        "cardLv": "Lv.3",
        "cardNumber": "EX7-051",
        "cardType": "Digimon",
        "color": "Purple",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Purple",
            "cost": "0",
            "level": "2"
          }
        ],
        "digivolveEffect": "\uff1cRetaliation\uff1e (When only this Digimon is deleted in battle, delete the Digimon it battled.)",
        "dnaDigivolve": "-",
        "dp": "1000",
        "dualEffect": "-",
        "effect": "[Start of Your Main Phase] By placing 1 Option card with the [Three Musketeers]\u00a0trait from your hand or trash as 1 of your Digimon's bottom digivolution card, \uff1cDraw 1\uff1e (Draw 1 card from your deck.)",
        "form": "Rookie",
        "id": "EX7-051",
        "illustrator": "Takase",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Sparrowmon",
          "japanese": "\u30b9\u30d1\u30ed\u30a6\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9EXTRA BOOSTER DIGIMON LIBERATOR [EX-07]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "R",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "[Digivolve]  Lv.2 w/[Three Musketeers]\u00a0in text: Cost 0 ",
        "type": "Avian",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Data",
        "block": [
          "04"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/EX7-051_P1.webp",
        "cardLv": "Lv.3",
        "cardNumber": "EX7-051",
        "cardType": "Digimon",
        "color": "Purple",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Purple",
            "cost": "0",
            "level": "2"
          }
        ],
        "digivolveEffect": "\uff1cRetaliation\uff1e (When only this Digimon is deleted in battle, delete the Digimon it battled.)",
        "dnaDigivolve": "-",
        "dp": "1000",
        "dualEffect": "-",
        "effect": "[Start of Your Main Phase] By placing 1 Option card with the [Three Musketeers]\u00a0trait from your hand or trash as 1 of your Digimon's bottom digivolution card, \uff1cDraw 1\uff1e (Draw 1 card from your deck.)",
        "form": "Rookie",
        "id": "EX7-051_P1",
        "illustrator": "Takase",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Sparrowmon",
          "japanese": "\u30b9\u30d1\u30ed\u30a6\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "R",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "[Digivolve]  Lv.2 w/[Three Musketeers]\u00a0in text: Cost 0 ",
        "type": "Avian",
        "version": "Foil - Coloured Border -\u00a0Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 191806,
    "gallery_revision": 187857
  },
  {
    "card": "EX7-073",
    "expected_variants": 4,
    "prepared_variants": 4,
    "available_scans": 3,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 3,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "EX7-073_P3"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Virus",
        "block": [
          "04"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/EX7-073.webp",
        "cardLv": "Lv.6",
        "cardNumber": "EX7-073",
        "cardType": "Digimon",
        "color": "Purple",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Purple",
            "cost": "4",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "12000",
        "dualEffect": "-",
        "effect": "[When Digivolving] You may use 1 Option card with [Three Musketeers]\u00a0in its text from your hand without paying the cost.\n[When Digivolving] [When Attacking] By trashing 2 cards with the [Three Musketeers]\u00a0trait in this Digimon's digivolution cards, delete 1 of your opponent's Digimon with the highest level and trash the top card of your opponent's security stack.",
        "form": "Mega",
        "id": "EX7-073",
        "illustrator": "sasasi",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "BeelStarmon (X Antibody)",
          "japanese": "\u30d9\u30eb\u30b9\u30bf\u30fc\u30e2\u30f3X\u6297\u4f53",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9EXTRA BOOSTER DIGIMON LIBERATOR [EX-07]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "12",
        "rarity": "SEC",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "[Digivolve]  Lv.6 w/[Three Musketeers]\u00a0trait w/o [X Antibody]\u00a0trait: Cost 1 ",
        "type": "Wizard/X Antibody/Three Musketeers",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Virus",
        "block": [
          "04"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/EX7-073_P1.webp",
        "cardLv": "Lv.6",
        "cardNumber": "EX7-073",
        "cardType": "Digimon",
        "color": "Purple",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Purple",
            "cost": "4",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "12000",
        "dualEffect": "-",
        "effect": "[When Digivolving] You may use 1 Option card with [Three Musketeers]\u00a0in its text from your hand without paying the cost.\n[When Digivolving] [When Attacking] By trashing 2 cards with the [Three Musketeers]\u00a0trait in this Digimon's digivolution cards, delete 1 of your opponent's Digimon with the highest level and trash the top card of your opponent's security stack.",
        "form": "Mega",
        "id": "EX7-073_P1",
        "illustrator": "Tonamikanji",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "BeelStarmon (X Antibody)",
          "japanese": "\u30d9\u30eb\u30b9\u30bf\u30fc\u30e2\u30f3X\u6297\u4f53",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "EX-07: Extra Booster Digimon Liberator",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "12",
        "rarity": "SEC",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "[Digivolve]  Lv.6 w/[Three Musketeers]\u00a0trait w/o [X Antibody]\u00a0trait: Cost 1 ",
        "type": "Wizard/X Antibody/Three Musketeers",
        "version": "Alternative Art"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Virus",
        "block": [
          "04"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/EX7-073_P2.webp",
        "cardLv": "Lv.6",
        "cardNumber": "EX7-073",
        "cardType": "Digimon",
        "color": "Purple",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Purple",
            "cost": "4",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "12000",
        "dualEffect": "-",
        "effect": "[When Digivolving] You may use 1 Option card with [Three Musketeers]\u00a0in its text from your hand without paying the cost.\n[When Digivolving] [When Attacking] By trashing 2 cards with the [Three Musketeers]\u00a0trait in this Digimon's digivolution cards, delete 1 of your opponent's Digimon with the highest level and trash the top card of your opponent's security stack.",
        "form": "Mega",
        "id": "EX7-073_P2",
        "illustrator": "Tonamikanji",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "BeelStarmon (X Antibody)",
          "japanese": "\u30d9\u30eb\u30b9\u30bf\u30fc\u30e2\u30f3X\u6297\u4f53",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "EX-07: Extra Booster Digimon Liberator",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "12",
        "rarity": "SEC",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "[Digivolve]  Lv.6 w/[Three Musketeers]\u00a0trait w/o [X Antibody]\u00a0trait: Cost 1 ",
        "type": "Wizard/X Antibody/Three Musketeers",
        "version": "Rare Pull"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Virus",
        "block": [
          "04"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/EX7-073_P3.webp",
        "cardLv": "Lv.6",
        "cardNumber": "EX7-073",
        "cardType": "Digimon",
        "color": "Purple",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Purple",
            "cost": "4",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "12000",
        "dualEffect": "-",
        "effect": "[When Digivolving] You may use 1 Option card with [Three Musketeers]\u00a0in its text from your hand without paying the cost.\n[When Digivolving] [When Attacking] By trashing 2 cards with the [Three Musketeers]\u00a0trait in this Digimon's digivolution cards, delete 1 of your opponent's Digimon with the highest level and trash the top card of your opponent's security stack.",
        "form": "Mega",
        "id": "EX7-073_P3",
        "illustrator": "k.Dra",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "BeelStarmon (X Antibody)",
          "japanese": "\u30d9\u30eb\u30b9\u30bf\u30fc\u30e2\u30f3X\u6297\u4f53",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "12",
        "rarity": "SEC",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "[Digivolve]  Lv.6 w/[Three Musketeers]\u00a0trait w/o [X Antibody]\u00a0trait: Cost 1 ",
        "type": "Wizard/X Antibody/Three Musketeers",
        "version": "Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 187095,
    "gallery_revision": 185977
  },
  {
    "card": "EX8-055",
    "expected_variants": 3,
    "prepared_variants": 3,
    "available_scans": 2,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 2,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "EX8-055_P2"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Virus",
        "block": [
          "04"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/EX8-055.webp",
        "cardLv": "Lv.6",
        "cardNumber": "EX8-055",
        "cardType": "Digimon",
        "color": "Black",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Black",
            "cost": "4",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "12000",
        "dualEffect": "-",
        "effect": "\uff1cFragment (3)\uff1e (When this Digimon would be deleted, by trashing any 3 of its digivolution cards, it isn't deleted.)\n[When Digivolving] [When Attacking] By trashing any 3 digivolution cards with the [Mineral] or [Rock]\u00a0trait from your Digimon, this Digimon unsuspends and gains \uff1cSecurity A. +1\uff1e for the turn. (This Digimon checks 1 additional security card.)\n[End of Your Turn] [Once Per Turn] You may place up to 3 cards with the [Mineral] or [Rock]\u00a0trait from your trash as this Digimon's bottom digivolution cards.",
        "form": "Mega",
        "id": "EX8-055",
        "illustrator": "GOSSAN",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Pyramidimon",
          "japanese": "\u30d4\u30e9\u30df\u30c7\u30a3\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "\u25b9EXTRA BOOSTER CHAIN OF LIBERATION [EX-08]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "12",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Mineral/LIBERATOR",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Virus",
        "block": [
          "04"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/EX8-055_P1.webp",
        "cardLv": "Lv.6",
        "cardNumber": "EX8-055",
        "cardType": "Digimon",
        "color": "Black",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Black",
            "cost": "4",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "12000",
        "dualEffect": "-",
        "effect": "\uff1cFragment (3)\uff1e (When this Digimon would be deleted, by trashing any 3 of its digivolution cards, it isn't deleted.)\n[When Digivolving] [When Attacking] By trashing any 3 digivolution cards with the [Mineral] or [Rock]\u00a0trait from your Digimon, this Digimon unsuspends and gains \uff1cSecurity A. +1\uff1e for the turn. (This Digimon checks 1 additional security card.)\n[End of Your Turn] [Once Per Turn] You may place up to 3 cards with the [Mineral] or [Rock]\u00a0trait from your trash as this Digimon's bottom digivolution cards.",
        "form": "Mega",
        "id": "EX8-055_P1",
        "illustrator": "Tonamikanji",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Pyramidimon",
          "japanese": "\u30d4\u30e9\u30df\u30c7\u30a3\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "EX-08: Extra Booster Chain of Liberation",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "12",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Mineral/LIBERATOR",
        "version": "Alternative Art"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Virus",
        "block": [
          "04"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/EX8-055_P2.webp",
        "cardLv": "Lv.6",
        "cardNumber": "EX8-055",
        "cardType": "Digimon",
        "color": "Black",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Black",
            "cost": "4",
            "level": "5"
          }
        ],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "12000",
        "dualEffect": "-",
        "effect": "\uff1cFragment (3)\uff1e (When this Digimon would be deleted, by trashing any 3 of its digivolution cards, it isn't deleted.)\n[When Digivolving] [When Attacking] By trashing any 3 digivolution cards with the [Mineral] or [Rock]\u00a0trait from your Digimon, this Digimon unsuspends and gains \uff1cSecurity A. +1\uff1e for the turn. (This Digimon checks 1 additional security card.)\n[End of Your Turn] [Once Per Turn] You may place up to 3 cards with the [Mineral] or [Rock]\u00a0trait from your trash as this Digimon's bottom digivolution cards.",
        "form": "Mega",
        "id": "EX8-055_P2",
        "illustrator": "Kanchi Fukunari",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Pyramidimon",
          "japanese": "\u30d4\u30e9\u30df\u30c7\u30a3\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "PB-22: Digimon Liberator Debuggers Set",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "12",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Mineral/LIBERATOR",
        "version": "Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 181298,
    "gallery_revision": 164476
  },
  {
    "card": "P-226",
    "expected_variants": 1,
    "prepared_variants": 1,
    "available_scans": 0,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 0,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "P-226"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-226.webp",
        "cardLv": "-",
        "cardNumber": "P-226",
        "cardType": "",
        "color": "[[]]",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "-",
        "id": "P-226",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "[[:Category:|]]",
          "japanese": "",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "[[ ]]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Normal"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 184030,
    "gallery_revision": 176889
  },
  {
    "card": "P-229",
    "expected_variants": 2,
    "prepared_variants": 2,
    "available_scans": 2,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 2,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "P-229_P1"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-229.webp",
        "cardLv": "-",
        "cardNumber": "P-229",
        "cardType": "Option",
        "color": "Yellow",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Main] Reveal the top 3 cards of your deck. Add 1 [Puppet]\u00a0trait Digimon card and 1 [LIBERATOR]\u00a0trait card among them to the hand. Return the rest to the bottom of the deck. Then, place this card in the battle area.\n[Your Turn] When any of your [Mirai Kinosaki]s are played, \uff1cDelay\uff1e (By trashing this card after the placing turn, activate the effect below.)\n\u30fb1 of your Digimon may digivolve into a level 6 or lower [LIBERATOR]\u00a0trait card in the hand with the digivolution cost reduced by 3.",
        "form": "-",
        "id": "P-229",
        "illustrator": "Tonamikanji",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Unique Emblem: Narrative Ronde",
          "japanese": "\u30e6\u30cb\u30fc\u30af\u30a8\u30f3\u30d6\u30ec\u30e0\uff1a\u5fa1\u4f3d\u306e\u8f2a\u821e",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Box Promotion Pack: DAWN OF LIBERATOR",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "2",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Activate this card's [Main] effects.",
        "specialDigivolve": "-",
        "type": "LIBERATOR",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-229_P1.webp",
        "cardLv": "-",
        "cardNumber": "P-229",
        "cardType": "Option",
        "color": "Yellow",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Main] Reveal the top 3 cards of your deck. Add 1 [Puppet]\u00a0trait Digimon card and 1 [LIBERATOR]\u00a0trait card among them to the hand. Return the rest to the bottom of the deck. Then, place this card in the battle area.\n[Your Turn] When any of your [Mirai Kinosaki]s are played, \uff1cDelay\uff1e (By trashing this card after the placing turn, activate the effect below.)\n\u30fb1 of your Digimon may digivolve into a level 6 or lower [LIBERATOR]\u00a0trait card in the hand with the digivolution cost reduced by 3.",
        "form": "-",
        "id": "P-229_P1",
        "illustrator": "Tonamikanji",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Unique Emblem: Narrative Ronde",
          "japanese": "\u30e6\u30cb\u30fc\u30af\u30a8\u30f3\u30d6\u30ec\u30e0\uff1a\u5fa1\u4f3d\u306e\u8f2a\u821e",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "2",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Activate this card's [Main] effects.",
        "specialDigivolve": "-",
        "type": "LIBERATOR",
        "version": "Foil - Coloured Border -\u00a0Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 187846,
    "gallery_revision": 187860
  },
  {
    "card": "P-232",
    "expected_variants": 2,
    "prepared_variants": 2,
    "available_scans": 2,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 2,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "P-232_P1"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-232.webp",
        "cardLv": "-",
        "cardNumber": "P-232",
        "cardType": "Option",
        "color": "Purple",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Main] Reveal the top 3 cards of your deck. Add 1 [Evil], [Dark Dragon] or [Evil Dragon]\u00a0trait Digimon card and 1 [LIBERATOR]\u00a0trait card among them to the hand. Return the rest to the bottom of the deck. Then, place this card in the battle area.\n[Your Turn] When any of your [Yuuki]s are played, \uff1cDelay\uff1e (By trashing this card after the placing turn, activate the effect below.)\n\u30fb1 of your Digimon may digivolve into a level 6 or lower [LIBERATOR]\u00a0trait card in the hand or trash with the digivolution cost reduced by 3.",
        "form": "-",
        "id": "P-232",
        "illustrator": "Tonamikanji",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Unique Emblem: Melting Recital",
          "japanese": "\u30e6\u30cb\u30fc\u30af\u30a8\u30f3\u30d6\u30ec\u30e0\uff1a\u878d\u5fc3\u306e\u72ec\u594f",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Box Promotion Pack: DAWN OF LIBERATOR",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "2",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Activate this card's [Main] effects.",
        "specialDigivolve": "-",
        "type": "LIBERATOR",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-232_P1.webp",
        "cardLv": "-",
        "cardNumber": "P-232",
        "cardType": "Option",
        "color": "Purple",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Main] Reveal the top 3 cards of your deck. Add 1 [Evil], [Dark Dragon] or [Evil Dragon]\u00a0trait Digimon card and 1 [LIBERATOR]\u00a0trait card among them to the hand. Return the rest to the bottom of the deck. Then, place this card in the battle area.\n[Your Turn] When any of your [Yuuki]s are played, \uff1cDelay\uff1e (By trashing this card after the placing turn, activate the effect below.)\n\u30fb1 of your Digimon may digivolve into a level 6 or lower [LIBERATOR]\u00a0trait card in the hand or trash with the digivolution cost reduced by 3.",
        "form": "-",
        "id": "P-232_P1",
        "illustrator": "Tonamikanji",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Unique Emblem: Melting Recital",
          "japanese": "\u30e6\u30cb\u30fc\u30af\u30a8\u30f3\u30d6\u30ec\u30e0\uff1a\u878d\u5fc3\u306e\u72ec\u594f",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "2",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Activate this card's [Main] effects.",
        "specialDigivolve": "-",
        "type": "LIBERATOR",
        "version": "Foil - Coloured Border -\u00a0Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 187850,
    "gallery_revision": 187853
  },
  {
    "card": "P-233",
    "expected_variants": 3,
    "prepared_variants": 3,
    "available_scans": 4,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 4,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "P-233_P2"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-233.webp",
        "cardLv": "-",
        "cardNumber": "P-233",
        "cardType": "Tamer",
        "color": "Blue",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[On Play] Reveal the top 3 cards of your deck. Add 1 [Game]\u00a0trait card and 1 [Invincible], [Life] or [Entertainment]\u00a0trait card among them to the hand. Return the rest to the bottom of the deck.\n[Your Turn] When any of your Digimon get linked to a [Game], [Life] or [Entertainment]\u00a0trait card, by suspending this Tamer, gain 1 memory.",
        "form": "-",
        "id": "P-233",
        "illustrator": "No Illustrator",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Eri Karan",
          "japanese": "\u82b1\u5d50\u30a8\u30ea",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Official Store Tournament 2026 Vol.2",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Play this card without paying the cost.",
        "specialDigivolve": "-",
        "type": "App Driver/Appmon",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-233_P1.webp",
        "cardLv": "-",
        "cardNumber": "P-233",
        "cardType": "Tamer",
        "color": "Blue",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[On Play] Reveal the top 3 cards of your deck. Add 1 [Game]\u00a0trait card and 1 [Invincible], [Life] or [Entertainment]\u00a0trait card among them to the hand. Return the rest to the bottom of the deck.\n[Your Turn] When any of your Digimon get linked to a [Game], [Life] or [Entertainment]\u00a0trait card, by suspending this Tamer, gain 1 memory.",
        "form": "-",
        "id": "P-233_P1",
        "illustrator": "No Illustrator",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Eri Karan",
          "japanese": "\u82b1\u5d50\u30a8\u30ea",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Official Store Tournament 2026 Vol.2",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Play this card without paying the cost.",
        "specialDigivolve": "-",
        "type": "App Driver/Appmon",
        "version": "Foil - Stamped -\u00a01st Place Prize"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-233_P2.webp",
        "cardLv": "-",
        "cardNumber": "P-233",
        "cardType": "Tamer",
        "color": "Blue",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[On Play] Reveal the top 3 cards of your deck. Add 1 [Game]\u00a0trait card and 1 [Invincible], [Life] or [Entertainment]\u00a0trait card among them to the hand. Return the rest to the bottom of the deck.\n[Your Turn] When any of your Digimon get linked to a [Game], [Life] or [Entertainment]\u00a0trait card, by suspending this Tamer, gain 1 memory.",
        "form": "-",
        "id": "P-233_P2",
        "illustrator": "No Illustrator",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Eri Karan",
          "japanese": "\u82b1\u5d50\u30a8\u30ea",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Play this card without paying the cost.",
        "specialDigivolve": "-",
        "type": "App Driver/Appmon",
        "version": "Foil - Coloured Border -\u00a0Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 187827,
    "gallery_revision": 182009
  },
  {
    "card": "P-234",
    "expected_variants": 3,
    "prepared_variants": 3,
    "available_scans": 4,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 4,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "P-234_P2"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-234.webp",
        "cardLv": "-",
        "cardNumber": "P-234",
        "cardType": "Tamer",
        "color": "Black",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[On Play] Reveal the top 4 cards of your deck. Add 1 [System], [Navi], [Tool] or [Leviathan]\u00a0trait card among them to the hand. Return the rest to the bottom of the deck.\n[Your Turn] When effects trash any of your Digimon's link cards, by suspending this Tamer, you may link 1 [System], [Navi], [Tool] or [Leviathan]\u00a0trait card from your hand with the cost reduced by 2.",
        "form": "-",
        "id": "P-234",
        "illustrator": "No Illustrator",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Yujin Ozora",
          "japanese": "\u5927\u7a7a\u52c7\u4ec1",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Official Store Tournament 2026 Vol.2",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "App Driver/Appmon/Leviathan",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-234_P1.webp",
        "cardLv": "-",
        "cardNumber": "P-234",
        "cardType": "Tamer",
        "color": "Black",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[On Play] Reveal the top 4 cards of your deck. Add 1 [System], [Navi], [Tool] or [Leviathan]\u00a0trait card among them to the hand. Return the rest to the bottom of the deck.\n[Your Turn] When effects trash any of your Digimon's link cards, by suspending this Tamer, you may link 1 [System], [Navi], [Tool] or [Leviathan]\u00a0trait card from your hand with the cost reduced by 2.",
        "form": "-",
        "id": "P-234_P1",
        "illustrator": "No Illustrator",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Yujin Ozora",
          "japanese": "\u5927\u7a7a\u52c7\u4ec1",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Official Store Tournament 2026 Vol.2",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "App Driver/Appmon/Leviathan",
        "version": "Foil - Stamped -\u00a01st Place Prize"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-234_P2.webp",
        "cardLv": "-",
        "cardNumber": "P-234",
        "cardType": "Tamer",
        "color": "Black",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[On Play] Reveal the top 4 cards of your deck. Add 1 [System], [Navi], [Tool] or [Leviathan]\u00a0trait card among them to the hand. Return the rest to the bottom of the deck.\n[Your Turn] When effects trash any of your Digimon's link cards, by suspending this Tamer, you may link 1 [System], [Navi], [Tool] or [Leviathan]\u00a0trait card from your hand with the cost reduced by 2.",
        "form": "-",
        "id": "P-234_P2",
        "illustrator": "No Illustrator",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Yujin Ozora",
          "japanese": "\u5927\u7a7a\u52c7\u4ec1",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "App Driver/Appmon/Leviathan",
        "version": "Foil - Coloured Border -\u00a0Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 187828,
    "gallery_revision": 182010
  },
  {
    "card": "P-235",
    "expected_variants": 3,
    "prepared_variants": 3,
    "available_scans": 4,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 4,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "P-235_P2"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-235.webp",
        "cardLv": "-",
        "cardNumber": "P-235",
        "cardType": "Option",
        "color": "Yellow",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "\uff1cUse Req. ([DATA SQUAD] trait)\uff1e (Specified conditions meet color requirements.)\n[Main] Reveal the top 3 cards of your deck. Add 1 card with the [DATA SQUAD]\u00a0trait among them to the hand. Return the rest to the bottom of the deck. Then, place this card in the battle area.\n[Main] \uff1cDelay\uff1e (By trashing this card after the placing turn, activate the effect below.)\n\u30fbGain 2 memory.",
        "form": "-",
        "id": "P-235",
        "illustrator": "No Illustrator",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Digital Accident Tactics Squad",
          "japanese": "Digital Accident Tactics Squad",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Official Store Tournament 2026 Vol.2",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Place this card in the battle area.",
        "specialDigivolve": "-",
        "type": "DATA SQUAD",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-235_P1.webp",
        "cardLv": "-",
        "cardNumber": "P-235",
        "cardType": "Option",
        "color": "Yellow",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "\uff1cUse Req. ([DATA SQUAD] trait)\uff1e (Specified conditions meet color requirements.)\n[Main] Reveal the top 3 cards of your deck. Add 1 card with the [DATA SQUAD]\u00a0trait among them to the hand. Return the rest to the bottom of the deck. Then, place this card in the battle area.\n[Main] \uff1cDelay\uff1e (By trashing this card after the placing turn, activate the effect below.)\n\u30fbGain 2 memory.",
        "form": "-",
        "id": "P-235_P1",
        "illustrator": "No Illustrator",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Digital Accident Tactics Squad",
          "japanese": "Digital Accident Tactics Squad",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Official Store Tournament 2026 Vol.2",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Place this card in the battle area.",
        "specialDigivolve": "-",
        "type": "DATA SQUAD",
        "version": "Foil - Stamped -\u00a01st Place Prize"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-235_P2.webp",
        "cardLv": "-",
        "cardNumber": "P-235",
        "cardType": "Option",
        "color": "Yellow",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "\uff1cUse Req. ([DATA SQUAD] trait)\uff1e (Specified conditions meet color requirements.)\n[Main] Reveal the top 3 cards of your deck. Add 1 card with the [DATA SQUAD]\u00a0trait among them to the hand. Return the rest to the bottom of the deck. Then, place this card in the battle area.\n[Main] \uff1cDelay\uff1e (By trashing this card after the placing turn, activate the effect below.)\n\u30fbGain 2 memory.",
        "form": "-",
        "id": "P-235_P2",
        "illustrator": "No Illustrator",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Digital Accident Tactics Squad",
          "japanese": "Digital Accident Tactics Squad",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Place this card in the battle area.",
        "specialDigivolve": "-",
        "type": "DATA SQUAD",
        "version": "Foil - Coloured Border -\u00a0Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 187829,
    "gallery_revision": 182011
  },
  {
    "card": "P-236",
    "expected_variants": 3,
    "prepared_variants": 3,
    "available_scans": 4,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 4,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "P-236_P2"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-236.webp",
        "cardLv": "-",
        "cardNumber": "P-236",
        "cardType": "Option",
        "color": "Green",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "\uff1cUse Req. ([Glowing Dawn] trait)\uff1e (Specified conditions meet color requirements.)\n[Main] Reveal the top 3 cards of your deck. Add 1 card with the [Glowing Dawn]\u00a0trait among them to the hand. Return the rest to the bottom of the deck. Then, place this card in the battle area.\n[Main] \uff1cDelay\uff1e (By trashing this card after the placing turn, activate the effect below.)\n\u30fbGain 2 memory.",
        "form": "-",
        "id": "P-236",
        "illustrator": "No Illustrator",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Glowing Dawn",
          "japanese": "Glowing Dawn",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Official Store Tournament 2026 Vol.2",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Place this card in the battle area.",
        "specialDigivolve": "-",
        "type": "Glowing Dawn/BEATBREAK",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-236_P1.webp",
        "cardLv": "-",
        "cardNumber": "P-236",
        "cardType": "Option",
        "color": "Green",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "\uff1cUse Req. ([Glowing Dawn] trait)\uff1e (Specified conditions meet color requirements.)\n[Main] Reveal the top 3 cards of your deck. Add 1 card with the [Glowing Dawn]\u00a0trait among them to the hand. Return the rest to the bottom of the deck. Then, place this card in the battle area.\n[Main] \uff1cDelay\uff1e (By trashing this card after the placing turn, activate the effect below.)\n\u30fbGain 2 memory.",
        "form": "-",
        "id": "P-236_P1",
        "illustrator": "No Illustrator",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Glowing Dawn",
          "japanese": "Glowing Dawn",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Official Store Tournament 2026 Vol.2",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Place this card in the battle area.",
        "specialDigivolve": "-",
        "type": "Glowing Dawn/BEATBREAK",
        "version": "Foil - Stamped -\u00a01st Place Prize"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-236_P2.webp",
        "cardLv": "-",
        "cardNumber": "P-236",
        "cardType": "Option",
        "color": "Green",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "\uff1cUse Req. ([Glowing Dawn] trait)\uff1e (Specified conditions meet color requirements.)\n[Main] Reveal the top 3 cards of your deck. Add 1 card with the [Glowing Dawn]\u00a0trait among them to the hand. Return the rest to the bottom of the deck. Then, place this card in the battle area.\n[Main] \uff1cDelay\uff1e (By trashing this card after the placing turn, activate the effect below.)\n\u30fbGain 2 memory.",
        "form": "-",
        "id": "P-236_P2",
        "illustrator": "No Illustrator",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Glowing Dawn",
          "japanese": "Glowing Dawn",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Place this card in the battle area.",
        "specialDigivolve": "-",
        "type": "Glowing Dawn/BEATBREAK",
        "version": "Foil - Coloured Border -\u00a0Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 187830,
    "gallery_revision": 183638
  },
  {
    "card": "P-237",
    "expected_variants": 3,
    "prepared_variants": 3,
    "available_scans": 4,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 4,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "P-237_P2"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-237.webp",
        "cardLv": "-",
        "cardNumber": "P-237",
        "cardType": "Option",
        "color": "Green/Black",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "\uff1cUse Req. ([Maquinamon] in text)\uff1e (Specified conditions meet color requirements.)\n[Main] You may play 1 [Maquinamon] or [Unchained] from your hand or trash without paying the cost. Then, place this card in the battle area.\n[All Turns] When any of your [Unchained] are played, \uff1cDelay\uff1e (By trashing this card after the placing turn, activate the effect below.)\n\u30fb1 of your Digimon may digivolve into a level 6 or lower Digimon card with [Maquinamon]\u00a0in its text in the hand without paying the cost.",
        "form": "-",
        "id": "P-237",
        "illustrator": "Tonamikanji",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Unique Emblem: Machina's Ascension",
          "japanese": "\u30e6\u30cb\u30fc\u30af\u30a8\u30f3\u30d6\u30ec\u30e0\uff1a\u507d\u795e\u306e\u5929\u6607",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Official Store Tournament 2026 Vol.2",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Activate this card's [Main] effects.",
        "specialDigivolve": "-",
        "type": "LIBERATOR",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-237_P1.webp",
        "cardLv": "-",
        "cardNumber": "P-237",
        "cardType": "Option",
        "color": "Green/Black",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "\uff1cUse Req. ([Maquinamon] in text)\uff1e (Specified conditions meet color requirements.)\n[Main] You may play 1 [Maquinamon] or [Unchained] from your hand or trash without paying the cost. Then, place this card in the battle area.\n[All Turns] When any of your [Unchained] are played, \uff1cDelay\uff1e (By trashing this card after the placing turn, activate the effect below.)\n\u30fb1 of your Digimon may digivolve into a level 6 or lower Digimon card with [Maquinamon]\u00a0in its text in the hand without paying the cost.",
        "form": "-",
        "id": "P-237_P1",
        "illustrator": "Tonamikanji",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Unique Emblem: Machina's Ascension",
          "japanese": "\u30e6\u30cb\u30fc\u30af\u30a8\u30f3\u30d6\u30ec\u30e0\uff1a\u507d\u795e\u306e\u5929\u6607",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Official Store Tournament 2026 Vol.2",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Activate this card's [Main] effects.",
        "specialDigivolve": "-",
        "type": "LIBERATOR",
        "version": "Foil - Stamped -\u00a01st Place Prize"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-237_P2.webp",
        "cardLv": "-",
        "cardNumber": "P-237",
        "cardType": "Option",
        "color": "Green/Black",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "\uff1cUse Req. ([Maquinamon] in text)\uff1e (Specified conditions meet color requirements.)\n[Main] You may play 1 [Maquinamon] or [Unchained] from your hand or trash without paying the cost. Then, place this card in the battle area.\n[All Turns] When any of your [Unchained] are played, \uff1cDelay\uff1e (By trashing this card after the placing turn, activate the effect below.)\n\u30fb1 of your Digimon may digivolve into a level 6 or lower Digimon card with [Maquinamon]\u00a0in its text in the hand without paying the cost.",
        "form": "-",
        "id": "P-237_P2",
        "illustrator": "Tonamikanji",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Unique Emblem: Machina's Ascension",
          "japanese": "\u30e6\u30cb\u30fc\u30af\u30a8\u30f3\u30d6\u30ec\u30e0\uff1a\u507d\u795e\u306e\u5929\u6607",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Activate this card's [Main] effects.",
        "specialDigivolve": "-",
        "type": "LIBERATOR",
        "version": "Foil - Coloured Border -\u00a0Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 187831,
    "gallery_revision": 182013
  },
  {
    "card": "P-238",
    "expected_variants": 3,
    "prepared_variants": 3,
    "available_scans": 4,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 4,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "P-238_P2"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-238.webp",
        "cardLv": "-",
        "cardNumber": "P-238",
        "cardType": "Option",
        "color": "Purple",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "\uff1cUse Req. ([CS] trait)\uff1e (Specified conditions meet color requirements.)\n[Main] Delete 1 of your opponent\u2019s level 6 or lower Digimon. Then, place this card in the battle area.\n[Your Turn] When one of your [CS]\u00a0trait Digimon attacks, \uff1cDelay\uff1e (By trashing this card after the placing turn, activate the effect below.)\n\u30fbDelete  1 of your opponent\u2019s level 6 or lower Digimon.",
        "form": "-",
        "id": "P-238",
        "illustrator": "poroze",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Destruction Cannon",
          "japanese": "\u30c7\u30b9\u30c8\u30ed\u30a4\u30ad\u30e3\u30ce\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Official Store Tournament 2026 Vol.2",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "5",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Delete 1 of your opponent\u2019s level 6 or lower Digimon. Then, place this card in the battle area.",
        "specialDigivolve": "-",
        "type": "CS",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-238_P1.webp",
        "cardLv": "-",
        "cardNumber": "P-238",
        "cardType": "Option",
        "color": "Purple",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "\uff1cUse Req. ([CS] trait)\uff1e (Specified conditions meet color requirements.)\n[Main] Delete 1 of your opponent\u2019s level 6 or lower Digimon. Then, place this card in the battle area.\n[Your Turn] When one of your [CS]\u00a0trait Digimon attacks, \uff1cDelay\uff1e (By trashing this card after the placing turn, activate the effect below.)\n\u30fbDelete  1 of your opponent\u2019s level 6 or lower Digimon.",
        "form": "-",
        "id": "P-238_P1",
        "illustrator": "poroze",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Destruction Cannon",
          "japanese": "\u30c7\u30b9\u30c8\u30ed\u30a4\u30ad\u30e3\u30ce\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Official Store Tournament 2026 Vol.2",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "5",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Delete 1 of your opponent\u2019s level 6 or lower Digimon. Then, place this card in the battle area.",
        "specialDigivolve": "-",
        "type": "CS",
        "version": "Foil - Stamped -\u00a01st Place Prize"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-238_P2.webp",
        "cardLv": "-",
        "cardNumber": "P-238",
        "cardType": "Option",
        "color": "Purple",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "\uff1cUse Req. ([CS] trait)\uff1e (Specified conditions meet color requirements.)\n[Main] Delete 1 of your opponent\u2019s level 6 or lower Digimon. Then, place this card in the battle area.\n[Your Turn] When one of your [CS]\u00a0trait Digimon attacks, \uff1cDelay\uff1e (By trashing this card after the placing turn, activate the effect below.)\n\u30fbDelete  1 of your opponent\u2019s level 6 or lower Digimon.",
        "form": "-",
        "id": "P-238_P2",
        "illustrator": "poroze",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Destruction Cannon",
          "japanese": "\u30c7\u30b9\u30c8\u30ed\u30a4\u30ad\u30e3\u30ce\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "5",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "[Security] Delete 1 of your opponent\u2019s level 6 or lower Digimon. Then, place this card in the battle area.",
        "specialDigivolve": "-",
        "type": "CS",
        "version": "Foil - Coloured Border -\u00a0Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 187832,
    "gallery_revision": 182014
  },
  {
    "card": "P-239",
    "expected_variants": 3,
    "prepared_variants": 3,
    "available_scans": 4,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 4,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "P-239_P2"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Virus",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-239.webp",
        "cardLv": "Lv.3",
        "cardNumber": "P-239",
        "cardType": "Digimon",
        "color": "Purple",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Purple",
            "cost": "0",
            "level": "2"
          }
        ],
        "digivolveEffect": "[On Deletion] By trashing 1 card in your hand, delete 1 of your opponent's level 4 or lower Digimon.",
        "dnaDigivolve": "-",
        "dp": "3000",
        "dualEffect": "-",
        "effect": "\uff1cBlocker\uff1e (This Digimon can block in the blocker timing.)\n[On Deletion] By placing this Digimon card as the bottom digivolution card of 1 of your Digimon with [Myotismon]\u00a0in its text, that Digimon may digivolve into a Digimon card with  [Myotismon]\u00a0in its name in your hand without paying the cost.",
        "form": "Rookie",
        "id": "P-239",
        "illustrator": "Kuromori maya",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "DemiDevimon",
          "japanese": "\u30d4\u30b3\u30c7\u30d3\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Official Store Tournament 2026 Vol.3",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "4",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Evil",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Virus",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-239_P1.webp",
        "cardLv": "Lv.3",
        "cardNumber": "P-239",
        "cardType": "Digimon",
        "color": "Purple",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Purple",
            "cost": "0",
            "level": "2"
          }
        ],
        "digivolveEffect": "[On Deletion] By trashing 1 card in your hand, delete 1 of your opponent's level 4 or lower Digimon.",
        "dnaDigivolve": "-",
        "dp": "3000",
        "dualEffect": "-",
        "effect": "\uff1cBlocker\uff1e (This Digimon can block in the blocker timing.)\n[On Deletion] By placing this Digimon card as the bottom digivolution card of 1 of your Digimon with [Myotismon]\u00a0in its text, that Digimon may digivolve into a Digimon card with  [Myotismon]\u00a0in its name in your hand without paying the cost.",
        "form": "Rookie",
        "id": "P-239_P1",
        "illustrator": "Kuromori maya",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "DemiDevimon",
          "japanese": "\u30d4\u30b3\u30c7\u30d3\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Official Store Tournament 2026 Vol.3",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "4",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Evil",
        "version": "Foil - Stamped -\u00a01st Place Prize"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Virus",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-239_P2.webp",
        "cardLv": "Lv.3",
        "cardNumber": "P-239",
        "cardType": "Digimon",
        "color": "Purple",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Purple",
            "cost": "0",
            "level": "2"
          }
        ],
        "digivolveEffect": "[On Deletion] By trashing 1 card in your hand, delete 1 of your opponent's level 4 or lower Digimon.",
        "dnaDigivolve": "-",
        "dp": "3000",
        "dualEffect": "-",
        "effect": "\uff1cBlocker\uff1e (This Digimon can block in the blocker timing.)\n[On Deletion] By placing this Digimon card as the bottom digivolution card of 1 of your Digimon with [Myotismon]\u00a0in its text, that Digimon may digivolve into a Digimon card with  [Myotismon]\u00a0in its name in your hand without paying the cost.",
        "form": "Rookie",
        "id": "P-239_P2",
        "illustrator": "Kuromori maya",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "DemiDevimon",
          "japanese": "\u30d4\u30b3\u30c7\u30d3\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "4",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Evil",
        "version": "Foil - Coloured Border -\u00a0Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 188028,
    "gallery_revision": 185986
  },
  {
    "card": "P-240",
    "expected_variants": 3,
    "prepared_variants": 3,
    "available_scans": 4,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 4,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "P-240_P2"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "[Assembly\u00a0-6] Lv.5 \u00d7 Lv.4 \u00d7 Lv.3, all w/[Gammamon]\u00a0in text or w/[VB]\u00a0traitWhen this would be played, by placing the specified cards from the trash under it, reduce the play cost.",
        "attribute": "Virus",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-240.webp",
        "cardLv": "Lv.6",
        "cardNumber": "P-240",
        "cardType": "Digimon",
        "color": "Purple/Black",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Purple",
            "cost": "5",
            "level": "5"
          },
          {
            "color": "Black",
            "cost": "5",
            "level": "5"
          }
        ],
        "digivolveEffect": "[Opponent's Turn] [Once Per Turn] When one of your opponent's Digimon attacks, you may change the attack target to this Digimon.",
        "dnaDigivolve": "-",
        "dp": "13000",
        "dualEffect": "-",
        "effect": "\uff1cCollision\uff1e (During this Digimon's attack, all of your opponent's Digimon gain \uff1cBlocker\uff1e, and must block if possible.)\n\uff1cPiercing\uff1e (When this Digimon deletes your opponent's Digimon in battle while attacking, it checks security before the attack ends.)\n\uff1cReboot\uff1e (This Digimon also unsuspends in your opponent's unsuspend phase.)\n\uff1cBlocker\uff1e (This Digimon can block in the blocker timing.)\n[On Play] [When Digivolving] \uff1cDe-Digivolve  3\uff1e 1 of your opponent's Digimon. (Trash up to 3 cards from the top. You can't trash past level 3 cards.) Then, by placing 2 cards with [Gammamon]\u00a0in its text or the [VB]\u00a0trait from your trash as this Digimon's bottom digivolution cards, give 1 of your opponent's Digimon \"[Start of Your Main Phase] This Digimon attacks.\" until their turn ends.\n[On Deletion] You may play 1 [Proximamon] from your hand or trash without paying the cost.",
        "form": "Mega",
        "id": "P-240",
        "illustrator": "Moyasi",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Arcturusmon",
          "japanese": "\u30a2\u30eb\u30af\u30c8\u30a5\u30eb\u30b9\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Official Store Tournament 2026 Vol.3",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "13",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Dragonkin/VB",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "[Assembly\u00a0-6] Lv.5 \u00d7 Lv.4 \u00d7 Lv.3, all w/[Gammamon]\u00a0in text or w/[VB]\u00a0traitWhen this would be played, by placing the specified cards from the trash under it, reduce the play cost.",
        "attribute": "Virus",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-240_P1.webp",
        "cardLv": "Lv.6",
        "cardNumber": "P-240",
        "cardType": "Digimon",
        "color": "Purple/Black",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Purple",
            "cost": "5",
            "level": "5"
          },
          {
            "color": "Black",
            "cost": "5",
            "level": "5"
          }
        ],
        "digivolveEffect": "[Opponent's Turn] [Once Per Turn] When one of your opponent's Digimon attacks, you may change the attack target to this Digimon.",
        "dnaDigivolve": "-",
        "dp": "13000",
        "dualEffect": "-",
        "effect": "\uff1cCollision\uff1e (During this Digimon's attack, all of your opponent's Digimon gain \uff1cBlocker\uff1e, and must block if possible.)\n\uff1cPiercing\uff1e (When this Digimon deletes your opponent's Digimon in battle while attacking, it checks security before the attack ends.)\n\uff1cReboot\uff1e (This Digimon also unsuspends in your opponent's unsuspend phase.)\n\uff1cBlocker\uff1e (This Digimon can block in the blocker timing.)\n[On Play] [When Digivolving] \uff1cDe-Digivolve  3\uff1e 1 of your opponent's Digimon. (Trash up to 3 cards from the top. You can't trash past level 3 cards.) Then, by placing 2 cards with [Gammamon]\u00a0in its text or the [VB]\u00a0trait from your trash as this Digimon's bottom digivolution cards, give 1 of your opponent's Digimon \"[Start of Your Main Phase] This Digimon attacks.\" until their turn ends.\n[On Deletion] You may play 1 [Proximamon] from your hand or trash without paying the cost.",
        "form": "Mega",
        "id": "P-240_P1",
        "illustrator": "Moyasi",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Arcturusmon",
          "japanese": "\u30a2\u30eb\u30af\u30c8\u30a5\u30eb\u30b9\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Official Store Tournament 2026 Vol.3",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "13",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Dragonkin/VB",
        "version": "Foil - Stamped -\u00a01st Place Prize"
      },
      {
        "aceEffect": "-",
        "assembly": "[Assembly\u00a0-6] Lv.5 \u00d7 Lv.4 \u00d7 Lv.3, all w/[Gammamon]\u00a0in text or w/[VB]\u00a0traitWhen this would be played, by placing the specified cards from the trash under it, reduce the play cost.",
        "attribute": "Virus",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-240_P2.webp",
        "cardLv": "Lv.6",
        "cardNumber": "P-240",
        "cardType": "Digimon",
        "color": "Purple/Black",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Purple",
            "cost": "5",
            "level": "5"
          },
          {
            "color": "Black",
            "cost": "5",
            "level": "5"
          }
        ],
        "digivolveEffect": "[Opponent's Turn] [Once Per Turn] When one of your opponent's Digimon attacks, you may change the attack target to this Digimon.",
        "dnaDigivolve": "-",
        "dp": "13000",
        "dualEffect": "-",
        "effect": "\uff1cCollision\uff1e (During this Digimon's attack, all of your opponent's Digimon gain \uff1cBlocker\uff1e, and must block if possible.)\n\uff1cPiercing\uff1e (When this Digimon deletes your opponent's Digimon in battle while attacking, it checks security before the attack ends.)\n\uff1cReboot\uff1e (This Digimon also unsuspends in your opponent's unsuspend phase.)\n\uff1cBlocker\uff1e (This Digimon can block in the blocker timing.)\n[On Play] [When Digivolving] \uff1cDe-Digivolve  3\uff1e 1 of your opponent's Digimon. (Trash up to 3 cards from the top. You can't trash past level 3 cards.) Then, by placing 2 cards with [Gammamon]\u00a0in its text or the [VB]\u00a0trait from your trash as this Digimon's bottom digivolution cards, give 1 of your opponent's Digimon \"[Start of Your Main Phase] This Digimon attacks.\" until their turn ends.\n[On Deletion] You may play 1 [Proximamon] from your hand or trash without paying the cost.",
        "form": "Mega",
        "id": "P-240_P2",
        "illustrator": "Moyasi",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Arcturusmon",
          "japanese": "\u30a2\u30eb\u30af\u30c8\u30a5\u30eb\u30b9\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "13",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Dragonkin/VB",
        "version": "Foil - Coloured Border -\u00a0Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 190104,
    "gallery_revision": 185987
  },
  {
    "card": "P-241",
    "expected_variants": 3,
    "prepared_variants": 3,
    "available_scans": 4,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 4,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "P-241_P2"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-241.webp",
        "cardLv": "-",
        "cardNumber": "P-241",
        "cardType": "Tamer",
        "color": "Green",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Start of Your Turn] If you have 2 or less memory, set it to 3.\n[Your Turn] When any of your Digimon get linked, by suspending this Tamer, 1 of your Digimon with the [Appmon]\u00a0trait gains \uff1cVortex\uff1e (At the end of your turn, this Digimon may attack an opponent's Digimon. With this effect, it can attack the turn it was played.) and +3000 DP for the turn. Then, 1 of your Digimon may app fuse into a Digimon card in the hand.",
        "form": "-",
        "id": "P-241",
        "illustrator": "No Illustrator",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Yujin Ozora",
          "japanese": "\u5927\u7a7a\u52c7\u4ec1",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Official Store Tournament 2026 Vol.3",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "4",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "[Rule] Trait: Has [Leviathan] Type.",
        "securityEffect": "[Security] Play this card without paying the cost.",
        "specialDigivolve": "-",
        "type": "App Driver/Appmon",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-241_P1.webp",
        "cardLv": "-",
        "cardNumber": "P-241",
        "cardType": "Tamer",
        "color": "Green",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Start of Your Turn] If you have 2 or less memory, set it to 3.\n[Your Turn] When any of your Digimon get linked, by suspending this Tamer, 1 of your Digimon with the [Appmon]\u00a0trait gains \uff1cVortex\uff1e (At the end of your turn, this Digimon may attack an opponent's Digimon. With this effect, it can attack the turn it was played.) and +3000 DP for the turn. Then, 1 of your Digimon may app fuse into a Digimon card in the hand.",
        "form": "-",
        "id": "P-241_P1",
        "illustrator": "No Illustrator",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Yujin Ozora",
          "japanese": "\u5927\u7a7a\u52c7\u4ec1",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Official Store Tournament 2026 Vol.3",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "4",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "[Rule] Trait: Has [Leviathan] Type.",
        "securityEffect": "[Security] Play this card without paying the cost.",
        "specialDigivolve": "-",
        "type": "App Driver/Appmon",
        "version": "Foil - Stamped -\u00a01st Place Prize"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-241_P2.webp",
        "cardLv": "-",
        "cardNumber": "P-241",
        "cardType": "Tamer",
        "color": "Green",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Start of Your Turn] If you have 2 or less memory, set it to 3.\n[Your Turn] When any of your Digimon get linked, by suspending this Tamer, 1 of your Digimon with the [Appmon]\u00a0trait gains \uff1cVortex\uff1e (At the end of your turn, this Digimon may attack an opponent's Digimon. With this effect, it can attack the turn it was played.) and +3000 DP for the turn. Then, 1 of your Digimon may app fuse into a Digimon card in the hand.",
        "form": "-",
        "id": "P-241_P2",
        "illustrator": "No Illustrator",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Yujin Ozora",
          "japanese": "\u5927\u7a7a\u52c7\u4ec1",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "4",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "[Rule] Trait: Has [Leviathan] Type.",
        "securityEffect": "[Security] Play this card without paying the cost.",
        "specialDigivolve": "-",
        "type": "App Driver/Appmon",
        "version": "Foil - Coloured Border -\u00a0Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 188030,
    "gallery_revision": 185999
  },
  {
    "card": "P-242",
    "expected_variants": 3,
    "prepared_variants": 3,
    "available_scans": 4,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 4,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "P-242_P2"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-242.webp",
        "cardLv": "-",
        "cardNumber": "P-242",
        "cardType": "Tamer",
        "color": "Purple",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Start of Your Main Phase] By trashing 1 [System], [Life (App Name)] or [Transmutation (App Name)]\u00a0trait card from your hand, \uff1cDraw 1\uff1e (Draw 1 card from your deck.) and gain 1 memory.\n[Main] By suspending this Tamer, you may link 1 [System], [Life (App Name)] or [Transmutation (App Name)]\u00a0trait card from your trash to 1 of your Digimon with the cost reduced by 1.",
        "form": "-",
        "id": "P-242",
        "illustrator": "No Illustrator",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Rei Katsura",
          "japanese": "\u6842\u30ec\u30a4",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Official Store Tournament 2026 Vol.3",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "4",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "[Security] Play this card without paying the cost.",
        "specialDigivolve": "-",
        "type": "App Driver/Appmon",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-242_P1.webp",
        "cardLv": "-",
        "cardNumber": "P-242",
        "cardType": "Tamer",
        "color": "Purple",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Start of Your Main Phase] By trashing 1 [System], [Life (App Name)] or [Transmutation (App Name)]\u00a0trait card from your hand, \uff1cDraw 1\uff1e (Draw 1 card from your deck.) and gain 1 memory.\n[Main] By suspending this Tamer, you may link 1 [System], [Life (App Name)] or [Transmutation (App Name)]\u00a0trait card from your trash to 1 of your Digimon with the cost reduced by 1.",
        "form": "-",
        "id": "P-242_P1",
        "illustrator": "No Illustrator",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Rei Katsura",
          "japanese": "\u6842\u30ec\u30a4",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Official Store Tournament 2026 Vol.3",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "4",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "[Security] Play this card without paying the cost.",
        "specialDigivolve": "-",
        "type": "App Driver/Appmon",
        "version": "Foil - Stamped -\u00a01st Place Prize"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-242_P2.webp",
        "cardLv": "-",
        "cardNumber": "P-242",
        "cardType": "Tamer",
        "color": "Purple",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Start of Your Main Phase] By trashing 1 [System], [Life (App Name)] or [Transmutation (App Name)]\u00a0trait card from your hand, \uff1cDraw 1\uff1e (Draw 1 card from your deck.) and gain 1 memory.\n[Main] By suspending this Tamer, you may link 1 [System], [Life (App Name)] or [Transmutation (App Name)]\u00a0trait card from your trash to 1 of your Digimon with the cost reduced by 1.",
        "form": "-",
        "id": "P-242_P2",
        "illustrator": "No Illustrator",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Rei Katsura",
          "japanese": "\u6842\u30ec\u30a4",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "4",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "[Security] Play this card without paying the cost.",
        "specialDigivolve": "-",
        "type": "App Driver/Appmon",
        "version": "Foil - Coloured Border -\u00a0Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 188031,
    "gallery_revision": 186000
  },
  {
    "card": "P-243",
    "expected_variants": 3,
    "prepared_variants": 3,
    "available_scans": 4,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 4,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "P-243_P2"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-243.webp",
        "cardLv": "-",
        "cardNumber": "P-243",
        "cardType": "Option",
        "color": "Black",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "\uff1cUse Req. ([DM] trait)\uff1e (Specified conditions meet color requirements.)\n[Main] By trashing 1 card in your hand, \uff1cDraw 2\uff1e (Draw 2 cards from your deck.) Then, place this card in the battle area.\n[Start of Your Turn] If your opponent has a Digimon, \uff1cDelay\uff1e (By trashing this card after the placing turn, activate the effect below.)\n\u30fbBy returning 1 [DM]\u00a0trait Digimon card from trash to the top of your deck, you may play 1 play cost of 3 or lower [DM]\u00a0trait card from your trash without paying the cost.",
        "form": "-",
        "id": "P-243",
        "illustrator": "No Illustrator",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Digiseabass",
          "japanese": "\u30c7\u30b8\u30ab\u30eb",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Official Store Tournament 2026 Vol.3",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "[Security] You may play 1 play cost of 3 or lower [DM]\u00a0trait card from your hand or trash without paying the cost.",
        "specialDigivolve": "-",
        "type": "DM",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-243_P1.webp",
        "cardLv": "-",
        "cardNumber": "P-243",
        "cardType": "Option",
        "color": "Black",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "\uff1cUse Req. ([DM] trait)\uff1e (Specified conditions meet color requirements.)\n[Main] By trashing 1 card in your hand, \uff1cDraw 2\uff1e (Draw 2 cards from your deck.) Then, place this card in the battle area.\n[Start of Your Turn] If your opponent has a Digimon, \uff1cDelay\uff1e (By trashing this card after the placing turn, activate the effect below.)\n\u30fbBy returning 1 [DM]\u00a0trait Digimon card from trash to the top of your deck, you may play 1 play cost of 3 or lower [DM]\u00a0trait card from your trash without paying the cost.",
        "form": "-",
        "id": "P-243_P1",
        "illustrator": "No Illustrator",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Digiseabass",
          "japanese": "\u30c7\u30b8\u30ab\u30eb",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Official Store Tournament 2026 Vol.3",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "[Security] You may play 1 play cost of 3 or lower [DM]\u00a0trait card from your hand or trash without paying the cost.",
        "specialDigivolve": "-",
        "type": "DM",
        "version": "Foil - Stamped -\u00a01st Place Prize"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-243_P2.webp",
        "cardLv": "-",
        "cardNumber": "P-243",
        "cardType": "Option",
        "color": "Black",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "\uff1cUse Req. ([DM] trait)\uff1e (Specified conditions meet color requirements.)\n[Main] By trashing 1 card in your hand, \uff1cDraw 2\uff1e (Draw 2 cards from your deck.) Then, place this card in the battle area.\n[Start of Your Turn] If your opponent has a Digimon, \uff1cDelay\uff1e (By trashing this card after the placing turn, activate the effect below.)\n\u30fbBy returning 1 [DM]\u00a0trait Digimon card from trash to the top of your deck, you may play 1 play cost of 3 or lower [DM]\u00a0trait card from your trash without paying the cost.",
        "form": "-",
        "id": "P-243_P2",
        "illustrator": "No Illustrator",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Digiseabass",
          "japanese": "\u30c7\u30b8\u30ab\u30eb",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "[Security] You may play 1 play cost of 3 or lower [DM]\u00a0trait card from your hand or trash without paying the cost.",
        "specialDigivolve": "-",
        "type": "DM",
        "version": "Foil - Coloured Border -\u00a0Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 188032,
    "gallery_revision": 186001
  },
  {
    "card": "P-244",
    "expected_variants": 3,
    "prepared_variants": 3,
    "available_scans": 4,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 4,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "P-244_P2"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-244.webp",
        "cardLv": "-",
        "cardNumber": "P-244",
        "cardType": "Option",
        "color": "Black",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Main] You may play 1 [Vemmon] or [Zenith] from your hand or trash without paying the cost. Then, place this card in the battle area.\n[All Turns] When effects place [Vemmon] as any of your Digimon's digivolution cards, \uff1cDelay\uff1e (By trashing this card after the placing turn, activate the effect below.)\n\u30fb1 of your Digimon with [Vemmon]\u00a0in its text may digivolve into a Digimon card with [Vemmon]\u00a0in its text in the hand or trash with the cost reduced by 3.",
        "form": "-",
        "id": "P-244",
        "illustrator": "Tonamikanji",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Unique Emblem: Ragnarok Attainer",
          "japanese": "\u30e6\u30cb\u30fc\u30af\u30a8\u30f3\u30d6\u30ec\u30e0\uff1a\u7d42\u7109\u306e\u5230\u9054\u8005",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Official Store Tournament 2026 Vol.3",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "[Security] Activate this card's [Main] effects.",
        "specialDigivolve": "-",
        "type": "LIBERATOR",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-244_P1.webp",
        "cardLv": "-",
        "cardNumber": "P-244",
        "cardType": "Option",
        "color": "Black",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Main] You may play 1 [Vemmon] or [Zenith] from your hand or trash without paying the cost. Then, place this card in the battle area.\n[All Turns] When effects place [Vemmon] as any of your Digimon's digivolution cards, \uff1cDelay\uff1e (By trashing this card after the placing turn, activate the effect below.)\n\u30fb1 of your Digimon with [Vemmon]\u00a0in its text may digivolve into a Digimon card with [Vemmon]\u00a0in its text in the hand or trash with the cost reduced by 3.",
        "form": "-",
        "id": "P-244_P1",
        "illustrator": "Tonamikanji",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Unique Emblem: Ragnarok Attainer",
          "japanese": "\u30e6\u30cb\u30fc\u30af\u30a8\u30f3\u30d6\u30ec\u30e0\uff1a\u7d42\u7109\u306e\u5230\u9054\u8005",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "Official Store Tournament 2026 Vol.3",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "[Security] Activate this card's [Main] effects.",
        "specialDigivolve": "-",
        "type": "LIBERATOR",
        "version": "Foil - Stamped -\u00a01st Place Prize"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-244_P2.webp",
        "cardLv": "-",
        "cardNumber": "P-244",
        "cardType": "Option",
        "color": "Black",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "[Main] You may play 1 [Vemmon] or [Zenith] from your hand or trash without paying the cost. Then, place this card in the battle area.\n[All Turns] When effects place [Vemmon] as any of your Digimon's digivolution cards, \uff1cDelay\uff1e (By trashing this card after the placing turn, activate the effect below.)\n\u30fb1 of your Digimon with [Vemmon]\u00a0in its text may digivolve into a Digimon card with [Vemmon]\u00a0in its text in the hand or trash with the cost reduced by 3.",
        "form": "-",
        "id": "P-244_P2",
        "illustrator": "Tonamikanji",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "Unique Emblem: Ragnarok Attainer",
          "japanese": "\u30e6\u30cb\u30fc\u30af\u30a8\u30f3\u30d6\u30ec\u30e0\uff1a\u7d42\u7109\u306e\u5230\u9054\u8005",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "3",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "[Security] Activate this card's [Main] effects.",
        "specialDigivolve": "-",
        "type": "LIBERATOR",
        "version": "Foil - Coloured Border -\u00a0Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 188033,
    "gallery_revision": 190611
  },
  {
    "card": "P-251",
    "expected_variants": 3,
    "prepared_variants": 1,
    "available_scans": 0,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 0,
    "missing_image_requests": [],
    "missing_variants": [
      "P-251_P1",
      "P-251_P2"
    ],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "P-251",
      "P-251_P1",
      "P-251_P2"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/P-251.webp",
        "cardLv": "-",
        "cardNumber": "P-251",
        "cardType": "",
        "color": "[[]]",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "-",
        "id": "P-251",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "[[:Category:|]]",
          "japanese": "",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "[[ ]]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "P",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Normal"
      }
    ],
    "card_data_passed": false,
    "image_check_passed": null,
    "passed": false,
    "log": "\ud83d\udcca Processing 1 cards using MediaWiki API...\n[1/1] P-251 - [[:Category:|]]\n\n\u2705 Card data extraction completed!\n\ud83d\udcc8 Successfully processed: 1 cards\n\u274c Errors: 0\n\u23f1\ufe0f  Total time: 0.0s\n\ud83d\ude80 Average speed: 0.0 cards/sec\n\ud83d\ude80 Starting card image download process using MediaWiki API...\n\ud83d\udcca Processing 1 card links...\nChecking /wiki/P-251\n\n==================================================\n\ud83d\udcca DOWNLOAD SUMMARY\n==================================================\n\u2705 Successfully downloaded: 0 images\n\u23ed\ufe0f  Skipped (already exist): 0 images\n\u274c Failed downloads: 0 images\n\ud83d\udcc8 Total processed: 0 images\n==================================================\nSaving DigimonCard JSON!\n\nConversion complete: 0 files converted, 0 files failed\n",
    "page_revision": 190608,
    "gallery_revision": 190736
  },
  {
    "card": "SD01-01",
    "passed": false,
    "blocked": true,
    "error": "missingtitle"
  },
  {
    "card": "SD02-01",
    "passed": false,
    "blocked": true,
    "error": "missingtitle"
  },
  {
    "card": "ST22-13",
    "expected_variants": 2,
    "prepared_variants": 2,
    "available_scans": 2,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 2,
    "missing_image_requests": [],
    "missing_variants": [],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "ST22-13_P1"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Data",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/ST22-13.webp",
        "cardLv": "Lv.5",
        "cardNumber": "ST22-13",
        "cardType": "Digimon",
        "color": "Green",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Green",
            "cost": "3",
            "level": "4"
          }
        ],
        "digivolveEffect": "[When Attacking] [Once Per Turn] If your opponent has no unsuspended Digimon, this Digimon with the [Vortex Warriors]\u00a0trait may unsuspend.",
        "dnaDigivolve": "-",
        "dp": "7000",
        "dualEffect": "-",
        "effect": "\uff1cFortitude\uff1e (When this Digimon with digivolution cards is deleted, play this card without paying the cost.)\n\uff1cVortex\uff1e (At the end of your turn, this Digimon may attack an opponent's Digimon. With this effect, it can attack the turn it was played.)\n[On Play] [When Digivolving] [When Attacking] You may suspend 1 Digimon. Then, this Digimon gains +3000 DP for the turn.",
        "form": "Ultimate",
        "id": "ST22-13",
        "illustrator": "E X tiger",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "GrandGalemon",
          "japanese": "\u30b0\u30e9\u30f3\u30b2\u30a4\u30eb\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "ST-22: ADVANCED DECK SET AMETHYST MANDALA",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "7",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Bird Dragon/Vortex Warriors/LIBERATOR",
        "version": "Normal"
      },
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "Data",
        "block": [
          "05"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/ST22-13_P1.webp",
        "cardLv": "Lv.5",
        "cardNumber": "ST22-13",
        "cardType": "Digimon",
        "color": "Green",
        "digiXros": "-",
        "digivolveCondition": [
          {
            "color": "Green",
            "cost": "3",
            "level": "4"
          }
        ],
        "digivolveEffect": "[When Attacking] [Once Per Turn] If your opponent has no unsuspended Digimon, this Digimon with the [Vortex Warriors]\u00a0trait may unsuspend.",
        "dnaDigivolve": "-",
        "dp": "7000",
        "dualEffect": "-",
        "effect": "\uff1cFortitude\uff1e (When this Digimon with digivolution cards is deleted, play this card without paying the cost.)\n\uff1cVortex\uff1e (At the end of your turn, this Digimon may attack an opponent's Digimon. With this effect, it can attack the turn it was played.)\n[On Play] [When Digivolving] [When Attacking] You may suspend 1 Digimon. Then, this Digimon gains +3000 DP for the turn.",
        "form": "Ultimate",
        "id": "ST22-13_P1",
        "illustrator": "E X tiger",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "GrandGalemon",
          "japanese": "\u30b0\u30e9\u30f3\u30b2\u30a4\u30eb\u30e2\u30f3",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "7",
        "rarity": "SR",
        "restrictions": {
          "chinese": "Unrestricted",
          "english": "Unrestricted",
          "japanese": "Unrestricted",
          "korean": "Unrestricted"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "Bird Dragon/Vortex Warriors/LIBERATOR",
        "version": "Foil - Coloured Border -\u00a0Alternative Art"
      }
    ],
    "card_data_passed": true,
    "image_check_passed": null,
    "passed": true,
    "page_revision": 187842,
    "gallery_revision": 187856
  },
  {
    "card": "ST25-01",
    "expected_variants": 2,
    "prepared_variants": 1,
    "available_scans": 0,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 0,
    "missing_image_requests": [],
    "missing_variants": [
      "ST25-01_P1"
    ],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "ST25-01",
      "ST25-01_P1"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/ST25-01.webp",
        "cardLv": "-",
        "cardNumber": "ST25-01",
        "cardType": "",
        "color": "[[]]",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "-",
        "id": "ST25-01",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "[[:Category:|]]",
          "japanese": "",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "STARTER DECK DIGIMON ALYSION RUBEUSDRAMON [ST-25]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "-",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Normal"
      }
    ],
    "card_data_passed": false,
    "image_check_passed": null,
    "passed": false,
    "log": "\ud83d\udcca Processing 1 cards using MediaWiki API...\n[1/1] ST25-01 - [[:Category:|]]\n\n\u2705 Card data extraction completed!\n\ud83d\udcc8 Successfully processed: 1 cards\n\u274c Errors: 0\n\u23f1\ufe0f  Total time: 0.0s\n\ud83d\ude80 Average speed: 1001.3 cards/sec\n\ud83d\ude80 Starting card image download process using MediaWiki API...\n\ud83d\udcca Processing 1 card links...\nChecking /wiki/ST25-01\n\n==================================================\n\ud83d\udcca DOWNLOAD SUMMARY\n==================================================\n\u2705 Successfully downloaded: 0 images\n\u23ed\ufe0f  Skipped (already exist): 0 images\n\u274c Failed downloads: 0 images\n\ud83d\udcc8 Total processed: 0 images\n==================================================\nSaving DigimonCard JSON!\n\nConversion complete: 0 files converted, 0 files failed\n",
    "page_revision": 193470,
    "gallery_revision": 181986
  },
  {
    "card": "ST25-02",
    "passed": false,
    "blocked": true,
    "error": "missingtitle"
  },
  {
    "card": "ST25-03",
    "passed": false,
    "blocked": true,
    "error": "missingtitle"
  },
  {
    "card": "ST25-15",
    "passed": false,
    "blocked": true,
    "error": "missingtitle"
  },
  {
    "card": "ST26-01",
    "expected_variants": 2,
    "prepared_variants": 1,
    "available_scans": 0,
    "downloaded_images": 0,
    "converted_images": 0,
    "image_downloads_checked": false,
    "requested_images": 0,
    "missing_image_requests": [],
    "missing_variants": [
      "ST26-01_P1"
    ],
    "extra_variants": [],
    "missing_downloads": null,
    "invalid_images": [],
    "conversion_failures": [],
    "core_data_mismatches": [],
    "duplicate_ids": [],
    "metadata_mismatches": [],
    "scanless_variants": [
      "ST26-01",
      "ST26-01_P1"
    ],
    "prepared": [
      {
        "aceEffect": "-",
        "assembly": "-",
        "attribute": "-",
        "block": [
          "06"
        ],
        "burstDigivolve": "-",
        "cardImage": "assets/images/cards/ST26-01.webp",
        "cardLv": "-",
        "cardNumber": "ST26-01",
        "cardType": "",
        "color": "[[]]",
        "digiXros": "-",
        "digivolveCondition": [],
        "digivolveEffect": "-",
        "dnaDigivolve": "-",
        "dp": "-",
        "dualEffect": "-",
        "effect": "-",
        "form": "-",
        "id": "ST26-01",
        "illustrator": "To be completed",
        "linkDP": "-",
        "linkEffect": "-",
        "linkRequirement": "-",
        "name": {
          "english": "[[:Category:|]]",
          "japanese": "",
          "korean": "-",
          "simplifiedChinese": "-",
          "traditionalChinese": "-"
        },
        "notes": "STARTER DECK DIGIMON ALYSION YUKINAMON [ST-26]",
        "optionCardColourRequirement": "-",
        "optionCardEffect": "-",
        "playCost": "-",
        "rarity": "-",
        "restrictions": {
          "chinese": "Not released",
          "english": "Not released",
          "japanese": "Not released",
          "korean": "Not released"
        },
        "rule": "-",
        "securityEffect": "-",
        "specialDigivolve": "-",
        "type": "-",
        "version": "Normal"
      }
    ],
    "card_data_passed": false,
    "image_check_passed": null,
    "passed": false,
    "log": "\ud83d\udcca Processing 1 cards using MediaWiki API...\n[1/1] ST26-01 - [[:Category:|]]\n\n\u2705 Card data extraction completed!\n\ud83d\udcc8 Successfully processed: 1 cards\n\u274c Errors: 0\n\u23f1\ufe0f  Total time: 0.0s\n\ud83d\ude80 Average speed: 1981.2 cards/sec\n\ud83d\ude80 Starting card image download process using MediaWiki API...\n\ud83d\udcca Processing 1 card links...\nChecking /wiki/ST26-01\n\n==================================================\n\ud83d\udcca DOWNLOAD SUMMARY\n==================================================\n\u2705 Successfully downloaded: 0 images\n\u23ed\ufe0f  Skipped (already exist): 0 images\n\u274c Failed downloads: 0 images\n\ud83d\udcc8 Total processed: 0 images\n==================================================\nSaving DigimonCard JSON!\n\nConversion complete: 0 files converted, 0 files failed\n",
    "page_revision": 193471,
    "gallery_revision": 184032
  }
]
```
