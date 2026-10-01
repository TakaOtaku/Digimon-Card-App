"""Answers whether a card image exists locally or in the Garage bucket."""

import os
import sys
from pathlib import Path

REPOSITORY_ROOT = Path(__file__).resolve().parents[3]
LOCAL_IMAGE_DIRECTORIES = (
  REPOSITORY_ROOT / "src" / "assets" / "images" / "cards",
  # Converted images are only moved into assets after PrepareCards runs.
  REPOSITORY_ROOT / "scripts" / "python" / "Wiki" / "digimon-images" / "converted",
)

_remote_names = None


def _load_remote_names():
  global _remote_names
  if _remote_names is not None:
    return _remote_names

  sys.path.insert(0, str(REPOSITORY_ROOT / "scripts" / "python"))
  import garage_sync

  client, bucket, prefix = garage_sync.client_from_environment()
  if client is None:
    print("Garage is not configured; checking local card images only.")
    _remote_names = set()
    return _remote_names

  prefix = prefix.strip("/")
  object_prefix = f"{prefix}/" if prefix else ""
  keys = garage_sync.remote_keys(client, bucket, object_prefix)
  _remote_names = {key[len(object_prefix):] for key in keys}
  print(f"Garage index loaded: {len(_remote_names)} card images.")
  return _remote_names


def image_exists(filename):
  """filename is relative to the card image root, e.g. 'BT1-001.webp'."""
  if any(os.path.isfile(directory / filename) for directory in LOCAL_IMAGE_DIRECTORIES):
    return True
  return filename in _load_remote_names()
