import json
import os
import re
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "scripts" / "python" / "Wiki"))

import GetAlysionDataFromWiki as ALYSION
import GetDataFromWiki as GDW
import GetDataFromWikiSingle as SINGLE
import MoveFiles
import PrepareCards
import WikiVariables as WV

ALYSION_ID = re.compile(r"^(BD|ED|SD)\d")
JSONS = "scripts/python/Wiki/jsons"


def card(card_id):
    return {"_id": card_id, "id": card_id, "cardNumber": card_id, "cardImage": "assets/images/cards/x.webp", "AAs": [], "JAAs": []}


class SeparateCardFileTests(unittest.TestCase):
    def setUp(self):
        self.addCleanup(setattr, WV, "cardsName", WV.cardsName)
        self.addCleanup(os.chdir, os.getcwd())
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        self.addCleanup(os.chdir, os.getcwd())
        os.chdir(directory.name)
        for folder in (JSONS, "scripts/python/Wiki/digimon-images/converted", "src/assets/cardlists", "src/assets/images/cards"):
            Path(folder).mkdir(parents=True)

    def write(self, path, ids):
        Path(path).write_text(json.dumps([card(i) for i in ids]), encoding="utf-8")

    def ids(self, path):
        return [c["id"] for c in json.loads(Path(path).read_text(encoding="utf-8"))]

    def test_alysion_run_prepares_and_publishes_only_its_own_files(self):
        for folder in (JSONS, "src/assets/cardlists"):
            for name in ("DigimonCards", "PreparedDigimonCardsENG", "PreparedDigimonCardsJAP"):
                self.write(f"{folder}/{name}.json", ["BT1-001"])
        # a stale working copy of the normal list must never replace the published one
        self.write(f"{JSONS}/DigimonCards.json", [])
        self.write(f"{JSONS}/AlysionCards.json", ["BD01-01"])
        before = {p: p.read_bytes() for p in Path("src/assets/cardlists").iterdir()}

        ALYSION.use_alysion_files()
        with patch.object(PrepareCards, "preparedCardsENG", []), patch.object(PrepareCards, "preparedCardsJAP", []), patch.object(PrepareCards, "check_image_exists", lambda path: True):
            PrepareCards.prepareCards()
        MoveFiles.moveFiles()

        self.assertEqual({p: p.read_bytes() for p in before}, before)
        for name in ("AlysionCards", "PreparedAlysionCardsENG", "PreparedAlysionCardsJAP"):
            self.assertEqual(self.ids(f"src/assets/cardlists/{name}.json"), ["BD01-01"])

    def test_normal_run_publishes_only_its_own_files(self):
        self.write(f"{JSONS}/DigimonCards.json", ["BT1-001"])
        self.write(f"{JSONS}/AlysionCards.json", [])
        self.write("src/assets/cardlists/AlysionCards.json", ["BD01-01"])
        MoveFiles.moveFiles()
        self.assertEqual(self.ids("src/assets/cardlists/AlysionCards.json"), ["BD01-01"])
        self.assertEqual(self.ids("src/assets/cardlists/DigimonCards.json"), ["BT1-001"])

    def test_merge_reads_and_writes_the_files_of_the_run(self):
        self.write(f"{JSONS}/DigimonCards.json", ["BT1-001"])
        ALYSION.use_alysion_files()
        self.assertEqual(GDW._load_existing_cards(), {})
        self.assertEqual(WV.cardsJson(), f"./{JSONS}/AlysionCards.json")

    def test_single_set_update_picks_the_files_of_its_set(self):
        SINGLE.use_files_of(SINGLE.find_set_entry("BT-04"))
        self.assertEqual(WV.cardsName, "DigimonCards")
        SINGLE.use_files_of(SINGLE.find_set_entry("BD-01"))
        self.assertEqual(WV.cardsName, "AlysionCards")


class CommittedCardDataTests(unittest.TestCase):
    def test_normal_and_alysion_cards_live_in_separate_files(self):
        for folder in (JSONS, "src/assets/cardlists"):
            for normal, alysion in (("DigimonCards", "AlysionCards"), ("PreparedDigimonCardsENG", "PreparedAlysionCardsENG"), ("PreparedDigimonCardsJAP", "PreparedAlysionCardsJAP")):
                with self.subTest(folder=folder, file=normal):
                    paper = [c["id"] for c in json.loads((ROOT / folder / f"{normal}.json").read_text(encoding="utf-8"))]
                    own = [c["id"] for c in json.loads((ROOT / folder / f"{alysion}.json").read_text(encoding="utf-8"))]
                    self.assertGreater(len(paper), 4000)
                    self.assertGreaterEqual(len(own), 60)
                    self.assertEqual([i for i in paper if ALYSION_ID.match(i)], [])
                    self.assertEqual([i for i in own if not ALYSION_ID.match(i)], [])


if __name__ == "__main__":
    unittest.main()
