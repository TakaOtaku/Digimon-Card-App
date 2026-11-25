import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "Wiki"))

import PrepareCards


class PrepareCardsExclusionTests(unittest.TestCase):
    def test_excludes_nonexistent_card_and_prints_in_both_languages(self):
        def card(card_id):
            return {
                "_id": card_id, "id": card_id, "cardNumber": card_id,
                "cardImage": "assets/images/cards/" + card_id + ".webp",
                "AAs": [{"id": card_id + "_P1", "illustrator": "-", "note": "-", "type": "-"}],
                "JAAs": [{"id": card_id + "_P1-J", "illustrator": "-", "note": "-", "type": "-"}],
            }

        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "DigimonCards.json").write_text(json.dumps([card("ST25-15"), card("ST25-14")]), encoding="utf-8")

            def open_fixture(path, mode):
                return (root / Path(path).name).open(mode, encoding="utf-8")

            with patch.object(PrepareCards, "open", open_fixture, create=True), \
                 patch.object(PrepareCards, "check_image_exists", return_value=True), \
                 patch.object(PrepareCards, "preparedCardsENG", []), \
                 patch.object(PrepareCards, "preparedCardsJAP", []):
                PrepareCards.prepareCards()

            for language in ("ENG", "JAP"):
                result = json.loads((root / ("PreparedDigimonCards" + language + ".json")).read_text(encoding="utf-8"))
                self.assertEqual({card["id"] for card in result}, {"ST25-14", "ST25-14_P1"})


if __name__ == "__main__":
    unittest.main()
