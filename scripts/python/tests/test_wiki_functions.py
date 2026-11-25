import sys
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "Wiki"))

import WikiFunctions as WF


class GetExistingPagesTests(unittest.TestCase):
    def test_maps_normalized_titles_and_drops_missing(self):
        response = {"query": {
            "normalized": [{"from": "BT1-001_A/Rulings", "to": "BT1-001 A/Rulings"}],
            "pages": {
                "1": {"title": "BT1-001 A/Rulings"},
                "-1": {"title": "BT1-002/Rulings", "missing": ""},
            },
        }}
        with patch.object(WF, "api_request", return_value=response):
            self.assertEqual(WF.get_existing_pages(["BT1-001_A/Rulings", "BT1-002/Rulings"]), {"BT1-001_A/Rulings"})

    def test_failed_lookup_counts_as_existing(self):
        with patch.object(WF, "api_request", return_value=None):
            self.assertEqual(WF.get_existing_pages(["BT1-001/Rulings"]), {"BT1-001/Rulings"})


if __name__ == "__main__":
    unittest.main()
