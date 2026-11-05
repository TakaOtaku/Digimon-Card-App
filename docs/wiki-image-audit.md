# English Wiki Image Audit

Generated: 2026-11-05T13:10:25.697483+00:00

- English records: 8969; unique IDs: 8960.
- Garage object names: 20652; local-only mode: False.
- Images absent from Garage and local staging: 95.
- Wiki card/gallery checks attempted (including Omnimon/Blinding Ray controls): 93.
- Duplicate IDs: {"BT12-057_P2": 2, "BT12-072_P1": 2, "BT3-111_P2-Errata": 2, "BT9-112_P2": 2, "EX1-066_P3": 2, "EX1-073-Errata": 2, "EX5-070_P2": 2, "ST12-12_P2": 2, "ST12-13_P1": 2}.

## Scope And Limits

The shipped English prepared JSON is the audited snapshot. Garage key listing is read-only. Object presence is not a public CDN health check; an absent key can still have a browser fallback. Wiki failures remain unresolved. No card JSON, images, uploads, or user decks are modified. This snapshot may differ from the deployed site. Local-only results cannot establish remote absence.

## Matching Decision

Wiki image filenames remain variant identities. Table-position suffixes are only hints: the release caption must match before a suffix may select a metadata row. Real prints cannot reuse consumed rows; sample scans may use their own print's row. Resolved gallery identities bind samples to the correct row even when provisional table numbering differs. All linked caption releases are considered. Same-release suffix hints still distinguish AA/RP/SP. Unmatched legitimate RP/SP table rows remain visible; absence of a scan alone is not grounds for deletion. Change detection compares release/type/illustrator associations, not provisional table IDs, so metadata corrections propagate without treating table-vs-gallery suffix differences as perpetual changes. Ambiguous same-release ordering and stale stored metadata require manual review; this audit does not prove all Japanese variants correct.

## Classification Counts

- Main page exists; gallery absent: 17.
- Wiki card page absent: 3.
- Wiki gallery lists print without a scan: 75.

## Reproduced Script Findings

- Omnimon: table order assigns Cup to provisional _P2 and Rare Pull to _P3, but gallery filenames are the reverse. Caption-constrained matching repairs the associations without renaming images.
- Blinding Ray: the old matcher reuses the RB-01 row and assigns ST-17 metadata to the Rare Pull image, leaving a table row that generates phantom BT4-104_P5. The repaired replay produces five alternates plus the base, with Rare Pull at _P3.
- Metadata change detection now includes release/type/illustrator associations so swapping types between releases is not missed.
- Cards with changed replay results: BT1-084, BT27-052, BT4-104.
- Gallery entries lacking table metadata are left unresolved rather than receiving another print's type. Plain-text captions without release links and missing wiki pages are documented below, not guessed.
- Duplicate stored IDs are listed above for follow-up; this audit does not rewrite saved card identities.

## Reproduction

With the project Python dependencies installed:

```powershell
python -B scripts/python/Wiki/AuditCardImages.py --output docs/wiki-image-audit.md
python -B -m unittest discover -s scripts/python/tests
```


## Missing Requested Images

| Variant | Available browser fallback | Wiki finding |
| --- | --- | --- |
| BD01-01 | None | Main page exists; gallery absent |
| BD01-04 | None | Main page exists; gallery absent |
| BD01-06 | None | Main page exists; gallery absent |
| BD01-07 | None | Main page exists; gallery absent |
| BD01-08 | None | Main page exists; gallery absent |
| BD01-09 | None | Main page exists; gallery absent |
| BD02-01 | None | Main page exists; gallery absent |
| BD02-05 | None | Main page exists; gallery absent |
| BD02-06 | None | Main page exists; gallery absent |
| BD02-07 | None | Main page exists; gallery absent |
| BD02-09 | None | Main page exists; gallery absent |
| BD02-10 | None | Main page exists; gallery absent |
| BD03-01 | None | Main page exists; gallery absent |
| BT17-059_P1 | None | Wiki gallery lists print without a scan |
| BT18-054_P0 | None | Wiki gallery lists print without a scan |
| BT20-013_P1 | None | Wiki gallery lists print without a scan |
| BT20-063_P0 | None | Wiki gallery lists print without a scan |
| BT21-046_P1 | None | Wiki gallery lists print without a scan |
| BT22-004_P1 | None | Wiki gallery lists print without a scan |
| BT22-005_P1 | None | Wiki gallery lists print without a scan |
| BT22-063_P2 | None | Wiki gallery lists print without a scan |
| BT22-099_P1 | None | Wiki gallery lists print without a scan |
| BT23-013_P2 | None | Wiki gallery lists print without a scan |
| BT23-092_P1 | None | Wiki gallery lists print without a scan |
| BT23-099_P1 | None | Wiki gallery lists print without a scan |
| BT24-018_P2 | None | Wiki gallery lists print without a scan |
| BT24-085_P3 | None | Wiki gallery lists print without a scan |
| BT27-001 | None | Wiki gallery lists print without a scan |
| BT27-005 | None | Wiki gallery lists print without a scan |
| BT27-006 | None | Wiki gallery lists print without a scan |
| BT27-011 | None | Wiki gallery lists print without a scan |
| BT27-014 | None | Wiki gallery lists print without a scan |
| BT27-016 | None | Wiki gallery lists print without a scan |
| BT27-018 | None | Wiki gallery lists print without a scan |
| BT27-019 | None | Wiki gallery lists print without a scan |
| BT27-022 | None | Wiki gallery lists print without a scan |
| BT27-024 | None | Wiki gallery lists print without a scan |
| BT27-027 | None | Wiki gallery lists print without a scan |
| BT27-029 | None | Wiki gallery lists print without a scan |
| BT27-030 | None | Wiki gallery lists print without a scan |
| BT27-032 | None | Wiki gallery lists print without a scan |
| BT27-033 | None | Wiki gallery lists print without a scan |
| BT27-035_P2 | None | Wiki gallery lists print without a scan |
| BT27-037 | None | Wiki gallery lists print without a scan |
| BT27-052_P2 | None | Wiki gallery lists print without a scan |
| BT27-054 | None | Wiki gallery lists print without a scan |
| BT27-059 | None | Wiki gallery lists print without a scan |
| BT27-062 | None | Wiki gallery lists print without a scan |
| BT27-063 | None | Wiki gallery lists print without a scan |
| BT27-068 | None | Wiki gallery lists print without a scan |
| BT27-085_P2 | None | Wiki gallery lists print without a scan |
| BT27-086 | None | Wiki gallery lists print without a scan |
| BT27-088 | None | Wiki gallery lists print without a scan |
| BT27-089 | None | Wiki gallery lists print without a scan |
| BT27-103_P2 | None | Wiki gallery lists print without a scan |
| BT27-104 | None | Wiki gallery lists print without a scan |
| BT27-104_P1 | None | Wiki gallery lists print without a scan |
| BT27-104_P2 | None | Wiki gallery lists print without a scan |
| BT5-090_P2 | None | Wiki gallery lists print without a scan |
| ED01-01 | None | Main page exists; gallery absent |
| ED02-01 | None | Main page exists; gallery absent |
| EX14-001 | None | Wiki gallery lists print without a scan |
| EX14-001_P1 | None | Wiki gallery lists print without a scan |
| EX14-012_P1 | None | Wiki gallery lists print without a scan |
| EX14-054_P1 | None | Wiki gallery lists print without a scan |
| EX14-054_P2 | None | Wiki gallery lists print without a scan |
| EX5-058_P1 | None | Wiki gallery lists print without a scan |
| EX5-063_P3 | None | Wiki gallery lists print without a scan |
| EX7-051_P1 | None | Wiki gallery lists print without a scan |
| EX7-073_P3 | None | Wiki gallery lists print without a scan |
| EX8-055_P2 | None | Wiki gallery lists print without a scan |
| P-226 | None | Wiki gallery lists print without a scan |
| P-229_P1 | None | Wiki gallery lists print without a scan |
| P-232_P1 | None | Wiki gallery lists print without a scan |
| P-233_P2 | None | Wiki gallery lists print without a scan |
| P-234_P2 | None | Wiki gallery lists print without a scan |
| P-235_P2 | None | Wiki gallery lists print without a scan |
| P-236_P2 | None | Wiki gallery lists print without a scan |
| P-237_P2 | None | Wiki gallery lists print without a scan |
| P-238_P2 | None | Wiki gallery lists print without a scan |
| P-239_P2 | None | Wiki gallery lists print without a scan |
| P-240_P2 | None | Wiki gallery lists print without a scan |
| P-241_P2 | None | Wiki gallery lists print without a scan |
| P-242_P2 | None | Wiki gallery lists print without a scan |
| P-243_P2 | None | Wiki gallery lists print without a scan |
| P-244_P2 | None | Wiki gallery lists print without a scan |
| P-251 | None | Wiki gallery lists print without a scan |
| SD01-01 | None | Main page exists; gallery absent |
| SD02-01 | None | Main page exists; gallery absent |
| ST22-13_P1 | None | Wiki gallery lists print without a scan |
| ST25-01 | None | Wiki gallery lists print without a scan |
| ST25-02 | None | Wiki card page absent |
| ST25-03 | None | Wiki card page absent |
| ST25-15 | None | Wiki card page absent |
| ST26-01 | None | Wiki gallery lists print without a scan |

## Wiki Evidence And Parser Replay

Before/after replay starts with fresh table rows, not previously resolved variant IDs. A synthetic print is an unmatched RP/SP row invented by the pipeline, not proof of an additional gallery print.

### BD01-01

