import sys
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "Wiki"))

import GetAlysionDataFromWiki as ALYSION
import GetDataFromWiki as GDW
import GetDataFromWikiSingle as SINGLE
import WikiVariables as WV

SETS = ["BD-01:_NEW_EVOLUTION", "BD-02:_ULTIMATE_POWER", "BD-03:_UNION_IMPACT", "BD-04:_GREAT_LEGEND",
        "BD-05:_BATTLE_OF_OMNI", "ED-01:_CLASSIC_COLLECTION", "ED-02:_DIGITAL_HAZARD", "SD-01:_GEMMON", "SD-02:_RENAMON"]
WIKI = "https://digimoncardgame.fandom.com/wiki/"


class AlysionPipelineTests(unittest.TestCase):
    def setUp(self):
        self.addCleanup(setattr, WV, "cardLinks", WV.cardLinks)
        self.addCleanup(setattr, WV, "cards", WV.cards)
        WV.cardLinks, WV.cards = [], []

    def test_alysion_sets_have_their_own_list(self):
        self.assertEqual(sorted(page["url"] for page in WV.alysionPageLinks), sorted(WIKI + name for name in SETS))
        normal = {page["url"] for page in WV.wikiPageLinks}
        self.assertFalse(normal & {page["url"] for page in WV.alysionPageLinks})
        # paper starter decks stay with the normal cards
        self.assertTrue(any("ST-25:" in url for url in normal))
        self.assertEqual(WV.NoteDictionary["BD-05: BATTLE OF OMNI"], "BATTLE OF OMNI [BD-05]")

    def test_normal_run_leaves_alysion_cards_out(self):
        saved = ["/wiki/BT1-001", "/wiki/BD01-01", "/wiki/ED01-02", "/wiki/SD02-07", "/wiki/ST25-01", "/wiki/EX1-001"]

        def save_links():
            WV.cardLinks = list(saved)

        with patch.object(GDW.GetLinks, "getLinks"), patch.object(GDW.GetLinks, "getPromoLinks"), patch.object(GDW.GetLinks, "saveLinks", save_links):
            GDW.fetch_links(GDW.PipelineStats())
        self.assertEqual(WV.cardLinks, ["/wiki/BT1-001", "/wiki/EX1-001", "/wiki/ST25-01"])

    def test_alysion_run_fetches_only_its_sets(self):
        seen = []

        def get_links(page):
            seen.append(page["url"])
            WV.cardLinks.append("/wiki/BD01-02")

        with patch.object(ALYSION.GetLinks, "getLinks", get_links), patch.object(ALYSION.GetLinks, "getPromoLinks") as promos, patch.object(ALYSION.GetLinks, "saveLinks") as save:
            stats = GDW.PipelineStats()
            ALYSION.fetch_links(stats)
        self.assertEqual(len(seen), 9)
        self.assertEqual((WV.cardLinks, stats.links_found), (["/wiki/BD01-02"], 1))
        promos.assert_not_called()
        save.assert_not_called()

    def test_unfinished_wiki_pages_do_not_fail_the_alysion_run(self):
        WV.cardLinks = ["/wiki/BD05-01", "/wiki/BD05-02"]
        with patch.object(ALYSION.GetCardData, "getCardData", lambda: WV.cards.append(object())):
            ALYSION.scrape_cards(GDW.PipelineStats())
        WV.cards = []
        with patch.object(ALYSION.GetCardData, "getCardData"), self.assertRaises(RuntimeError):
            ALYSION.scrape_cards(GDW.PipelineStats())

    def test_alysion_run_uses_the_same_phases_in_order(self):
        phases = dict(ALYSION.PHASES)
        self.assertEqual(list(phases), GDW.PHASE_NAMES)
        self.assertIs(phases["fetch_links"], ALYSION.fetch_links)
        self.assertIs(phases["scrape_cards"], ALYSION.scrape_cards)
        self.assertIs(phases["merge_cards"], GDW.merge_cards)

    def test_single_set_update_still_finds_alysion_sets(self):
        self.assertIn("BD-05", SINGLE.find_set_entry("BD-05")["url"])
        self.assertIn("BT-04", SINGLE.find_set_entry("BT-04")["url"])


if __name__ == "__main__":
    unittest.main()
