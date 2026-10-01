import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import Mock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "Wiki"))

import CardImageIndex
import garage_sync


class CardImageIndexTests(unittest.TestCase):
    def setUp(self):
        self.temporary_directory = tempfile.TemporaryDirectory()
        self.local = Path(self.temporary_directory.name)
        (self.local / "BT1-001.webp").write_bytes(b"local")
        self.directories = patch.object(CardImageIndex, "LOCAL_IMAGE_DIRECTORIES", (self.local,))
        self.directories.start()
        CardImageIndex._remote_names = None

    def tearDown(self):
        self.directories.stop()
        CardImageIndex._remote_names = None
        self.temporary_directory.cleanup()

    def _garage(self, keys, prefix=""):
        client = Mock()
        client.get_paginator.return_value.paginate.return_value = [{"Contents": [{"Key": key} for key in keys]}]
        return patch.object(garage_sync, "client_from_environment", return_value=(client, "bucket", prefix))

    def test_local_image_found_without_listing_garage(self):
        with self._garage([]) as factory:
            self.assertTrue(CardImageIndex.image_exists("BT1-001.webp"))
        factory.assert_not_called()

    def test_garage_only_image_found_and_listing_cached(self):
        with self._garage(["cards/BT1-002-J.webp"], prefix="cards") as factory:
            self.assertTrue(CardImageIndex.image_exists("BT1-002-J.webp"))
            self.assertFalse(CardImageIndex.image_exists("BT1-003.webp"))
        factory.assert_called_once()

    def test_unconfigured_garage_falls_back_to_local_only(self):
        with patch.object(garage_sync, "client_from_environment", return_value=(None, None, None)):
            self.assertFalse(CardImageIndex.image_exists("BT1-002.webp"))


if __name__ == "__main__":
    unittest.main()
