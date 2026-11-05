import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "Wiki"))

import GetCardImages as GCI
import GetDataFromWiki as GDW


class PickIllustratorRowTests(unittest.TestCase):
    # BT24-101 on the wiki: two alt prints from the same booster
    rows = [
        {"note": "BT-24: BOOSTER TIME STRANGER", "type": "Alternative Art"},
        {"note": "BT-24: BOOSTER TIME STRANGER", "type": "Rare Pull"},
    ]

    def test_same_booster_prints_get_their_own_row(self):
        used = set()
        first = GCI.pick_illustrator_row(self.rows, "BT-24: BOOSTER TIME STRANGER", used)
        used.add(first)
        second = GCI.pick_illustrator_row(self.rows, "BT-24: BOOSTER TIME STRANGER", used)
        self.assertEqual([self.rows[first]["type"], self.rows[second]["type"]], ["Alternative Art", "Rare Pull"])

    def test_extra_image_reuses_first_row(self):
        self.assertEqual(GCI.pick_illustrator_row(self.rows, "BT-24: BOOSTER TIME STRANGER", {0, 1}), 0)

    def test_unknown_note_has_no_row(self):
        self.assertIsNone(GCI.pick_illustrator_row(self.rows, "EX-11", set()))


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
