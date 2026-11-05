import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "Wiki"))

import GetCardImages as GCI
import GetDataFromWiki as GDW

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


class ContentHashTests(unittest.TestCase):
    card = {"id": "BT24-101", "AAs": [{"id": "_P1", "type": "Alternative Art"}, {"id": "_P2", "type": "Rare Pull"}]}

    def test_alt_art_type_change_counts_as_changed(self):
        fixed = {**self.card, "AAs": [{"id": "_P1", "type": "Alternative Art"}, {"id": "_P2", "type": "Alternative Art"}]}
        self.assertNotEqual(GDW._card_content_hash(self.card), GDW._card_content_hash(fixed))

    def test_alt_art_order_does_not_count(self):
        reordered = {**self.card, "AAs": list(reversed(self.card["AAs"]))}
        self.assertEqual(GDW._card_content_hash(self.card), GDW._card_content_hash(reordered))


if __name__ == "__main__":
    unittest.main()
