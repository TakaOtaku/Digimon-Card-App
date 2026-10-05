"""Upload card WebP images missing from a Garage S3-compatible bucket."""

from __future__ import annotations

import argparse
import hashlib
import os
from pathlib import Path

import boto3
from botocore.config import Config
from botocore.exceptions import ClientError
from dotenv import load_dotenv


REPOSITORY_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_SOURCE = REPOSITORY_ROOT / "src" / "assets" / "images" / "cards"
LOCAL_ENV_FILE = Path(__file__).resolve().parent / ".env.garage"


def remote_keys(client, bucket: str, prefix: str) -> set[str]:
    keys: set[str] = set()
    paginator = client.get_paginator("list_objects_v2")
    for page in paginator.paginate(Bucket=bucket, Prefix=prefix):
        keys.update(item["Key"] for item in page.get("Contents", []))
    return keys


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as image_file:
        for chunk in iter(lambda: image_file.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def sync_images(
    client,
    source: Path,
    bucket: str,
    prefix: str = "",
    apply: bool = False,
) -> dict[str, int]:
    """Plan or upload WebP objects without replacing keys already in Garage."""
    source = source.resolve()
    if not source.is_dir():
        raise ValueError(f"Image source directory does not exist: {source}")

    prefix = prefix.strip("/")
    object_prefix = f"{prefix}/" if prefix else ""
    images = sorted(path for path in source.rglob("*") if path.is_file() and path.suffix.lower() == ".webp")
    if not images:
        raise ValueError(f"No .webp images found in {source}")

    existing = remote_keys(client, bucket, object_prefix)
    counts = {"found": len(images), "existing": 0, "uploaded": 0, "planned": 0}

    for image in images:
        relative_key = image.relative_to(source).as_posix()
        key = f"{object_prefix}{relative_key}"
        if key in existing:
            counts["existing"] += 1
            print(f"EXISTS  {key}")
            continue

        if not apply:
            counts["planned"] += 1
            print(f"WOULD UPLOAD  {key}")
            continue

        digest = _sha256(image)
        content_type = "image/webp"
        try:
            with image.open("rb") as image_file:
                client.put_object(
                    Bucket=bucket,
                    Key=key,
                    Body=image_file,
                    ContentType=content_type,
                    Metadata={"sha256": digest},
                    IfNoneMatch="*",
                )
        except ClientError as error:
            status = error.response.get("ResponseMetadata", {}).get("HTTPStatusCode")
            if status in (409, 412):
                counts["existing"] += 1
                print(f"EXISTS  {key}")
                continue
            raise

        metadata = client.head_object(Bucket=bucket, Key=key)
        if metadata.get("ContentLength") != image.stat().st_size:
            raise RuntimeError(f"Uploaded object size did not verify: {key}")
        # Garage capitalises user metadata keys (Sha256).
        remote_metadata = {name.lower(): value for name, value in metadata.get("Metadata", {}).items()}
        if remote_metadata.get("sha256") != digest:
            raise RuntimeError(f"Uploaded object checksum did not verify: {key}")
        counts["uploaded"] += 1
        print(f"UPLOADED  {key}")

    return counts


def _create_client():
    required = ("GARAGE_ENDPOINT_URL", "GARAGE_BUCKET", "GARAGE_ACCESS_KEY_ID", "GARAGE_SECRET_ACCESS_KEY")
    missing = [name for name in required if not os.getenv(name)]
    if missing:
        raise ValueError(f"Missing required Garage settings: {', '.join(missing)}")

    return boto3.client(
        "s3",
        endpoint_url=os.environ["GARAGE_ENDPOINT_URL"],
        aws_access_key_id=os.environ["GARAGE_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["GARAGE_SECRET_ACCESS_KEY"],
        region_name=os.getenv("GARAGE_REGION") or "garage",
        config=Config(
            signature_version="s3v4",
            s3={"addressing_style": os.getenv("GARAGE_ADDRESSING_STYLE") or "path"},
        ),
    )


def client_from_environment():
    """Return (client, bucket, prefix), or (None, None, None) when Garage is not configured."""
    load_dotenv(LOCAL_ENV_FILE, override=False)
    if not os.getenv("GARAGE_BUCKET"):
        return None, None, None
    return _create_client(), os.environ["GARAGE_BUCKET"], os.getenv("GARAGE_KEY_PREFIX", "")


def main() -> int:
    load_dotenv(LOCAL_ENV_FILE, override=False)
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE, help="Directory containing card WebP files")
    parser.add_argument("--apply", action="store_true", help="Upload missing objects; without this, only show a dry run")
    args = parser.parse_args()

    try:
        client = _create_client()
        bucket = os.environ["GARAGE_BUCKET"]
        counts = sync_images(
            client,
            args.source,
            bucket,
            os.getenv("GARAGE_KEY_PREFIX", ""),
            apply=args.apply,
        )
    except (ValueError, ClientError, RuntimeError) as error:
        parser.error(str(error))

    mode = "Upload complete" if args.apply else "Dry run complete"
    print(
        f"{mode}: {counts['found']} found, {counts['existing']} already present, "
        f"{counts['uploaded']} uploaded, {counts['planned']} planned."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())