[Card](https://digimoncardgame.fandom.com/wiki/BD01-01) | [Gallery](https://digimoncardgame.fandom.com/wiki/BD01-01/Gallery)

```json
{
  "card": "BD01-01",
  "page_revision": 193629,
  "english_table": true,
  "rows": [],
  "main_images": [],
  "gallery": [],
  "gallery_error": "ValueError: missingtitle"
}
```

### BD01-04

[Card](https://digimoncardgame.fandom.com/wiki/BD01-04) | [Gallery](https://digimoncardgame.fandom.com/wiki/BD01-04/Gallery)

```json
{
  "card": "BD01-04",
  "page_revision": 193698,
  "english_table": true,
  "rows": [],
  "main_images": [],
  "gallery": [],
  "gallery_error": "ValueError: missingtitle"
}
```

### BD01-06

[Card](https://digimoncardgame.fandom.com/wiki/BD01-06) | [Gallery](https://digimoncardgame.fandom.com/wiki/BD01-06/Gallery)

```json
{
  "card": "BD01-06",
  "page_revision": 193624,
  "english_table": true,
  "rows": [],
  "main_images": [],
  "gallery": [],
  "gallery_error": "ValueError: missingtitle"
}
```

### BD01-07

[Card](https://digimoncardgame.fandom.com/wiki/BD01-07) | [Gallery](https://digimoncardgame.fandom.com/wiki/BD01-07/Gallery)

```json
{
  "card": "BD01-07",
  "page_revision": 193697,
  "english_table": true,
  "rows": [],
  "main_images": [],
  "gallery": [],
  "gallery_error": "ValueError: missingtitle"
}
```

### BD01-08

[Card](https://digimoncardgame.fandom.com/wiki/BD01-08) | [Gallery](https://digimoncardgame.fandom.com/wiki/BD01-08/Gallery)

```json
{
  "card": "BD01-08",
  "page_revision": 193693,
  "english_table": true,
  "rows": [],
  "main_images": [],
  "gallery": [],
  "gallery_error": "ValueError: missingtitle"
}
```

### BD01-09

[Card](https://digimoncardgame.fandom.com/wiki/BD01-09) | [Gallery](https://digimoncardgame.fandom.com/wiki/BD01-09/Gallery)

```json
{
  "card": "BD01-09",
  "page_revision": 193692,
  "english_table": true,
  "rows": [],
  "main_images": [],
  "gallery": [],
  "gallery_error": "ValueError: missingtitle"
}
```

### BD02-01

[Card](https://digimoncardgame.fandom.com/wiki/BD02-01) | [Gallery](https://digimoncardgame.fandom.com/wiki/BD02-01/Gallery)

```json
{
  "card": "BD02-01",
  "page_revision": 193619,
  "english_table": true,
  "rows": [],
  "main_images": [],
  "gallery": [],
  "gallery_error": "ValueError: missingtitle"
}
```

### BD02-05

[Card](https://digimoncardgame.fandom.com/wiki/BD02-05) | [Gallery](https://digimoncardgame.fandom.com/wiki/BD02-05/Gallery)

```json
{
  "card": "BD02-05",
  "page_revision": 193695,
  "english_table": true,
  "rows": [],
  "main_images": [],
  "gallery": [],
  "gallery_error": "ValueError: missingtitle"
}
```

### BD02-06

[Card](https://digimoncardgame.fandom.com/wiki/BD02-06) | [Gallery](https://digimoncardgame.fandom.com/wiki/BD02-06/Gallery)

```json
{
  "card": "BD02-06",
  "page_revision": 193683,
  "english_table": true,
  "rows": [],
  "main_images": [],
  "gallery": [],
  "gallery_error": "ValueError: missingtitle"
}
```

### BD02-07

[Card](https://digimoncardgame.fandom.com/wiki/BD02-07) | [Gallery](https://digimoncardgame.fandom.com/wiki/BD02-07/Gallery)

```json
{
  "card": "BD02-07",
  "page_revision": 193690,
  "english_table": true,
  "rows": [],
  "main_images": [],
  "gallery": [],
  "gallery_error": "ValueError: missingtitle"
}
```

### BD02-09

[Card](https://digimoncardgame.fandom.com/wiki/BD02-09) | [Gallery](https://digimoncardgame.fandom.com/wiki/BD02-09/Gallery)

```json
{
  "card": "BD02-09",
  "page_revision": 193660,
  "english_table": true,
  "rows": [],
  "main_images": [],
  "gallery": [],
  "gallery_error": "ValueError: missingtitle"
}
```

### BD02-10

[Card](https://digimoncardgame.fandom.com/wiki/BD02-10) | [Gallery](https://digimoncardgame.fandom.com/wiki/BD02-10/Gallery)

```json
{
  "card": "BD02-10",
  "page_revision": 193696,
  "english_table": true,
  "rows": [],
  "main_images": [],
  "gallery": [],
  "gallery_error": "ValueError: missingtitle"
}
```

### BD03-01

[Card](https://digimoncardgame.fandom.com/wiki/BD03-01) | [Gallery](https://digimoncardgame.fandom.com/wiki/BD03-01/Gallery)

```json
{
  "card": "BD03-01",
  "page_revision": 193549,
  "english_table": true,
  "rows": [],
  "main_images": [],
  "gallery": [],
  "gallery_error": "ValueError: missingtitle"
}
```

### BT1-084

[Card](https://digimoncardgame.fandom.com/wiki/BT1-084) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT1-084/Gallery)

```json
{
  "card": "BT1-084",
  "page_revision": 163310,
  "gallery_revision": 120057,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "Kenji Watanabe",
      "note": "BT01-03: Release Special Booster Ver.1.0",
      "type": "Gold Foil -\u00a0Alternative Art"
    },
    {
      "id": "_P2",
      "illustrator": "Tonamikanji",
      "note": "Evolution Cup 2021",
      "type": "Textured - Evolution Cup Stamp -\u00a0Top 2 Prize"
    },
    {
      "id": "_P3",
      "illustrator": "sasasi",
      "note": "BT-06: Booster Double Diamond",
      "type": "Textured -\u00a0Rare Pull"
    },
    {
      "id": "_P4",
      "illustrator": "Tonamikanji",
      "note": "Ultimate Cup 2022",
      "type": "Textured - Ultimate Cup Stamp -\u00a0Top 2 Prize"
    },
    {
      "id": "_P5",
      "illustrator": "Kenji Watanabe",
      "note": "PB-12E: Digimon Card Game 2nd Anniversary Set",
      "type": "Gold Foil - Gold Background -\u00a0Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "BT1-084",
      "scan": true,
      "note": "BT01-03: Release Special Booster Ver.1.0",
      "caption": "BT01-03: Release Special Booster Ver.1.0 (EN)"
    },
    {
      "id": "BT1-084_P1",
      "scan": true,
      "note": "BT01-03: Release Special Booster Ver.1.0",
      "caption": "BT01-03: Release Special Booster Ver.1.0 (Alternative Art) (EN)"
    },
    {
      "id": "BT1-084_P3",
      "scan": true,
      "note": "Evolution Cup 2021",
      "caption": "Evolution Cup 2021 (Top 2 Prize) (EN)"
    },
    {
      "id": "BT1-084_P2",
      "scan": true,
      "note": "BT-06: Booster Double Diamond",
      "caption": "BT-06: Booster Double Diamond (Rare Pull) (EN)"
    },
    {
      "id": "BT1-084_P4",
      "scan": true,
      "note": "Ultimate Cup 2022",
      "caption": "Ultimate Cup 2022 (Top 2 Prize) (EN)"
    },
    {
      "id": "BT1-084_P5",
      "scan": true,
      "note": "PB-12E: Digimon Card Game 2nd Anniversary Set",
      "caption": "PB-12E: Digimon Card Game 2nd Anniversary Set (EN)"
    }
  ],
  "main_images": [
    "BT1-084.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "BT1-084_P1",
        "row": 0
      },
      {
        "id": "BT1-084_P3",
        "row": 2
      },
      {
        "id": "BT1-084_P2",
        "row": 1
      },
      {
        "id": "BT1-084_P4",
        "row": 3
      },
      {
        "id": "BT1-084_P5",
        "row": 4
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "BT1-084_P1",
        "row": 0
      },
      {
        "id": "BT1-084_P3",
        "row": 1
      },
      {
        "id": "BT1-084_P2",
        "row": 2
      },
      {
        "id": "BT1-084_P4",
        "row": 3
      },
      {
        "id": "BT1-084_P5",
        "row": 4
      }
    ],
    "synthetic": []
  }
}
```

### BT17-059

[Card](https://digimoncardgame.fandom.com/wiki/BT17-059) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT17-059/Gallery)

```json
{
  "card": "BT17-059",
  "page_revision": 179899,
  "gallery_revision": 170802,
  "english_table": true,
  "rows": [
    {
      "id": "_P0",
      "illustrator": "sasasi",
      "note": "Pre-Release Pack Secret Crisis",
      "type": "Foil - Pre Release Stamp -\u00a0Rare"
    },
    {
      "id": "_P2",
      "illustrator": "koki",
      "note": "2025 Evolution Cup Season 2",
      "type": "Participation Stamp -\u00a0Top 4 Prize"
    }
  ],
  "gallery": [
    {
      "id": "BT17-059",
      "scan": true,
      "note": "BT-17: Booster Secret Crisis",
      "caption": "BT-17: Booster Secret Crisis (EN)"
    },
    {
      "id": "BT17-059",
      "scan": true,
      "note": "Pre-Release Pack Secret Crisis",
      "caption": "Pre-Release Pack Secret Crisis (EN)"
    },
    {
      "id": "BT17-059_P1",
      "scan": false,
      "note": "2025 Evolution Cup Season 2",
      "caption": "2025 Evolution Cup Season 2 (Top 4 Prize) (EN)"
    }
  ],
  "main_images": [
    "BT17-059.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "BT17-059_P1",
        "row": 1
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "BT17-059_P1",
        "row": 1
      }
    ],
    "synthetic": []
  }
}
```

### BT18-054

[Card](https://digimoncardgame.fandom.com/wiki/BT18-054) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT18-054/Gallery)

```json
{
  "card": "BT18-054",
  "page_revision": 179996,
  "gallery_revision": 159471,
  "english_table": true,
  "rows": [
    {
      "id": "_P0",
      "illustrator": "tyuga",
      "note": "Special Booster Ver.2.0 Celebration Event Pack",
      "type": "Foil - Pre Release Stamp -\u00a0Rare"
    },
    {
      "id": "_P2",
      "illustrator": "Ryodan",
      "note": "Tamer's Selection Box ver. Championship 2024",
      "type": "Foil -\u00a0Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "BT18-054",
      "scan": true,
      "note": "BT18-19: Special Booster Ver.2.0",
      "caption": "BT18-19: Special Booster Ver.2.0 (EN)"
    },
    {
      "id": "BT18-054_P0",
      "scan": false,
      "note": "Special Booster Ver.2.0 Celebration Event Pack",
      "caption": "Special Booster Ver.2.0 Celebration Event Pack (EN)"
    },
    {
      "id": "BT18-054_P1-Sample",
      "scan": false,
      "note": "Tamer's Selection Box ver. Championship 2024",
      "caption": "Tamer's Selection Box ver. Championship 2024 (EN)"
    },
    {
      "id": "BT18-054_P1",
      "scan": true,
      "note": "Tamer's Selection Box ver. Championship 2024",
      "caption": "Tamer's Selection Box ver. Championship 2024 (EN)"
    }
  ],
  "main_images": [
    "BT18-054.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "BT18-054_P0",
        "row": 0
      },
      {
        "id": "BT18-054_P1-Sample",
        "row": 1
      },
      {
        "id": "BT18-054_P1",
        "row": 1
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "BT18-054_P0",
        "row": 0
      },
      {
        "id": "BT18-054_P1-Sample",
        "row": 1
      },
      {
        "id": "BT18-054_P1",
        "row": 1
      }
    ],
    "synthetic": []
  }
}
```

### BT20-013

[Card](https://digimoncardgame.fandom.com/wiki/BT20-013) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT20-013/Gallery)

```json
{
  "card": "BT20-013",
  "page_revision": 190822,
  "gallery_revision": 187854,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "GOSSAN",
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "type": "Foil - Coloured Border -\u00a0Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "BT20-013",
      "scan": true,
      "note": "BT19-20: Special Booster Ver.2.5",
      "caption": "BT19-20: Special Booster Ver.2.5 (EN)"
    },
    {
      "id": "BT20-013-Sample",
      "scan": true,
      "note": "BT19-20: Special Booster Ver.2.5",
      "caption": "BT19-20: Special Booster Ver.2.5 (EN)"
    },
    {
      "id": "BT20-013_P1",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    }
  ],
  "main_images": [
    "BT20-013.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "BT20-013_P1",
        "row": 0
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "BT20-013_P1",
        "row": 0
      }
    ],
    "synthetic": []
  }
}
```

### BT20-063

[Card](https://digimoncardgame.fandom.com/wiki/BT20-063) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT20-063/Gallery)

```json
{
  "card": "BT20-063",
  "page_revision": 180203,
  "gallery_revision": 151056,
  "english_table": true,
  "rows": [
    {
      "id": "_P0",
      "illustrator": "Takeuchi Moto",
      "note": "Special Booster Ver.2.5 Celebration Event Pack",
      "type": "Foil - Pre Release Stamp -\u00a0Uncommon"
    },
    {
      "id": "_P2",
      "illustrator": "Takase",
      "note": "BT19-20: Special Booster Ver.2.5",
      "type": "Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "BT20-063",
      "scan": true,
      "note": "BT19-20: Special Booster Ver.2.5",
      "caption": "BT19-20: Special Booster Ver.2.5 (EN)"
    },
    {
      "id": "BT20-063-Sample",
      "scan": true,
      "note": "BT19-20: Special Booster Ver.2.5",
      "caption": "BT19-20: Special Booster Ver.2.5 (EN)"
    },
    {
      "id": "BT20-063_P0",
      "scan": false,
      "note": "Special Booster Ver.2.5 Celebration Event Pack",
      "caption": "Special Booster Ver.2.5 Celebration Event Pack (EN)"
    },
    {
      "id": "BT20-063_P1",
      "scan": true,
      "note": "BT19-20: Special Booster Ver.2.5",
      "caption": "BT19-20: Special Booster Ver.2.5 (EN)"
    },
    {
      "id": "BT20-063_P1-Sample",
      "scan": true,
      "note": "BT19-20: Special Booster Ver.2.5",
      "caption": "BT19-20: Special Booster Ver.2.5 (EN)"
    }
  ],
  "main_images": [
    "BT20-063.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "BT20-063_P0",
        "row": 0
      },
      {
        "id": "BT20-063_P1",
        "row": 1
      },
      {
        "id": "BT20-063_P1-Sample",
        "row": 1
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "BT20-063_P0",
        "row": 0
      },
      {
        "id": "BT20-063_P1",
        "row": 1
      },
      {
        "id": "BT20-063_P1-Sample",
        "row": 1
      }
    ],
    "synthetic": []
  }
}
```

### BT21-046

[Card](https://digimoncardgame.fandom.com/wiki/BT21-046) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT21-046/Gallery)

```json
{
  "card": "BT21-046",
  "page_revision": 190098,
  "gallery_revision": 187858,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "toriyufu",
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "type": "Foil - Coloured Border -\u00a0Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "BT21-046",
      "scan": true,
      "note": "BT-21: BOOSTER WORLD CONVERGENCE",
      "caption": "BT-21: BOOSTER WORLD CONVERGENCE (EN)"
    },
    {
      "id": "BT21-046-Sample",
      "scan": true,
      "note": "BT-21: BOOSTER WORLD CONVERGENCE",
      "caption": "BT-21: BOOSTER WORLD CONVERGENCE (EN)"
    },
    {
      "id": "BT21-046_P1",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    }
  ],
  "main_images": [
    "BT21-046.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "BT21-046_P1",
        "row": 0
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "BT21-046_P1",
        "row": 0
      }
    ],
    "synthetic": []
  }
}
```

### BT22-004

[Card](https://digimoncardgame.fandom.com/wiki/BT22-004) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT22-004/Gallery)

```json
{
  "card": "BT22-004",
  "page_revision": 185617,
  "gallery_revision": 185620,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "Takase",
      "note": "2026 Evolution Cup Season 2",
      "type": "Participation Stamp -\u00a0Participation"
    }
  ],
  "gallery": [
    {
      "id": "BT22-004",
      "scan": true,
      "note": "BT-22: BOOSTER CYBER EDEN",
      "caption": "BT-22: BOOSTER CYBER EDEN (EN)"
    },
    {
      "id": "BT22-004_P1",
      "scan": false,
      "note": "2026 Evolution Cup Season 2",
      "caption": "2026 Evolution Cup Season 2 (Champion Prize) (EN)"
    }
  ],
  "main_images": [
    "BT22-004.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "BT22-004_P1",
        "row": 0
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "BT22-004_P1",
        "row": 0
      }
    ],
    "synthetic": []
  }
}
```

### BT22-005

[Card](https://digimoncardgame.fandom.com/wiki/BT22-005) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT22-005/Gallery)

```json
{
  "card": "BT22-005",
  "page_revision": 185971,
  "gallery_revision": 185979,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "koki",
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "type": "Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "BT22-005",
      "scan": true,
      "note": "BT-22: BOOSTER CYBER EDEN",
      "caption": "BT-22: BOOSTER CYBER EDEN (EN)"
    },
    {
      "id": "BT22-005-Sample",
      "scan": true,
      "note": "BT-22: BOOSTER CYBER EDEN",
      "caption": "BT-22: BOOSTER CYBER EDEN (EN)"
    },
    {
      "id": "BT22-005_P1",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    }
  ],
  "main_images": [
    "BT22-005.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "BT22-005_P1",
        "row": 0
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "BT22-005_P1",
        "row": 0
      }
    ],
    "synthetic": []
  }
}
```

### BT22-063

[Card](https://digimoncardgame.fandom.com/wiki/BT22-063) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT22-063/Gallery)

```json
{
  "card": "BT22-063",
  "page_revision": 190079,
  "gallery_revision": 185622,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "Tonamikanji",
      "note": "BT-22: BOOSTER CYBER EDEN",
      "type": "Alternative Art"
    },
    {
      "id": "_P2",
      "illustrator": "Nakano Haito",
      "note": "2026 Evolution Cup Season 2",
      "type": "Participation Stamp -\u00a01st Place Prize"
    }
  ],
  "gallery": [
    {
      "id": "BT22-063",
      "scan": true,
      "note": "BT-22: BOOSTER CYBER EDEN",
      "caption": "BT-22: BOOSTER CYBER EDEN (EN)"
    },
    {
      "id": "BT22-063-Sample",
      "scan": true,
      "note": "BT-22: BOOSTER CYBER EDEN",
      "caption": "BT-22: BOOSTER CYBER EDEN (EN)"
    },
    {
      "id": "BT22-063_P1",
      "scan": true,
      "note": "BT-22: BOOSTER CYBER EDEN",
      "caption": "BT-22: BOOSTER CYBER EDEN (EN)"
    },
    {
      "id": "BT22-063_P2",
      "scan": false,
      "note": "2026 Evolution Cup Season 2",
      "caption": "2026 Evolution Cup Season 2 (Champion Prize) (EN)"
    }
  ],
  "main_images": [
    "BT22-063.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "BT22-063_P1",
        "row": 0
      },
      {
        "id": "BT22-063_P2",
        "row": 1
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "BT22-063_P1",
        "row": 0
      },
      {
        "id": "BT22-063_P2",
        "row": 1
      }
    ],
    "synthetic": []
  }
}
```

### BT22-099

[Card](https://digimoncardgame.fandom.com/wiki/BT22-099) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT22-099/Gallery)

```json
{
  "card": "BT22-099",
  "page_revision": 185618,
  "gallery_revision": 185621,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "Tonamikanji",
      "note": "2026 Evolution Cup Season 2",
      "type": "Participation Stamp -\u00a0Top 4 Prize"
    }
  ],
  "gallery": [
    {
      "id": "BT22-099",
      "scan": true,
      "note": "BT-22: BOOSTER CYBER EDEN",
      "caption": "BT-22: BOOSTER CYBER EDEN (EN)"
    },
    {
      "id": "BT22-099_P1",
      "scan": false,
      "note": "2026 Evolution Cup Season 2",
      "caption": "2026 Evolution Cup Season 2 (Champion Prize) (EN)"
    }
  ],
  "main_images": [
    "BT22-099.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "BT22-099_P1",
        "row": 0
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "BT22-099_P1",
        "row": 0
      }
    ],
    "synthetic": []
  }
}
```

### BT23-013

[Card](https://digimoncardgame.fandom.com/wiki/BT23-013) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT23-013/Gallery)

```json
{
  "card": "BT23-013",
  "page_revision": 190835,
  "gallery_revision": 185978,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "Spareribs",
      "note": "BT-23: BOOSTER HACKERS' SLUMBER",
      "type": "Alternative Art"
    },
    {
      "id": "_P2",
      "illustrator": "Moyasi",
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "type": "Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "BT23-013",
      "scan": true,
      "note": "BT-23: BOOSTER HACKERS' SLUMBER",
      "caption": "BT-23: BOOSTER HACKERS' SLUMBER (EN)"
    },
    {
      "id": "BT23-013-Sample",
      "scan": true,
      "note": "BT-23: BOOSTER HACKERS' SLUMBER",
      "caption": "BT-23: BOOSTER HACKERS' SLUMBER (EN)"
    },
    {
      "id": "BT23-013_P1",
      "scan": true,
      "note": "BT-23: BOOSTER HACKERS' SLUMBER",
      "caption": "BT-23: BOOSTER HACKERS' SLUMBER (EN)"
    },
    {
      "id": "BT23-013_P1-Sample",
      "scan": true,
      "note": "BT-23: BOOSTER HACKERS' SLUMBER",
      "caption": "BT-23: BOOSTER HACKERS' SLUMBER (EN)"
    },
    {
      "id": "BT23-013_P2",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    }
  ],
  "main_images": [
    "BT23-013.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "BT23-013_P1",
        "row": 0
      },
      {
        "id": "BT23-013_P1-Sample",
        "row": 0
      },
      {
        "id": "BT23-013_P2",
        "row": 1
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "BT23-013_P1",
        "row": 0
      },
      {
        "id": "BT23-013_P1-Sample",
        "row": 0
      },
      {
        "id": "BT23-013_P2",
        "row": 1
      }
    ],
    "synthetic": []
  }
}
```

### BT23-092

[Card](https://digimoncardgame.fandom.com/wiki/BT23-092) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT23-092/Gallery)

```json
{
  "card": "BT23-092",
  "page_revision": 187847,
  "gallery_revision": 187861,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "poroze",
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "type": "Foil - Coloured Border -\u00a0Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "BT23-092",
      "scan": true,
      "note": "BT-23: BOOSTER HACKERS' SLUMBER",
      "caption": "BT-23: BOOSTER HACKERS' SLUMBER (EN)"
    },
    {
      "id": "BT23-092-Sample",
      "scan": true,
      "note": "BT-23: BOOSTER HACKERS' SLUMBER",
      "caption": "BT-23: BOOSTER HACKERS' SLUMBER (EN)"
    },
    {
      "id": "BT23-092_P1",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    }
  ],
  "main_images": [
    "BT23-092.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "BT23-092_P1",
        "row": 0
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "BT23-092_P1",
        "row": 0
      }
    ],
    "synthetic": []
  }
}
```

### BT23-099

[Card](https://digimoncardgame.fandom.com/wiki/BT23-099) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT23-099/Gallery)

```json
{
  "card": "BT23-099",
  "page_revision": 190847,
  "gallery_revision": 187855,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "Tsunemi Aosa",
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "type": "Foil - Coloured Border -\u00a0Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "BT23-099",
      "scan": true,
      "note": "BT-23: BOOSTER HACKERS' SLUMBER",
      "caption": "BT-23: BOOSTER HACKERS' SLUMBER (EN)"
    },
    {
      "id": "BT23-099-Sample",
      "scan": true,
      "note": "BT-23: BOOSTER HACKERS' SLUMBER",
      "caption": "BT-23: BOOSTER HACKERS' SLUMBER (EN)"
    },
    {
      "id": "BT23-099_P1",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    }
  ],
  "main_images": [
    "BT23-099.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "BT23-099_P1",
        "row": 0
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "BT23-099_P1",
        "row": 0
      }
    ],
    "synthetic": []
  }
}
```

### BT24-018

[Card](https://digimoncardgame.fandom.com/wiki/BT24-018) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT24-018/Gallery)

```json
{
  "card": "BT24-018",
  "page_revision": 187848,
  "gallery_revision": 187862,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "Spareribs",
      "note": "BT-24: BOOSTER TIME STRANGER",
      "type": "Alternative Art"
    },
    {
      "id": "_P2",
      "illustrator": "Spareribs",
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "type": "Foil - Coloured Border -\u00a0Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "BT24-018",
      "scan": true,
      "note": "BT-24: BOOSTER TIME STRANGER",
      "caption": "BT-24: BOOSTER TIME STRANGER (EN)"
    },
    {
      "id": "BT24-018-Sample",
      "scan": true,
      "note": "BT-24: BOOSTER TIME STRANGER",
      "caption": "BT-24: BOOSTER TIME STRANGER (EN)"
    },
    {
      "id": "BT24-018_P1",
      "scan": true,
      "note": "BT-24: BOOSTER TIME STRANGER",
      "caption": "BT-24: BOOSTER TIME STRANGER (EN)"
    },
    {
      "id": "BT24-018_P1-Sample",
      "scan": true,
      "note": "BT-24: BOOSTER TIME STRANGER",
      "caption": "BT-24: BOOSTER TIME STRANGER (EN)"
    },
    {
      "id": "BT24-018_P2",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    }
  ],
  "main_images": [
    "BT24-018.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "BT24-018_P1",
        "row": 0
      },
      {
        "id": "BT24-018_P1-Sample",
        "row": 0
      },
      {
        "id": "BT24-018_P2",
        "row": 1
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "BT24-018_P1",
        "row": 0
      },
      {
        "id": "BT24-018_P1-Sample",
        "row": 0
      },
      {
        "id": "BT24-018_P2",
        "row": 1
      }
    ],
    "synthetic": []
  }
}
```

### BT24-085

[Card](https://digimoncardgame.fandom.com/wiki/BT24-085) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT24-085/Gallery)

```json
{
  "card": "BT24-085",
  "page_revision": 187849,
  "gallery_revision": 187852,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "Tonamikanji",
      "note": "BT-24: BOOSTER TIME STRANGER",
      "type": "Alternative Art"
    },
    {
      "id": "_P2",
      "illustrator": "Tonamikanji",
      "note": "BT-24: BOOSTER TIME STRANGER",
      "type": "Special Rare"
    },
    {
      "id": "_P3",
      "illustrator": "Tonamikanji",
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "type": "Foil - Coloured Border -\u00a0Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "BT24-085",
      "scan": true,
      "note": "BT-24: BOOSTER TIME STRANGER",
      "caption": "BT-24: BOOSTER TIME STRANGER (EN)"
    },
    {
      "id": "BT24-085-Sample",
      "scan": true,
      "note": "BT-24: BOOSTER TIME STRANGER",
      "caption": "BT-24: BOOSTER TIME STRANGER (EN)"
    },
    {
      "id": "BT24-085_P1",
      "scan": true,
      "note": "BT-24: BOOSTER TIME STRANGER",
      "caption": "BT-24: BOOSTER TIME STRANGER (EN)"
    },
    {
      "id": "BT24-085_P1-Sample",
      "scan": true,
      "note": "BT-24: BOOSTER TIME STRANGER",
      "caption": "BT-24: BOOSTER TIME STRANGER (EN)"
    },
    {
      "id": "BT24-085_P2",
      "scan": true,
      "note": "BT-24: BOOSTER TIME STRANGER",
      "caption": "BT-24: BOOSTER TIME STRANGER (EN)"
    },
    {
      "id": "BT24-085_P3",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    }
  ],
  "main_images": [
    "BT24-085.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "BT24-085_P1",
        "row": 0
      },
      {
        "id": "BT24-085_P1-Sample",
        "row": 0
      },
      {
        "id": "BT24-085_P2",
        "row": 1
      },
      {
        "id": "BT24-085_P3",
        "row": 2
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "BT24-085_P1",
        "row": 0
      },
      {
        "id": "BT24-085_P1-Sample",
        "row": 0
      },
      {
        "id": "BT24-085_P2",
        "row": 1
      },
      {
        "id": "BT24-085_P3",
        "row": 2
      }
    ],
    "synthetic": []
  }
}
```

### BT27-001

[Card](https://digimoncardgame.fandom.com/wiki/BT27-001) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-001/Gallery)

```json
{
  "card": "BT27-001",
  "page_revision": 193189,
  "gallery_revision": 188408,
  "english_table": true,
  "rows": [],
  "gallery": [
    {
      "id": "BT27-001",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-001-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [],
  "before": {
    "mapped": [],
    "synthetic": []
  },
  "after": {
    "mapped": [],
    "synthetic": []
  }
}
```

### BT27-005

[Card](https://digimoncardgame.fandom.com/wiki/BT27-005) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-005/Gallery)

```json
{
  "card": "BT27-005",
  "page_revision": 193372,
  "gallery_revision": 192315,
  "english_table": true,
  "rows": [],
  "gallery": [
    {
      "id": "BT27-005",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-005-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [],
  "before": {
    "mapped": [],
    "synthetic": []
  },
  "after": {
    "mapped": [],
    "synthetic": []
  }
}
```

### BT27-006

[Card](https://digimoncardgame.fandom.com/wiki/BT27-006) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-006/Gallery)

```json
{
  "card": "BT27-006",
  "page_revision": 191995,
  "gallery_revision": 192316,
  "english_table": true,
  "rows": [],
  "gallery": [
    {
      "id": "BT27-006",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-006-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [],
  "before": {
    "mapped": [],
    "synthetic": []
  },
  "after": {
    "mapped": [],
    "synthetic": []
  }
}
```

### BT27-011

[Card](https://digimoncardgame.fandom.com/wiki/BT27-011) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-011/Gallery)

```json
{
  "card": "BT27-011",
  "page_revision": 193412,
  "gallery_revision": 192321,
  "english_table": true,
  "rows": [],
  "gallery": [
    {
      "id": "BT27-011",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-011-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [],
  "before": {
    "mapped": [],
    "synthetic": []
  },
  "after": {
    "mapped": [],
    "synthetic": []
  }
}
```

### BT27-014

[Card](https://digimoncardgame.fandom.com/wiki/BT27-014) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-014/Gallery)

```json
{
  "card": "BT27-014",
  "page_revision": 192003,
  "gallery_revision": 192324,
  "english_table": true,
  "rows": [],
  "gallery": [
    {
      "id": "BT27-014",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-014-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [],
  "before": {
    "mapped": [],
    "synthetic": []
  },
  "after": {
    "mapped": [],
    "synthetic": []
  }
}
```

### BT27-016

[Card](https://digimoncardgame.fandom.com/wiki/BT27-016) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-016/Gallery)

```json
{
  "card": "BT27-016",
  "page_revision": 193413,
  "gallery_revision": 192326,
  "english_table": true,
  "rows": [],
  "gallery": [
    {
      "id": "BT27-016",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-016-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [],
  "before": {
    "mapped": [],
    "synthetic": []
  },
  "after": {
    "mapped": [],
    "synthetic": []
  }
}
```

### BT27-018

[Card](https://digimoncardgame.fandom.com/wiki/BT27-018) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-018/Gallery)

```json
{
  "card": "BT27-018",
  "page_revision": 192007,
  "gallery_revision": 192328,
  "english_table": true,
  "rows": [],
  "gallery": [
    {
      "id": "BT27-018",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-018-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [],
  "before": {
    "mapped": [],
    "synthetic": []
  },
  "after": {
    "mapped": [],
    "synthetic": []
  }
}
```

### BT27-019

[Card](https://digimoncardgame.fandom.com/wiki/BT27-019) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-019/Gallery)

```json
{
  "card": "BT27-019",
  "page_revision": 192008,
  "gallery_revision": 192329,
  "english_table": true,
  "rows": [],
  "gallery": [
    {
      "id": "BT27-019",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-019-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [],
  "before": {
    "mapped": [],
    "synthetic": []
  },
  "after": {
    "mapped": [],
    "synthetic": []
  }
}
```

### BT27-022

[Card](https://digimoncardgame.fandom.com/wiki/BT27-022) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-022/Gallery)

```json
{
  "card": "BT27-022",
  "page_revision": 193196,
  "gallery_revision": 192332,
  "english_table": true,
  "rows": [],
  "gallery": [
    {
      "id": "BT27-022",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-022-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [],
  "before": {
    "mapped": [],
    "synthetic": []
  },
  "after": {
    "mapped": [],
    "synthetic": []
  }
}
```

### BT27-024

[Card](https://digimoncardgame.fandom.com/wiki/BT27-024) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-024/Gallery)

```json
{
  "card": "BT27-024",
  "page_revision": 193277,
  "gallery_revision": 192334,
  "english_table": true,
  "rows": [],
  "gallery": [
    {
      "id": "BT27-024",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-024-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [],
  "before": {
    "mapped": [],
    "synthetic": []
  },
  "after": {
    "mapped": [],
    "synthetic": []
  }
}
```

### BT27-027

[Card](https://digimoncardgame.fandom.com/wiki/BT27-027) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-027/Gallery)

```json
{
  "card": "BT27-027",
  "page_revision": 193200,
  "gallery_revision": 192337,
  "english_table": true,
  "rows": [],
  "gallery": [
    {
      "id": "BT27-027",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-027-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [],
  "before": {
    "mapped": [],
    "synthetic": []
  },
  "after": {
    "mapped": [],
    "synthetic": []
  }
}
```

### BT27-029

[Card](https://digimoncardgame.fandom.com/wiki/BT27-029) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-029/Gallery)

```json
{
  "card": "BT27-029",
  "page_revision": 193201,
  "gallery_revision": 192339,
  "english_table": true,
  "rows": [],
  "gallery": [
    {
      "id": "BT27-029",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-029-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [],
  "before": {
    "mapped": [],
    "synthetic": []
  },
  "after": {
    "mapped": [],
    "synthetic": []
  }
}
```

### BT27-030

[Card](https://digimoncardgame.fandom.com/wiki/BT27-030) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-030/Gallery)

```json
{
  "card": "BT27-030",
  "page_revision": 193202,
  "gallery_revision": 192340,
  "english_table": true,
  "rows": [],
  "gallery": [
    {
      "id": "BT27-030",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-030-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [],
  "before": {
    "mapped": [],
    "synthetic": []
  },
  "after": {
    "mapped": [],
    "synthetic": []
  }
}
```

### BT27-032

[Card](https://digimoncardgame.fandom.com/wiki/BT27-032) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-032/Gallery)

```json
{
  "card": "BT27-032",
  "page_revision": 193368,
  "gallery_revision": 193366,
  "english_table": true,
  "rows": [],
  "gallery": [
    {
      "id": "BT27-032",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-032-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [],
  "before": {
    "mapped": [],
    "synthetic": []
  },
  "after": {
    "mapped": [],
    "synthetic": []
  }
}
```

### BT27-033

[Card](https://digimoncardgame.fandom.com/wiki/BT27-033) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-033/Gallery)

```json
{
  "card": "BT27-033",
  "page_revision": 193204,
  "gallery_revision": 192343,
  "english_table": true,
  "rows": [],
  "gallery": [
    {
      "id": "BT27-033",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-033-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [],
  "before": {
    "mapped": [],
    "synthetic": []
  },
  "after": {
    "mapped": [],
    "synthetic": []
  }
}
```

### BT27-035

[Card](https://digimoncardgame.fandom.com/wiki/BT27-035) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-035/Gallery)

```json
{
  "card": "BT27-035",
  "page_revision": 192826,
  "gallery_revision": 193055,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "toriyufu",
      "note": "BT-27: BOOSTER IGNITION OF X",
      "type": "Alternative Art"
    },
    {
      "id": "_P2",
      "illustrator": "To be completed",
      "note": "BT-27: BOOSTER IGNITION OF X",
      "type": "Special Rare"
    }
  ],
  "gallery": [
    {
      "id": "BT27-035",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-035-Sample",
      "scan": true,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-035_P1",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-035_P1-Sample",
      "scan": true,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-035_P2",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-035_P2-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [
    "BT27-035-Sample.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "BT27-035_P1",
        "row": 0
      },
      {
        "id": "BT27-035_P1-Sample",
        "row": 0
      },
      {
        "id": "BT27-035_P2",
        "row": 1
      },
      {
        "id": "BT27-035_P2-Sample",
        "row": 1
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "BT27-035_P1",
        "row": 0
      },
      {
        "id": "BT27-035_P1-Sample",
        "row": 0
      },
      {
        "id": "BT27-035_P2",
        "row": 1
      },
      {
        "id": "BT27-035_P2-Sample",
        "row": 1
      }
    ],
    "synthetic": []
  }
}
```

### BT27-037

[Card](https://digimoncardgame.fandom.com/wiki/BT27-037) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-037/Gallery)

```json
{
  "card": "BT27-037",
  "page_revision": 193747,
  "gallery_revision": 192347,
  "english_table": true,
  "rows": [],
  "gallery": [
    {
      "id": "BT27-037",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-037-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [],
  "before": {
    "mapped": [],
    "synthetic": []
  },
  "after": {
    "mapped": [],
    "synthetic": []
  }
}
```

### BT27-052

[Card](https://digimoncardgame.fandom.com/wiki/BT27-052) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-052/Gallery)

```json
{
  "card": "BT27-052",
  "page_revision": 193249,
  "gallery_revision": 193243,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "Tonamikanji",
      "note": "BT-27: BOOSTER IGNITION OF X",
      "type": "Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "BT27-052",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-052-Sample",
      "scan": true,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-052_P1",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-052_P1-Sample",
      "scan": true,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-052_P2",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-052_P2-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [
    "BT27-052-Sample.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "BT27-052_P1",
        "row": 0
      },
      {
        "id": "BT27-052_P1-Sample",
        "row": 0
      },
      {
        "id": "BT27-052_P2",
        "row": 0
      },
      {
        "id": "BT27-052_P2-Sample",
        "row": 0
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "BT27-052_P1",
        "row": 0
      },
      {
        "id": "BT27-052_P1-Sample",
        "row": 0
      },
      {
        "id": "BT27-052_P2",
        "row": null
      },
      {
        "id": "BT27-052_P2-Sample",
        "row": null
      }
    ],
    "synthetic": []
  }
}
```

### BT27-054

[Card](https://digimoncardgame.fandom.com/wiki/BT27-054) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-054/Gallery)

```json
{
  "card": "BT27-054",
  "page_revision": 193748,
  "gallery_revision": 192364,
  "english_table": true,
  "rows": [],
  "gallery": [
    {
      "id": "BT27-054",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-054-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [],
  "before": {
    "mapped": [],
    "synthetic": []
  },
  "after": {
    "mapped": [],
    "synthetic": []
  }
}
```

### BT27-059

[Card](https://digimoncardgame.fandom.com/wiki/BT27-059) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-059/Gallery)

```json
{
  "card": "BT27-059",
  "page_revision": 193371,
  "gallery_revision": 192369,
  "english_table": true,
  "rows": [],
  "gallery": [
    {
      "id": "BT27-059",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-059-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [],
  "before": {
    "mapped": [],
    "synthetic": []
  },
  "after": {
    "mapped": [],
    "synthetic": []
  }
}
```

### BT27-062

[Card](https://digimoncardgame.fandom.com/wiki/BT27-062) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-062/Gallery)

```json
{
  "card": "BT27-062",
  "page_revision": 193746,
  "gallery_revision": 193742,
  "english_table": true,
  "rows": [],
  "gallery": [
    {
      "id": "BT27-062",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-062-Sample",
      "scan": true,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [
    "BT27-062-Sample.png"
  ],
  "before": {
    "mapped": [],
    "synthetic": []
  },
  "after": {
    "mapped": [],
    "synthetic": []
  }
}
```

### BT27-063

[Card](https://digimoncardgame.fandom.com/wiki/BT27-063) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-063/Gallery)

```json
{
  "card": "BT27-063",
  "page_revision": 192052,
  "gallery_revision": 192373,
  "english_table": true,
  "rows": [],
  "gallery": [
    {
      "id": "BT27-063",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-063-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [],
  "before": {
    "mapped": [],
    "synthetic": []
  },
  "after": {
    "mapped": [],
    "synthetic": []
  }
}
```

### BT27-068

[Card](https://digimoncardgame.fandom.com/wiki/BT27-068) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-068/Gallery)

```json
{
  "card": "BT27-068",
  "page_revision": 193749,
  "gallery_revision": 192378,
  "english_table": true,
  "rows": [],
  "gallery": [
    {
      "id": "BT27-068",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-068-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [],
  "before": {
    "mapped": [],
    "synthetic": []
  },
  "after": {
    "mapped": [],
    "synthetic": []
  }
}
```

### BT27-085

[Card](https://digimoncardgame.fandom.com/wiki/BT27-085) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-085/Gallery)

```json
{
  "card": "BT27-085",
  "page_revision": 193134,
  "gallery_revision": 193239,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "k.Dra",
      "note": "BT-27: BOOSTER IGNITION OF X",
      "type": "Alternative Art"
    },
    {
      "id": "_P2",
      "illustrator": "To be completed",
      "note": "BT-27: BOOSTER IGNITION OF X",
      "type": "Special Rare"
    }
  ],
  "gallery": [
    {
      "id": "BT27-085",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-085-Sample",
      "scan": true,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-085_P1",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-085_P1-Sample",
      "scan": true,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-085_P2",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-085_P2-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [
    "BT27-085-Sample.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "BT27-085_P1",
        "row": 0
      },
      {
        "id": "BT27-085_P1-Sample",
        "row": 0
      },
      {
        "id": "BT27-085_P2",
        "row": 1
      },
      {
        "id": "BT27-085_P2-Sample",
        "row": 1
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "BT27-085_P1",
        "row": 0
      },
      {
        "id": "BT27-085_P1-Sample",
        "row": 0
      },
      {
        "id": "BT27-085_P2",
        "row": 1
      },
      {
        "id": "BT27-085_P2-Sample",
        "row": 1
      }
    ],
    "synthetic": []
  }
}
```

### BT27-086

[Card](https://digimoncardgame.fandom.com/wiki/BT27-086) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-086/Gallery)

```json
{
  "card": "BT27-086",
  "page_revision": 193440,
  "gallery_revision": 192396,
  "english_table": true,
  "rows": [],
  "gallery": [
    {
      "id": "BT27-086",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-086-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [],
  "before": {
    "mapped": [],
    "synthetic": []
  },
  "after": {
    "mapped": [],
    "synthetic": []
  }
}
```

### BT27-088

[Card](https://digimoncardgame.fandom.com/wiki/BT27-088) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-088/Gallery)

```json
{
  "card": "BT27-088",
  "page_revision": 193414,
  "gallery_revision": 192398,
  "english_table": true,
  "rows": [],
  "gallery": [
    {
      "id": "BT27-088",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-088-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [],
  "before": {
    "mapped": [],
    "synthetic": []
  },
  "after": {
    "mapped": [],
    "synthetic": []
  }
}
```

### BT27-089

[Card](https://digimoncardgame.fandom.com/wiki/BT27-089) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-089/Gallery)

```json
{
  "card": "BT27-089",
  "page_revision": 193238,
  "gallery_revision": 192399,
  "english_table": true,
  "rows": [],
  "gallery": [
    {
      "id": "BT27-089",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-089-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [],
  "before": {
    "mapped": [],
    "synthetic": []
  },
  "after": {
    "mapped": [],
    "synthetic": []
  }
}
```

### BT27-103

[Card](https://digimoncardgame.fandom.com/wiki/BT27-103) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-103/Gallery)

```json
{
  "card": "BT27-103",
  "page_revision": 193498,
  "gallery_revision": 192778,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "k.Dra",
      "note": "BT-27: BOOSTER IGNITION OF X",
      "type": "Alternative Art"
    },
    {
      "id": "_P2",
      "illustrator": "To be completed",
      "note": "BT-27: BOOSTER IGNITION OF X",
      "type": "Rare Pull"
    }
  ],
  "gallery": [
    {
      "id": "BT27-103",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-103-Sample",
      "scan": true,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-103_P1",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-103_P1-Sample",
      "scan": true,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-103_P2",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-103_P2-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [
    "BT27-103-Sample.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "BT27-103_P1",
        "row": 0
      },
      {
        "id": "BT27-103_P1-Sample",
        "row": 0
      },
      {
        "id": "BT27-103_P2",
        "row": 1
      },
      {
        "id": "BT27-103_P2-Sample",
        "row": 1
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "BT27-103_P1",
        "row": 0
      },
      {
        "id": "BT27-103_P1-Sample",
        "row": 0
      },
      {
        "id": "BT27-103_P2",
        "row": 1
      },
      {
        "id": "BT27-103_P2-Sample",
        "row": 1
      }
    ],
    "synthetic": []
  }
}
```

### BT27-104

[Card](https://digimoncardgame.fandom.com/wiki/BT27-104) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT27-104/Gallery)

```json
{
  "card": "BT27-104",
  "page_revision": 193756,
  "gallery_revision": 193752,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "Tonamikanji",
      "note": "BT-27: BOOSTER IGNITION OF X",
      "type": "Alternative Art"
    },
    {
      "id": "_P2",
      "illustrator": "Tonamikanji",
      "note": "BT-27: BOOSTER IGNITION OF X",
      "type": "Gold Foil -\u00a0Rare Pull"
    }
  ],
  "gallery": [
    {
      "id": "BT27-104",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-104-Sample",
      "scan": true,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-104_P1",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-104_P1-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-104_P2",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    },
    {
      "id": "BT27-104_P2-Sample",
      "scan": false,
      "note": "BT-27: BOOSTER IGNITION OF X",
      "caption": "BT-27: BOOSTER IGNITION OF X (EN)"
    }
  ],
  "main_images": [
    "BT27-104-Sample.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "BT27-104_P1",
        "row": 0
      },
      {
        "id": "BT27-104_P1-Sample",
        "row": 0
      },
      {
        "id": "BT27-104_P2",
        "row": 1
      },
      {
        "id": "BT27-104_P2-Sample",
        "row": 1
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "BT27-104_P1",
        "row": 0
      },
      {
        "id": "BT27-104_P1-Sample",
        "row": 0
      },
      {
        "id": "BT27-104_P2",
        "row": 1
      },
      {
        "id": "BT27-104_P2-Sample",
        "row": 1
      }
    ],
    "synthetic": []
  }
}
```

### BT4-104

[Card](https://digimoncardgame.fandom.com/wiki/BT4-104) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT4-104/Gallery)

```json
{
  "card": "BT4-104",
  "page_revision": 185606,
  "gallery_revision": 184973,
  "english_table": true,
  "rows": [
    {
      "id": "_P0",
      "illustrator": "p!k@ru",
      "note": "Great Legend Pre-Release Pack",
      "type": "Gold Outline - Pre Release Stamp -\u00a0Rare"
    },
    {
      "id": "_P2",
      "illustrator": "p!k@ru",
      "note": "RB-01: Resurgence Booster",
      "type": "Foil -\u00a0Rare"
    },
    {
      "id": "_P3",
      "illustrator": "koki",
      "note": "ST-17: Advanced Deck Set Double Typhoon",
      "type": "Foil -\u00a0Alternative Art"
    },
    {
      "id": "_P0",
      "illustrator": "koki",
      "note": "Double Typhoon Pre-Release Pack",
      "type": "Foil - Pre Release Stamp -\u00a0Alternative Art"
    },
    {
      "id": "_P5",
      "illustrator": "Spareribs",
      "note": "BT-25: BOOSTER DUAL REVOLUTION",
      "type": "Rare Pull"
    }
  ],
  "gallery": [
    {
      "id": "BT4-104",
      "scan": true,
      "note": "BT-04: Booster Great Legend",
      "caption": "BT-04: Booster Great Legend (EN)"
    },
    {
      "id": "BT4-104_P0",
      "scan": true,
      "note": "Great Legend Pre-Release Pack",
      "caption": "Great Legend Pre-Release Pack (EN)"
    },
    {
      "id": "BT4-104_P1",
      "scan": true,
      "note": "RB-01: Resurgence Booster",
      "caption": "RB-01: Resurgence Booster (EN)"
    },
    {
      "id": "BT4-104_P2",
      "scan": true,
      "note": "ST-17: Advanced Deck Set Double Typhoon",
      "caption": "ST-17: Advanced Deck Set Double Typhoon (EN)"
    },
    {
      "id": "BT4-104_P02",
      "scan": true,
      "note": "Double Typhoon Pre-Release Pack",
      "caption": "Double Typhoon Pre-Release Pack (EN)"
    },
    {
      "id": "BT4-104_P3",
      "scan": true,
      "note": "BT-25: BOOSTER DUAL REVOLUTION",
      "caption": "BT-25: BOOSTER DUAL REVOLUTION (EN)"
    }
  ],
  "main_images": [
    "BT4-104_P1.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "BT4-104_P0",
        "row": 0
      },
      {
        "id": "BT4-104_P1",
        "row": 1
      },
      {
        "id": "BT4-104_P2",
        "row": 1
      },
      {
        "id": "BT4-104_P02",
        "row": 3
      },
      {
        "id": "BT4-104_P3",
        "row": 2
      }
    ],
    "synthetic": [
      {
        "id": "BT4-104_P5",
        "illustrator": "Spareribs",
        "note": "BT-25: BOOSTER DUAL REVOLUTION",
        "type": "Rare Pull"
      }
    ]
  },
  "after": {
    "mapped": [
      {
        "id": "BT4-104_P0",
        "row": 0
      },
      {
        "id": "BT4-104_P1",
        "row": 1
      },
      {
        "id": "BT4-104_P2",
        "row": 2
      },
      {
        "id": "BT4-104_P02",
        "row": 3
      },
      {
        "id": "BT4-104_P3",
        "row": 4
      }
    ],
    "synthetic": []
  }
}
```

### BT5-090

[Card](https://digimoncardgame.fandom.com/wiki/BT5-090) | [Gallery](https://digimoncardgame.fandom.com/wiki/BT5-090/Gallery)

```json
{
  "card": "BT5-090",
  "page_revision": 170798,
  "gallery_revision": 170804,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "No Illustrator",
      "note": "BT-05: Booster Battle Of Omni",
      "type": "Foil - Full Art -\u00a0Box Topper"
    },
    {
      "id": "_P0",
      "illustrator": "No Illustrator",
      "note": "Battle of Omni Pre-Release Pack",
      "type": "Gold Outline - Pre Release Stamp -\u00a0Rare"
    },
    {
      "id": "_P3",
      "illustrator": "No Illustrator",
      "note": "2025 Evolution Cup Season 2",
      "type": "Participation Stamp -\u00a01st Place Prize"
    }
  ],
  "gallery": [
    {
      "id": "BT5-090",
      "scan": true,
      "note": "BT-05: Booster Battle Of Omni",
      "caption": "BT-05: Booster Battle Of Omni (EN)"
    },
    {
      "id": "BT5-090_P1",
      "scan": true,
      "note": "BT-05: Booster Battle Of Omni",
      "caption": "BT-05: Booster Battle Of Omni (Box Topper) (EN)"
    },
    {
      "id": "BT5-090_P0",
      "scan": true,
      "note": "Battle of Omni Pre-Release Pack",
      "caption": "Battle of Omni Pre-Release Pack (EN)"
    },
    {
      "id": "BT5-090_P2",
      "scan": false,
      "note": "2025 Evolution Cup Season 2",
      "caption": "2025 Evolution Cup Season 2 (Winner Prize) (EN)"
    }
  ],
  "main_images": [
    "BT5-090.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "BT5-090_P1",
        "row": 0
      },
      {
        "id": "BT5-090_P0",
        "row": 1
      },
      {
        "id": "BT5-090_P2",
        "row": 2
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "BT5-090_P1",
        "row": 0
      },
      {
        "id": "BT5-090_P0",
        "row": 1
      },
      {
        "id": "BT5-090_P2",
        "row": 2
      }
    ],
    "synthetic": []
  }
}
```

### ED01-01

[Card](https://digimoncardgame.fandom.com/wiki/ED01-01) | [Gallery](https://digimoncardgame.fandom.com/wiki/ED01-01/Gallery)

```json
{
  "card": "ED01-01",
  "page_revision": 193544,
  "english_table": true,
  "rows": [],
  "main_images": [],
  "gallery": [],
  "gallery_error": "ValueError: missingtitle"
}
```

### ED02-01

[Card](https://digimoncardgame.fandom.com/wiki/ED02-01) | [Gallery](https://digimoncardgame.fandom.com/wiki/ED02-01/Gallery)

```json
{
  "card": "ED02-01",
  "page_revision": 193545,
  "english_table": true,
  "rows": [],
  "main_images": [],
  "gallery": [],
  "gallery_error": "ValueError: missingtitle"
}
```

### EX14-001

[Card](https://digimoncardgame.fandom.com/wiki/EX14-001) | [Gallery](https://digimoncardgame.fandom.com/wiki/EX14-001/Gallery)

```json
{
  "card": "EX14-001",
  "page_revision": 185808,
  "gallery_revision": 181985,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "To be completed",
      "note": "EX-14: EXTRA BOOSTER MALEVOLENT VII",
      "type": "Foil - Coloured Border -\u00a0"
    }
  ],
  "gallery": [
    {
      "id": "EX14-001",
      "scan": false,
      "note": "EX-14: EXTRA BOOSTER MALEVOLENT VII",
      "caption": "EX-14: EXTRA BOOSTER MALEVOLENT VII (EN)"
    },
    {
      "id": "EX14-001-Sample",
      "scan": false,
      "note": "EX-14: EXTRA BOOSTER MALEVOLENT VII",
      "caption": "EX-14: EXTRA BOOSTER MALEVOLENT VII (EN)"
    },
    {
      "id": "EX14-001_P1",
      "scan": false,
      "note": "EX-14: EXTRA BOOSTER MALEVOLENT VII",
      "caption": "EX-14: EXTRA BOOSTER MALEVOLENT VII (EN)"
    },
    {
      "id": "EX14-001_P1-Sample",
      "scan": false,
      "note": "EX-14: EXTRA BOOSTER MALEVOLENT VII",
      "caption": "EX-14: EXTRA BOOSTER MALEVOLENT VII (EN)"
    }
  ],
  "main_images": [],
  "before": {
    "mapped": [
      {
        "id": "EX14-001_P1",
        "row": 0
      },
      {
        "id": "EX14-001_P1-Sample",
        "row": 0
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "EX14-001_P1",
        "row": 0
      },
      {
        "id": "EX14-001_P1-Sample",
        "row": 0
      }
    ],
    "synthetic": []
  }
}
```

### EX14-012

[Card](https://digimoncardgame.fandom.com/wiki/EX14-012) | [Gallery](https://digimoncardgame.fandom.com/wiki/EX14-012/Gallery)

```json
{
  "card": "EX14-012",
  "page_revision": 192808,
  "gallery_revision": 192786,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "To be completed",
      "note": "EX-14: EXTRA BOOSTER MALEVOLENT VII",
      "type": "Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "EX14-012",
      "scan": false,
      "note": "EX-14: EXTRA BOOSTER MALEVOLENT VII",
      "caption": "EX-14: EXTRA BOOSTER MALEVOLENT VII (EN)"
    },
    {
      "id": "EX14-012-Sample",
      "scan": true,
      "note": "EX-14: EXTRA BOOSTER MALEVOLENT VII",
      "caption": "EX-14: EXTRA BOOSTER MALEVOLENT VII (EN)"
    },
    {
      "id": "EX14-012_P1",
      "scan": false,
      "note": "EX-14: EXTRA BOOSTER MALEVOLENT VII",
      "caption": "EX-14: EXTRA BOOSTER MALEVOLENT VII (EN)"
    },
    {
      "id": "EX14-012_P1-Sample",
      "scan": false,
      "note": "EX-14: EXTRA BOOSTER MALEVOLENT VII",
      "caption": "EX-14: EXTRA BOOSTER MALEVOLENT VII (EN)"
    }
  ],
  "main_images": [
    "EX14-012-Sample.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "EX14-012_P1",
        "row": 0
      },
      {
        "id": "EX14-012_P1-Sample",
        "row": 0
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "EX14-012_P1",
        "row": 0
      },
      {
        "id": "EX14-012_P1-Sample",
        "row": 0
      }
    ],
    "synthetic": []
  }
}
```

### EX14-054

[Card](https://digimoncardgame.fandom.com/wiki/EX14-054) | [Gallery](https://digimoncardgame.fandom.com/wiki/EX14-054/Gallery)

```json
{
  "card": "EX14-054",
  "page_revision": 192811,
  "gallery_revision": 192800,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "To be completed",
      "note": "EX-14: EXTRA BOOSTER MALEVOLENT VII",
      "type": "Alternative Art"
    },
    {
      "id": "_P2",
      "illustrator": "To be completed",
      "note": "EX-14: EXTRA BOOSTER MALEVOLENT VII",
      "type": "Gold Foil -\u00a0Rare Pull"
    }
  ],
  "gallery": [
    {
      "id": "EX14-054",
      "scan": false,
      "note": "EX-14: EXTRA BOOSTER MALEVOLENT VII",
      "caption": "EX-14: EXTRA BOOSTER MALEVOLENT VII (EN)"
    },
    {
      "id": "EX14-054-Sample",
      "scan": true,
      "note": "EX-14: EXTRA BOOSTER MALEVOLENT VII",
      "caption": "EX-14: EXTRA BOOSTER MALEVOLENT VII (EN)"
    },
    {
      "id": "EX14-054_P1",
      "scan": false,
      "note": "EX-14: EXTRA BOOSTER MALEVOLENT VII",
      "caption": "EX-14: EXTRA BOOSTER MALEVOLENT VII (EN)"
    },
    {
      "id": "EX14-054_P1-Sample",
      "scan": false,
      "note": "EX-14: EXTRA BOOSTER MALEVOLENT VII",
      "caption": "EX-14: EXTRA BOOSTER MALEVOLENT VII (EN)"
    },
    {
      "id": "EX14-054_P2",
      "scan": false,
      "note": "EX-14: EXTRA BOOSTER MALEVOLENT VII",
      "caption": "EX-14: EXTRA BOOSTER MALEVOLENT VII (EN)"
    },
    {
      "id": "EX14-054_P2-Sample",
      "scan": false,
      "note": "EX-14: EXTRA BOOSTER MALEVOLENT VII",
      "caption": "EX-14: EXTRA BOOSTER MALEVOLENT VII (EN)"
    }
  ],
  "main_images": [
    "EX14-054-Sample.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "EX14-054_P1",
        "row": 0
      },
      {
        "id": "EX14-054_P1-Sample",
        "row": 0
      },
      {
        "id": "EX14-054_P2",
        "row": 1
      },
      {
        "id": "EX14-054_P2-Sample",
        "row": 1
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "EX14-054_P1",
        "row": 0
      },
      {
        "id": "EX14-054_P1-Sample",
        "row": 0
      },
      {
        "id": "EX14-054_P2",
        "row": 1
      },
      {
        "id": "EX14-054_P2-Sample",
        "row": 1
      }
    ],
    "synthetic": []
  }
}
```

### EX5-058

[Card](https://digimoncardgame.fandom.com/wiki/EX5-058) | [Gallery](https://digimoncardgame.fandom.com/wiki/EX5-058/Gallery)

```json
{
  "card": "EX5-058",
  "page_revision": 187844,
  "gallery_revision": 187859,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "GOSSAN",
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "type": "Foil - Coloured Border -\u00a0Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "EX5-058",
      "scan": true,
      "note": "EX-05: Theme Booster Animal Colosseum",
      "caption": "EX-05: Theme Booster Animal Colosseum (EN)"
    },
    {
      "id": "EX5-058-Sample",
      "scan": false,
      "note": "EX-05: Theme Booster Animal Colosseum",
      "caption": "EX-05: Theme Booster Animal Colosseum (EN)"
    },
    {
      "id": "EX5-058_P1",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    }
  ],
  "main_images": [
    "EX5-058.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "EX5-058_P1",
        "row": 0
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "EX5-058_P1",
        "row": 0
      }
    ],
    "synthetic": []
  }
}
```

### EX5-063

[Card](https://digimoncardgame.fandom.com/wiki/EX5-063) | [Gallery](https://digimoncardgame.fandom.com/wiki/EX5-063/Gallery)

```json
{
  "card": "EX5-063",
  "page_revision": 185972,
  "gallery_revision": 185980,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "Naochika Morishita",
      "note": "EX-05: Theme Booster Animal Colosseum",
      "type": "Alternative Art"
    },
    {
      "id": "_P2",
      "illustrator": "Nakano Haito",
      "note": "PB-21: Tamer's Evolution Box - Rise of Digimon",
      "type": "Textured -\u00a0Alternative Art"
    },
    {
      "id": "_P3",
      "illustrator": "Hisashi Fujiwara",
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "type": "Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "EX5-063",
      "scan": true,
      "note": "EX-05: Theme Booster Animal Colosseum",
      "caption": "EX-05: Theme Booster Animal Colosseum (EN)"
    },
    {
      "id": "EX5-063_P1",
      "scan": true,
      "note": "EX-05: Theme Booster Animal Colosseum",
      "caption": "EX-05: Theme Booster Animal Colosseum (EN)"
    },
    {
      "id": "EX5-063_P2",
      "scan": true,
      "note": "PB-21: Tamer's Evolution Box - Rise of Digimon",
      "caption": "PB-21: Tamer's Evolution Box - Rise of Digimon (EN)"
    },
    {
      "id": "EX5-063_P3",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    }
  ],
  "main_images": [
    "EX5-063.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "EX5-063_P1",
        "row": 0
      },
      {
        "id": "EX5-063_P2",
        "row": 1
      },
      {
        "id": "EX5-063_P3",
        "row": 2
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "EX5-063_P1",
        "row": 0
      },
      {
        "id": "EX5-063_P2",
        "row": 1
      },
      {
        "id": "EX5-063_P3",
        "row": 2
      }
    ],
    "synthetic": []
  }
}
```

### EX7-051

[Card](https://digimoncardgame.fandom.com/wiki/EX7-051) | [Gallery](https://digimoncardgame.fandom.com/wiki/EX7-051/Gallery)

```json
{
  "card": "EX7-051",
  "page_revision": 191806,
  "gallery_revision": 187857,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "Takase",
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "type": "Foil - Coloured Border -\u00a0Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "EX7-051",
      "scan": true,
      "note": "EX-07: Extra Booster Digimon Liberator",
      "caption": "EX-07: Extra Booster Digimon Liberator (EN)"
    },
    {
      "id": "EX7-051_P1",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    }
  ],
  "main_images": [
    "EX7-051.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "EX7-051_P1",
        "row": 0
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "EX7-051_P1",
        "row": 0
      }
    ],
    "synthetic": []
  }
}
```

### EX7-073

[Card](https://digimoncardgame.fandom.com/wiki/EX7-073) | [Gallery](https://digimoncardgame.fandom.com/wiki/EX7-073/Gallery)

```json
{
  "card": "EX7-073",
  "page_revision": 187095,
  "gallery_revision": 185977,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "Tonamikanji",
      "note": "EX-07: Extra Booster Digimon Liberator",
      "type": "Alternative Art"
    },
    {
      "id": "_P2",
      "illustrator": "Tonamikanji",
      "note": "EX-07: Extra Booster Digimon Liberator",
      "type": "Rare Pull"
    },
    {
      "id": "_P3",
      "illustrator": "k.Dra",
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "type": "Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "EX7-073",
      "scan": true,
      "note": "EX-07: Extra Booster Digimon Liberator",
      "caption": "EX-07: Extra Booster Digimon Liberator (EN)"
    },
    {
      "id": "EX7-073-Sample",
      "scan": false,
      "note": "EX-07: Extra Booster Digimon Liberator",
      "caption": "EX-07: Extra Booster Digimon Liberator (EN)"
    },
    {
      "id": "EX7-073_P1",
      "scan": true,
      "note": "EX-07: Extra Booster Digimon Liberator",
      "caption": "EX-07: Extra Booster Digimon Liberator (EN)"
    },
    {
      "id": "EX7-073_P2",
      "scan": true,
      "note": "EX-07: Extra Booster Digimon Liberator",
      "caption": "EX-07: Extra Booster Digimon Liberator (EN)"
    },
    {
      "id": "EX7-073_P3",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    }
  ],
  "main_images": [
    "EX7-073.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "EX7-073_P1",
        "row": 0
      },
      {
        "id": "EX7-073_P2",
        "row": 1
      },
      {
        "id": "EX7-073_P3",
        "row": 2
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "EX7-073_P1",
        "row": 0
      },
      {
        "id": "EX7-073_P2",
        "row": 1
      },
      {
        "id": "EX7-073_P3",
        "row": 2
      }
    ],
    "synthetic": []
  }
}
```

### EX8-055

[Card](https://digimoncardgame.fandom.com/wiki/EX8-055) | [Gallery](https://digimoncardgame.fandom.com/wiki/EX8-055/Gallery)

```json
{
  "card": "EX8-055",
  "page_revision": 181298,
  "gallery_revision": 164476,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "Tonamikanji",
      "note": "EX-08: Extra Booster Chain of Liberation",
      "type": "Alternative Art"
    },
    {
      "id": "_P2",
      "illustrator": "Kanchi Fukunari",
      "note": "PB-22: Digimon Liberator Debuggers Set",
      "type": "Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "EX8-055",
      "scan": true,
      "note": "EX-08: Extra Booster Chain of Liberation",
      "caption": "EX-08: Extra Booster Chain of Liberation (EN)"
    },
    {
      "id": "EX8-055_P1",
      "scan": true,
      "note": "EX-08: Extra Booster Chain of Liberation",
      "caption": "EX-08: Extra Booster Chain of Liberation (EN)"
    },
    {
      "id": "EX8-055_P2",
      "scan": false,
      "note": "PB-22: Digimon Liberator Debuggers Set",
      "caption": "PB-22: Digimon Liberator Debuggers Set (EN)"
    },
    {
      "id": "EX8-055_P2-Sample",
      "scan": false,
      "note": "PB-22: Digimon Liberator Debuggers Set",
      "caption": "PB-22: Digimon Liberator Debuggers Set (EN)"
    }
  ],
  "main_images": [
    "EX8-055.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "EX8-055_P1",
        "row": 0
      },
      {
        "id": "EX8-055_P2",
        "row": 1
      },
      {
        "id": "EX8-055_P2-Sample",
        "row": 1
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "EX8-055_P1",
        "row": 0
      },
      {
        "id": "EX8-055_P2",
        "row": 1
      },
      {
        "id": "EX8-055_P2-Sample",
        "row": 1
      }
    ],
    "synthetic": []
  }
}
```

### P-226

[Card](https://digimoncardgame.fandom.com/wiki/P-226) | [Gallery](https://digimoncardgame.fandom.com/wiki/P-226/Gallery)

```json
{
  "card": "P-226",
  "page_revision": 184030,
  "gallery_revision": 176889,
  "english_table": true,
  "rows": [],
  "gallery": [
    {
      "id": "P-226",
      "scan": false,
      "note": "",
      "caption": "[[ ]] (EN)"
    },
    {
      "id": "P-226-Sample",
      "scan": false,
      "note": "",
      "caption": "[[ ]] (EN)"
    }
  ],
  "main_images": [],
  "before": {
    "mapped": [],
    "synthetic": []
  },
  "after": {
    "mapped": [],
    "synthetic": []
  }
}
```

### P-229

[Card](https://digimoncardgame.fandom.com/wiki/P-229) | [Gallery](https://digimoncardgame.fandom.com/wiki/P-229/Gallery)

```json
{
  "card": "P-229",
  "page_revision": 187846,
  "gallery_revision": 187860,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "Tonamikanji",
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "type": "Foil - Coloured Border -\u00a0Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "P-229",
      "scan": true,
      "note": "Box Promotion Pack: DAWN OF LIBERATOR",
      "caption": "Box Promotion Pack: DAWN OF LIBERATOR (EN)"
    },
    {
      "id": "P-229-Sample",
      "scan": true,
      "note": "Box Promotion Pack: DAWN OF LIBERATOR",
      "caption": "Box Promotion Pack: DAWN OF LIBERATOR (EN)"
    },
    {
      "id": "P-229_P1",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    }
  ],
  "main_images": [
    "P-229.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "P-229_P1",
        "row": 0
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "P-229_P1",
        "row": 0
      }
    ],
    "synthetic": []
  }
}
```

### P-232

[Card](https://digimoncardgame.fandom.com/wiki/P-232) | [Gallery](https://digimoncardgame.fandom.com/wiki/P-232/Gallery)

```json
{
  "card": "P-232",
  "page_revision": 187850,
  "gallery_revision": 187853,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "Tonamikanji",
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "type": "Foil - Coloured Border -\u00a0Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "P-232",
      "scan": true,
      "note": "Box Promotion Pack: DAWN OF LIBERATOR",
      "caption": "Box Promotion Pack: DAWN OF LIBERATOR (EN)"
    },
    {
      "id": "P-232-Sample",
      "scan": true,
      "note": "Box Promotion Pack: DAWN OF LIBERATOR",
      "caption": "Box Promotion Pack: DAWN OF LIBERATOR (EN)"
    },
    {
      "id": "P-232_P1",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    }
  ],
  "main_images": [
    "P-232.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "P-232_P1",
        "row": 0
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "P-232_P1",
        "row": 0
      }
    ],
    "synthetic": []
  }
}
```

### P-233

[Card](https://digimoncardgame.fandom.com/wiki/P-233) | [Gallery](https://digimoncardgame.fandom.com/wiki/P-233/Gallery)

```json
{
  "card": "P-233",
  "page_revision": 187827,
  "gallery_revision": 182009,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "No Illustrator",
      "note": "Official Store Tournament 2026 Vol.2",
      "type": "Foil - Stamped -\u00a01st Place Prize"
    },
    {
      "id": "_P2",
      "illustrator": "No Illustrator",
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "type": "Foil - Coloured Border -\u00a0Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "P-233",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.2",
      "caption": "Official Store Tournament 2026 Vol.2 (EN)"
    },
    {
      "id": "P-233-Sample",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.2",
      "caption": "Official Store Tournament 2026 Vol.2 (EN)"
    },
    {
      "id": "P-233_P1",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.2",
      "caption": "Official Store Tournament 2026 Vol.2 (EN)"
    },
    {
      "id": "P-233_P1-Sample",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.2",
      "caption": "Official Store Tournament 2026 Vol.2 (EN)"
    },
    {
      "id": "P-233_P2",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    },
    {
      "id": "P-233_P2-Sample",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    }
  ],
  "main_images": [
    "P-233.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "P-233_P1",
        "row": 0
      },
      {
        "id": "P-233_P1-Sample",
        "row": 0
      },
      {
        "id": "P-233_P2",
        "row": 1
      },
      {
        "id": "P-233_P2-Sample",
        "row": 1
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "P-233_P1",
        "row": 0
      },
      {
        "id": "P-233_P1-Sample",
        "row": 0
      },
      {
        "id": "P-233_P2",
        "row": 1
      },
      {
        "id": "P-233_P2-Sample",
        "row": 1
      }
    ],
    "synthetic": []
  }
}
```

### P-234

[Card](https://digimoncardgame.fandom.com/wiki/P-234) | [Gallery](https://digimoncardgame.fandom.com/wiki/P-234/Gallery)

```json
{
  "card": "P-234",
  "page_revision": 187828,
  "gallery_revision": 182010,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "No Illustrator",
      "note": "Official Store Tournament 2026 Vol.2",
      "type": "Foil - Stamped -\u00a01st Place Prize"
    },
    {
      "id": "_P2",
      "illustrator": "No Illustrator",
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "type": "Foil - Coloured Border -\u00a0Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "P-234",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.2",
      "caption": "Official Store Tournament 2026 Vol.2 (EN)"
    },
    {
      "id": "P-234-Sample",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.2",
      "caption": "Official Store Tournament 2026 Vol.2 (EN)"
    },
    {
      "id": "P-234_P1",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.2",
      "caption": "Official Store Tournament 2026 Vol.2 (EN)"
    },
    {
      "id": "P-234_P1-Sample",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.2",
      "caption": "Official Store Tournament 2026 Vol.2 (EN)"
    },
    {
      "id": "P-234_P2",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    },
    {
      "id": "P-234_P2-Sample",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    }
  ],
  "main_images": [
    "P-234.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "P-234_P1",
        "row": 0
      },
      {
        "id": "P-234_P1-Sample",
        "row": 0
      },
      {
        "id": "P-234_P2",
        "row": 1
      },
      {
        "id": "P-234_P2-Sample",
        "row": 1
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "P-234_P1",
        "row": 0
      },
      {
        "id": "P-234_P1-Sample",
        "row": 0
      },
      {
        "id": "P-234_P2",
        "row": 1
      },
      {
        "id": "P-234_P2-Sample",
        "row": 1
      }
    ],
    "synthetic": []
  }
}
```

### P-235

[Card](https://digimoncardgame.fandom.com/wiki/P-235) | [Gallery](https://digimoncardgame.fandom.com/wiki/P-235/Gallery)

```json
{
  "card": "P-235",
  "page_revision": 187829,
  "gallery_revision": 182011,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "No Illustrator",
      "note": "Official Store Tournament 2026 Vol.2",
      "type": "Foil - Stamped -\u00a01st Place Prize"
    },
    {
      "id": "_P2",
      "illustrator": "No Illustrator",
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "type": "Foil - Coloured Border -\u00a0Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "P-235",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.2",
      "caption": "Official Store Tournament 2026 Vol.2 (EN)"
    },
    {
      "id": "P-235-Sample",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.2",
      "caption": "Official Store Tournament 2026 Vol.2 (EN)"
    },
    {
      "id": "P-235_P1",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.2",
      "caption": "Official Store Tournament 2026 Vol.2 (EN)"
    },
    {
      "id": "P-235_P1-Sample",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.2",
      "caption": "Official Store Tournament 2026 Vol.2 (EN)"
    },
    {
      "id": "P-235_P2",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    },
    {
      "id": "P-235_P2-Sample",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    }
  ],
  "main_images": [
    "P-235.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "P-235_P1",
        "row": 0
      },
      {
        "id": "P-235_P1-Sample",
        "row": 0
      },
      {
        "id": "P-235_P2",
        "row": 1
      },
      {
        "id": "P-235_P2-Sample",
        "row": 1
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "P-235_P1",
        "row": 0
      },
      {
        "id": "P-235_P1-Sample",
        "row": 0
      },
      {
        "id": "P-235_P2",
        "row": 1
      },
      {
        "id": "P-235_P2-Sample",
        "row": 1
      }
    ],
    "synthetic": []
  }
}
```

### P-236

[Card](https://digimoncardgame.fandom.com/wiki/P-236) | [Gallery](https://digimoncardgame.fandom.com/wiki/P-236/Gallery)

```json
{
  "card": "P-236",
  "page_revision": 187830,
  "gallery_revision": 183638,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "No Illustrator",
      "note": "Official Store Tournament 2026 Vol.2",
      "type": "Foil - Stamped -\u00a01st Place Prize"
    },
    {
      "id": "_P2",
      "illustrator": "No Illustrator",
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "type": "Foil - Coloured Border -\u00a0Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "P-236",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.2",
      "caption": "Official Store Tournament 2026 Vol.2 (EN)"
    },
    {
      "id": "P-236-Sample",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.2",
      "caption": "Official Store Tournament 2026 Vol.2 (EN)"
    },
    {
      "id": "P-236_P1",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.2",
      "caption": "Official Store Tournament 2026 Vol.2 (EN)"
    },
    {
      "id": "P-236_P1-Sample",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.2",
      "caption": "Official Store Tournament 2026 Vol.2 (EN)"
    },
    {
      "id": "P-236_P2",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    },
    {
      "id": "P-236_P2-Sample",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    }
  ],
  "main_images": [
    "P-236.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "P-236_P1",
        "row": 0
      },
      {
        "id": "P-236_P1-Sample",
        "row": 0
      },
      {
        "id": "P-236_P2",
        "row": 1
      },
      {
        "id": "P-236_P2-Sample",
        "row": 1
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "P-236_P1",
        "row": 0
      },
      {
        "id": "P-236_P1-Sample",
        "row": 0
      },
      {
        "id": "P-236_P2",
        "row": 1
      },
      {
        "id": "P-236_P2-Sample",
        "row": 1
      }
    ],
    "synthetic": []
  }
}
```

### P-237

[Card](https://digimoncardgame.fandom.com/wiki/P-237) | [Gallery](https://digimoncardgame.fandom.com/wiki/P-237/Gallery)

```json
{
  "card": "P-237",
  "page_revision": 187831,
  "gallery_revision": 182013,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "Tonamikanji",
      "note": "Official Store Tournament 2026 Vol.2",
      "type": "Foil - Stamped -\u00a01st Place Prize"
    },
    {
      "id": "_P2",
      "illustrator": "Tonamikanji",
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "type": "Foil - Coloured Border -\u00a0Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "P-237",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.2",
      "caption": "Official Store Tournament 2026 Vol.2 (EN)"
    },
    {
      "id": "P-237-Sample",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.2",
      "caption": "Official Store Tournament 2026 Vol.2 (EN)"
    },
    {
      "id": "P-237_P1",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.2",
      "caption": "Official Store Tournament 2026 Vol.2 (EN)"
    },
    {
      "id": "P-237_P1-Sample",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.2",
      "caption": "Official Store Tournament 2026 Vol.2 (EN)"
    },
    {
      "id": "P-237_P2",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    },
    {
      "id": "P-237_P2-Sample",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    }
  ],
  "main_images": [
    "P-237.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "P-237_P1",
        "row": 0
      },
      {
        "id": "P-237_P1-Sample",
        "row": 0
      },
      {
        "id": "P-237_P2",
        "row": 1
      },
      {
        "id": "P-237_P2-Sample",
        "row": 1
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "P-237_P1",
        "row": 0
      },
      {
        "id": "P-237_P1-Sample",
        "row": 0
      },
      {
        "id": "P-237_P2",
        "row": 1
      },
      {
        "id": "P-237_P2-Sample",
        "row": 1
      }
    ],
    "synthetic": []
  }
}
```

### P-238

[Card](https://digimoncardgame.fandom.com/wiki/P-238) | [Gallery](https://digimoncardgame.fandom.com/wiki/P-238/Gallery)

```json
{
  "card": "P-238",
  "page_revision": 187832,
  "gallery_revision": 182014,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "poroze",
      "note": "Official Store Tournament 2026 Vol.2",
      "type": "Foil - Stamped -\u00a01st Place Prize"
    },
    {
      "id": "_P2",
      "illustrator": "poroze",
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "type": "Foil - Coloured Border -\u00a0Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "P-238",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.2",
      "caption": "Official Store Tournament 2026 Vol.2 (EN)"
    },
    {
      "id": "P-238-Sample",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.2",
      "caption": "Official Store Tournament 2026 Vol.2 (EN)"
    },
    {
      "id": "P-238_P1",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.2",
      "caption": "Official Store Tournament 2026 Vol.2 (EN)"
    },
    {
      "id": "P-238_P1-Sample",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.2",
      "caption": "Official Store Tournament 2026 Vol.2 (EN)"
    },
    {
      "id": "P-238_P2",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    },
    {
      "id": "P-238_P2-Sample",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    }
  ],
  "main_images": [
    "P-238.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "P-238_P1",
        "row": 0
      },
      {
        "id": "P-238_P1-Sample",
        "row": 0
      },
      {
        "id": "P-238_P2",
        "row": 1
      },
      {
        "id": "P-238_P2-Sample",
        "row": 1
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "P-238_P1",
        "row": 0
      },
      {
        "id": "P-238_P1-Sample",
        "row": 0
      },
      {
        "id": "P-238_P2",
        "row": 1
      },
      {
        "id": "P-238_P2-Sample",
        "row": 1
      }
    ],
    "synthetic": []
  }
}
```

### P-239

[Card](https://digimoncardgame.fandom.com/wiki/P-239) | [Gallery](https://digimoncardgame.fandom.com/wiki/P-239/Gallery)

```json
{
  "card": "P-239",
  "page_revision": 188028,
  "gallery_revision": 185986,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "Kuromori maya",
      "note": "Official Store Tournament 2026 Vol.3",
      "type": "Foil - Stamped -\u00a01st Place Prize"
    },
    {
      "id": "_P2",
      "illustrator": "Kuromori maya",
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "type": "Foil - Coloured Border -\u00a0Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "P-239",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.3",
      "caption": "Official Store Tournament 2026 Vol.3 (EN)"
    },
    {
      "id": "P-239-Sample",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.3",
      "caption": "Official Store Tournament 2026 Vol.3 (EN)"
    },
    {
      "id": "P-239_P1",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.3",
      "caption": "Official Store Tournament 2026 Vol.3 (EN)"
    },
    {
      "id": "P-239_P1-Sample",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.3",
      "caption": "Official Store Tournament 2026 Vol.3 (EN)"
    },
    {
      "id": "P-239_P2",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    }
  ],
  "main_images": [
    "P-239.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "P-239_P1",
        "row": 0
      },
      {
        "id": "P-239_P1-Sample",
        "row": 0
      },
      {
        "id": "P-239_P2",
        "row": 1
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "P-239_P1",
        "row": 0
      },
      {
        "id": "P-239_P1-Sample",
        "row": 0
      },
      {
        "id": "P-239_P2",
        "row": 1
      }
    ],
    "synthetic": []
  }
}
```

### P-240

[Card](https://digimoncardgame.fandom.com/wiki/P-240) | [Gallery](https://digimoncardgame.fandom.com/wiki/P-240/Gallery)

```json
{
  "card": "P-240",
  "page_revision": 190104,
  "gallery_revision": 185987,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "Moyasi",
      "note": "Official Store Tournament 2026 Vol.3",
      "type": "Foil - Stamped -\u00a01st Place Prize"
    },
    {
      "id": "_P2",
      "illustrator": "Moyasi",
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "type": "Foil - Coloured Border -\u00a0Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "P-240",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.3",
      "caption": "Official Store Tournament 2026 Vol.3 (EN)"
    },
    {
      "id": "P-240-Sample",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.3",
      "caption": "Official Store Tournament 2026 Vol.3 (EN)"
    },
    {
      "id": "P-240_P1",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.3",
      "caption": "Official Store Tournament 2026 Vol.3 (EN)"
    },
    {
      "id": "P-240_P1-Sample",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.3",
      "caption": "Official Store Tournament 2026 Vol.3 (EN)"
    },
    {
      "id": "P-240_P2",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    }
  ],
  "main_images": [
    "P-240.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "P-240_P1",
        "row": 0
      },
      {
        "id": "P-240_P1-Sample",
        "row": 0
      },
      {
        "id": "P-240_P2",
        "row": 1
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "P-240_P1",
        "row": 0
      },
      {
        "id": "P-240_P1-Sample",
        "row": 0
      },
      {
        "id": "P-240_P2",
        "row": 1
      }
    ],
    "synthetic": []
  }
}
```

### P-241

[Card](https://digimoncardgame.fandom.com/wiki/P-241) | [Gallery](https://digimoncardgame.fandom.com/wiki/P-241/Gallery)

```json
{
  "card": "P-241",
  "page_revision": 188030,
  "gallery_revision": 185999,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "No Illustrator",
      "note": "Official Store Tournament 2026 Vol.3",
      "type": "Foil - Stamped -\u00a01st Place Prize"
    },
    {
      "id": "_P2",
      "illustrator": "No Illustrator",
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "type": "Foil - Coloured Border -\u00a0Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "P-241",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.3",
      "caption": "Official Store Tournament 2026 Vol.3 (EN)"
    },
    {
      "id": "P-241-Sample",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.3",
      "caption": "Official Store Tournament 2026 Vol.3 (EN)"
    },
    {
      "id": "P-241_P1",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.3",
      "caption": "Official Store Tournament 2026 Vol.3 (EN)"
    },
    {
      "id": "P-241_P1-Sample",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.3",
      "caption": "Official Store Tournament 2026 Vol.3 (EN)"
    },
    {
      "id": "P-241_P2",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    }
  ],
  "main_images": [
    "P-241.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "P-241_P1",
        "row": 0
      },
      {
        "id": "P-241_P1-Sample",
        "row": 0
      },
      {
        "id": "P-241_P2",
        "row": 1
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "P-241_P1",
        "row": 0
      },
      {
        "id": "P-241_P1-Sample",
        "row": 0
      },
      {
        "id": "P-241_P2",
        "row": 1
      }
    ],
    "synthetic": []
  }
}
```

### P-242

[Card](https://digimoncardgame.fandom.com/wiki/P-242) | [Gallery](https://digimoncardgame.fandom.com/wiki/P-242/Gallery)

```json
{
  "card": "P-242",
  "page_revision": 188031,
  "gallery_revision": 186000,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "No Illustrator",
      "note": "Official Store Tournament 2026 Vol.3",
      "type": "Foil - Stamped -\u00a01st Place Prize"
    },
    {
      "id": "_P2",
      "illustrator": "No Illustrator",
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "type": "Foil - Coloured Border -\u00a0Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "P-242",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.3",
      "caption": "Official Store Tournament 2026 Vol.3 (EN)"
    },
    {
      "id": "P-242-Sample",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.3",
      "caption": "Official Store Tournament 2026 Vol.3 (EN)"
    },
    {
      "id": "P-242_P1",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.3",
      "caption": "Official Store Tournament 2026 Vol.3 (EN)"
    },
    {
      "id": "P-242_P1-Sample",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.3",
      "caption": "Official Store Tournament 2026 Vol.3 (EN)"
    },
    {
      "id": "P-242_P2",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    }
  ],
  "main_images": [
    "P-242.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "P-242_P1",
        "row": 0
      },
      {
        "id": "P-242_P1-Sample",
        "row": 0
      },
      {
        "id": "P-242_P2",
        "row": 1
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "P-242_P1",
        "row": 0
      },
      {
        "id": "P-242_P1-Sample",
        "row": 0
      },
      {
        "id": "P-242_P2",
        "row": 1
      }
    ],
    "synthetic": []
  }
}
```

### P-243

[Card](https://digimoncardgame.fandom.com/wiki/P-243) | [Gallery](https://digimoncardgame.fandom.com/wiki/P-243/Gallery)

```json
{
  "card": "P-243",
  "page_revision": 188032,
  "gallery_revision": 186001,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "No Illustrator",
      "note": "Official Store Tournament 2026 Vol.3",
      "type": "Foil - Stamped -\u00a01st Place Prize"
    },
    {
      "id": "_P2",
      "illustrator": "No Illustrator",
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "type": "Foil - Coloured Border -\u00a0Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "P-243",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.3",
      "caption": "Official Store Tournament 2026 Vol.3 (EN)"
    },
    {
      "id": "P-243-Sample",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.3",
      "caption": "Official Store Tournament 2026 Vol.3 (EN)"
    },
    {
      "id": "P-243_P1",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.3",
      "caption": "Official Store Tournament 2026 Vol.3 (EN)"
    },
    {
      "id": "P-243_P1-Sample",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.3",
      "caption": "Official Store Tournament 2026 Vol.3 (EN)"
    },
    {
      "id": "P-243_P2",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    }
  ],
  "main_images": [
    "P-243.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "P-243_P1",
        "row": 0
      },
      {
        "id": "P-243_P1-Sample",
        "row": 0
      },
      {
        "id": "P-243_P2",
        "row": 1
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "P-243_P1",
        "row": 0
      },
      {
        "id": "P-243_P1-Sample",
        "row": 0
      },
      {
        "id": "P-243_P2",
        "row": 1
      }
    ],
    "synthetic": []
  }
}
```

### P-244

[Card](https://digimoncardgame.fandom.com/wiki/P-244) | [Gallery](https://digimoncardgame.fandom.com/wiki/P-244/Gallery)

```json
{
  "card": "P-244",
  "page_revision": 188033,
  "gallery_revision": 190611,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "Tonamikanji",
      "note": "Official Store Tournament 2026 Vol.3",
      "type": "Foil - Stamped -\u00a01st Place Prize"
    },
    {
      "id": "_P2",
      "illustrator": "Tonamikanji",
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "type": "Foil - Coloured Border -\u00a0Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "P-244",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.3",
      "caption": "Official Store Tournament 2026 Vol.3 (EN)"
    },
    {
      "id": "P-244-Sample",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.3",
      "caption": "Official Store Tournament 2026 Vol.3 (EN)"
    },
    {
      "id": "P-244_P1",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.3",
      "caption": "Official Store Tournament 2026 Vol.3 (EN)"
    },
    {
      "id": "P-244_P1-Sample",
      "scan": true,
      "note": "Official Store Tournament 2026 Vol.3",
      "caption": "Official Store Tournament 2026 Vol.3 (EN)"
    },
    {
      "id": "P-244_P2",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    }
  ],
  "main_images": [
    "P-244.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "P-244_P1",
        "row": 0
      },
      {
        "id": "P-244_P1-Sample",
        "row": 0
      },
      {
        "id": "P-244_P2",
        "row": 1
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "P-244_P1",
        "row": 0
      },
      {
        "id": "P-244_P1-Sample",
        "row": 0
      },
      {
        "id": "P-244_P2",
        "row": 1
      }
    ],
    "synthetic": []
  }
}
```

### P-251

[Card](https://digimoncardgame.fandom.com/wiki/P-251) | [Gallery](https://digimoncardgame.fandom.com/wiki/P-251/Gallery)

```json
{
  "card": "P-251",
  "page_revision": 190608,
  "gallery_revision": 190736,
  "english_table": true,
  "rows": [],
  "gallery": [
    {
      "id": "P-251",
      "scan": false,
      "note": "",
      "caption": "Official Store Tournament 2027 Vol.2 (EN)"
    },
    {
      "id": "P-251-Sample",
      "scan": false,
      "note": "",
      "caption": "Official Store Tournament 2027 Vol.2 (EN)"
    },
    {
      "id": "P-251_P1",
      "scan": false,
      "note": "",
      "caption": "Official Store Tournament 2027 Vol.2 (EN)"
    },
    {
      "id": "P-251_P1-Sample",
      "scan": false,
      "note": "",
      "caption": "Official Store Tournament 2027 Vol.2 (EN)"
    },
    {
      "id": "P-251_P2",
      "scan": false,
      "note": "",
      "caption": "LM-10 (EN)"
    }
  ],
  "main_images": [],
  "before": {
    "mapped": [
      {
        "id": "P-251_P1",
        "row": null
      },
      {
        "id": "P-251_P1-Sample",
        "row": null
      },
      {
        "id": "P-251_P2",
        "row": null
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "P-251_P1",
        "row": null
      },
      {
        "id": "P-251_P1-Sample",
        "row": null
      },
      {
        "id": "P-251_P2",
        "row": null
      }
    ],
    "synthetic": []
  }
}
```

### SD01-01

[Card](https://digimoncardgame.fandom.com/wiki/SD01-01) | [Gallery](https://digimoncardgame.fandom.com/wiki/SD01-01/Gallery)

```json
{
  "card": "SD01-01",
  "page_revision": 193547,
  "english_table": true,
  "rows": [],
  "main_images": [],
  "gallery": [],
  "gallery_error": "ValueError: missingtitle"
}
```

### SD02-01

[Card](https://digimoncardgame.fandom.com/wiki/SD02-01) | [Gallery](https://digimoncardgame.fandom.com/wiki/SD02-01/Gallery)

```json
{
  "card": "SD02-01",
  "page_revision": 193546,
  "english_table": true,
  "rows": [],
  "main_images": [],
  "gallery": [],
  "gallery_error": "ValueError: missingtitle"
}
```

### ST22-13

[Card](https://digimoncardgame.fandom.com/wiki/ST22-13) | [Gallery](https://digimoncardgame.fandom.com/wiki/ST22-13/Gallery)

```json
{
  "card": "ST22-13",
  "page_revision": 187842,
  "gallery_revision": 187856,
  "english_table": true,
  "rows": [
    {
      "id": "_P1",
      "illustrator": "E X tiger",
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "type": "Foil - Coloured Border -\u00a0Alternative Art"
    }
  ],
  "gallery": [
    {
      "id": "ST22-13",
      "scan": true,
      "note": "ST-22: ADVANCED DECK SET AMETHYST MANDALA",
      "caption": "ST-22: ADVANCED DECK SET AMETHYST MANDALA (EN)"
    },
    {
      "id": "ST22-13-Sample",
      "scan": true,
      "note": "ST-22: ADVANCED DECK SET AMETHYST MANDALA",
      "caption": "ST-22: ADVANCED DECK SET AMETHYST MANDALA (EN)"
    },
    {
      "id": "ST22-13_P1",
      "scan": false,
      "note": "LM-09: LIMITED CARD PACK DISTANCIA CERO",
      "caption": "LM-09: LIMITED CARD PACK DISTANCIA CERO (EN)"
    }
  ],
  "main_images": [
    "ST22-13.png"
  ],
  "before": {
    "mapped": [
      {
        "id": "ST22-13_P1",
        "row": 0
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "ST22-13_P1",
        "row": 0
      }
    ],
    "synthetic": []
  }
}
```

### ST25-01

[Card](https://digimoncardgame.fandom.com/wiki/ST25-01) | [Gallery](https://digimoncardgame.fandom.com/wiki/ST25-01/Gallery)

```json
{
  "card": "ST25-01",
  "page_revision": 193470,
  "gallery_revision": 181986,
  "english_table": true,
  "rows": [
    {
      "id": "_P0",
      "illustrator": "To be completed",
      "note": "ST-25 & ST-26: Welcome Tamers Pack",
      "type": "Foil - Pre Release Stamp -\u00a0"
    }
  ],
  "gallery": [
    {
      "id": "ST25-01",
      "scan": false,
      "note": "ST-25: STARTER DECK DIGIMON ALYSION RUBEUSDRAMON",
      "caption": "ST-25: STARTER DECK DIGIMON ALYSION RUBEUSDRAMON (EN)"
    },
    {
      "id": "ST25-01-Sample",
      "scan": false,
      "note": "ST-25: STARTER DECK DIGIMON ALYSION RUBEUSDRAMON",
      "caption": "ST-25: STARTER DECK DIGIMON ALYSION RUBEUSDRAMON (EN)"
    },
    {
      "id": "ST25-01_P1",
      "scan": false,
      "note": "",
      "caption": "PRP-2526 (EN)"
    }
  ],
  "main_images": [],
  "before": {
    "mapped": [
      {
        "id": "ST25-01_P1",
        "row": null
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "ST25-01_P1",
        "row": null
      }
    ],
    "synthetic": []
  }
}
```

### ST25-02

[Card](https://digimoncardgame.fandom.com/wiki/ST25-02) | [Gallery](https://digimoncardgame.fandom.com/wiki/ST25-02/Gallery)

```json
{
  "card": "ST25-02",
  "error": "ValueError: missingtitle"
}
```

### ST25-03

[Card](https://digimoncardgame.fandom.com/wiki/ST25-03) | [Gallery](https://digimoncardgame.fandom.com/wiki/ST25-03/Gallery)

```json
{
  "card": "ST25-03",
  "error": "ValueError: missingtitle"
}
```

### ST25-15

[Card](https://digimoncardgame.fandom.com/wiki/ST25-15) | [Gallery](https://digimoncardgame.fandom.com/wiki/ST25-15/Gallery)

```json
{
  "card": "ST25-15",
  "error": "ValueError: missingtitle"
}
```

### ST26-01

[Card](https://digimoncardgame.fandom.com/wiki/ST26-01) | [Gallery](https://digimoncardgame.fandom.com/wiki/ST26-01/Gallery)

```json
{
  "card": "ST26-01",
  "page_revision": 193471,
  "gallery_revision": 184032,
  "english_table": true,
  "rows": [
    {
      "id": "_P0",
      "illustrator": "To be completed",
      "note": "ST-25 & ST-26: Welcome Tamers Pack",
      "type": "Foil - Pre Release Stamp -\u00a0"
    }
  ],
  "gallery": [
    {
      "id": "ST26-01",
      "scan": false,
      "note": "ST-26: STARTER DECK DIGIMON ALYSION YUKINAMON",
      "caption": "ST-26: STARTER DECK DIGIMON ALYSION YUKINAMON (EN)"
    },
    {
      "id": "ST26-01-Sample",
      "scan": false,
      "note": "ST-26: STARTER DECK DIGIMON ALYSION YUKINAMON",
      "caption": "ST-26: STARTER DECK DIGIMON ALYSION YUKINAMON (EN)"
    },
    {
      "id": "ST26-01_P1",
      "scan": false,
      "note": "",
      "caption": "ST-25 & ST-26: Welcome Tamers Pack (EN)"
    }
  ],
  "main_images": [],
  "before": {
    "mapped": [
      {
        "id": "ST26-01_P1",
        "row": null
      }
    ],
    "synthetic": []
  },
  "after": {
    "mapped": [
      {
        "id": "ST26-01_P1",
        "row": null
      }
    ],
    "synthetic": []
  }
}
```
