import sys
import unittest
from contextlib import redirect_stdout
from io import StringIO
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

from bs4 import BeautifulSoup

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "Wiki"))

import GetCardImages as GCI

BOOSTER = "BT-24: BOOSTER TIME STRANGER"
CARD = "BT24-034"

# Rows as the card page gives them: ids are provisional ("_P1"), they only say which table row it is
TABLE_ROWS = [
    {"id": "_P1", "note": BOOSTER, "illustrator": "Tonamikanji", "type": "Alternative Art"},
    {"id": "_P2", "note": BOOSTER, "illustrator": "Tonamikanji", "type": "Special Rare"},
]
# What the last good run produced for the same card
PREVIOUS = [
    {"id": CARD + "_P1", "note": BOOSTER, "illustrator": "Tonamikanji", "type": "Alternative Art"},
    {"id": CARD + "_P2", "note": BOOSTER, "illustrator": "Tonamikanji", "type": "Special Rare"},
]


def gallery(*image_keys):
    items = "".join(
        f'<div class="wikia-gallery-item"><img data-image-key="{key}.png" src="https://example.invalid/latest">'
        f'<div class="lightbox-caption"><a>{BOOSTER}</a></div></div>'
        for key in image_keys
    )
    return BeautifulSoup(f'<div id="gallery-0">{items}</div><div id="gallery-1"></div>', "html.parser")


class FailedGalleryTests(unittest.TestCase):
    def run_images(self, galleries, previous=None, retries=2):
        """galleries: what iter_pages_html returns per attempt (a soup, or None for a failed fetch)."""
        card = SimpleNamespace(id=CARD, notes="Base release", AAs=[dict(r) for r in TABLE_ROWS], JAAs=[])
        attempts = [[("Gallery", soup)] for soup in galleries]
        with patch.object(GCI.WV, "cards", [card]), \
             patch.object(GCI.WV, "cardLinks", ["/wiki/" + CARD]), \
             patch.object(GCI.WV, "previousPrints", previous if previous is not None else {}), \
             patch.object(GCI.WF, "iter_pages_html", side_effect=attempts) as fetch, \
             patch.object(GCI, "download_image_with_retry"), \
             patch.object(GCI.time, "sleep") as sleep, \
             redirect_stdout(StringIO()):
            GCI.getCardImages(retries)
            links_after = list(GCI.WV.cardLinks)
        return card, fetch.call_count, sleep, links_after

    def test_failed_gallery_restores_the_previous_prints(self):
        card, _, _, _ = self.run_images([None], {CARD: (PREVIOUS, [])}, retries=0)
        self.assertEqual([aa["id"] for aa in card.AAs], [CARD + "_P1", CARD + "_P2"])
        self.assertEqual([aa["type"] for aa in card.AAs], ["Alternative Art", "Special Rare"])

    def test_failed_gallery_never_leaves_provisional_ids(self):
        # No record of an earlier run: the table rows ("_P1") must not survive as prints
        card, _, _, _ = self.run_images([None], {}, retries=0)
        self.assertEqual(card.AAs, [])

    def test_failed_gallery_is_retried_after_a_pause(self):
        card, calls, sleep, links = self.run_images([None, gallery(CARD + "_P1", CARD + "_P2")], {CARD: (PREVIOUS, [])})
        self.assertEqual(calls, 2)
        sleep.assert_called_with(60)
        self.assertEqual([(aa["id"], aa["type"]) for aa in card.AAs], [(CARD + "_P1", "Alternative Art"), (CARD + "_P2", "Special Rare")])
        self.assertEqual(links, ["/wiki/" + CARD])

    def test_gives_up_after_the_retries_and_keeps_previous_prints(self):
        card, calls, _, links = self.run_images([None, None, None], {CARD: (PREVIOUS, [])})
        self.assertEqual(calls, 3)
        self.assertEqual([aa["id"] for aa in card.AAs], [CARD + "_P1", CARD + "_P2"])
        self.assertEqual(links, ["/wiki/" + CARD])

    def test_half_read_gallery_keeps_previous_prints(self):
        class Broken(BeautifulSoup):
            def find(self, *args, **kwargs):
                raise RuntimeError("page changed")

        card, _, _, _ = self.run_images([Broken("<div></div>", "html.parser")], {CARD: (PREVIOUS, [])}, retries=0)
        self.assertEqual([aa["id"] for aa in card.AAs], [CARD + "_P1", CARD + "_P2"])


if __name__ == "__main__":
    unittest.main()
