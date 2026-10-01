import hashlib
import tempfile
import unittest
from pathlib import Path
import sys
from unittest.mock import Mock

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from garage_sync import sync_images


class GarageSyncTests(unittest.TestCase):
    def setUp(self):
        self.temporary_directory = tempfile.TemporaryDirectory()
        self.source = Path(self.temporary_directory.name)
        (self.source / "BT1-001.webp").write_bytes(b"one")
        (self.source / "sub").mkdir()
        (self.source / "sub" / "BT1-002.webp").write_bytes(b"two")
        (self.source / "ignored.jpg").write_bytes(b"not a webp")
        self.client = Mock()
        paginator = self.client.get_paginator.return_value
        paginator.paginate.return_value = [{"Contents": [{"Key": "cards/BT1-001.webp"}]}]

    def tearDown(self):
        self.temporary_directory.cleanup()

    def test_dry_run_lists_existing_and_missing_without_writes(self):
        counts = sync_images(self.client, self.source, "cards", "cards")

        self.assertEqual(counts, {"found": 2, "existing": 1, "uploaded": 0, "planned": 1})
        self.client.put_object.assert_not_called()
        self.client.head_object.assert_not_called()

    def test_apply_uploads_only_missing_key_and_verifies_metadata(self):
        self.client.head_object.return_value = {
            "ContentLength": 3,
            "Metadata": {"Sha256": hashlib.sha256(b"two").hexdigest()},
        }

        counts = sync_images(self.client, self.source, "cards", "cards", apply=True)

        self.assertEqual(counts, {"found": 2, "existing": 1, "uploaded": 1, "planned": 0})
        self.client.put_object.assert_called_once()
        upload = self.client.put_object.call_args.kwargs
        self.assertEqual(upload["Key"], "cards/sub/BT1-002.webp")
        self.assertEqual(upload["ContentType"], "image/webp")
        self.assertEqual(upload["IfNoneMatch"], "*")
        self.client.head_object.assert_called_once_with(Bucket="cards", Key="cards/sub/BT1-002.webp")


if __name__ == "__main__":
    unittest.main()