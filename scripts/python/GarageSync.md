# Garage Card Image Sync

`garage_sync.py` syncs `.webp` files from `src/assets/images/cards` to a Garage S3-compatible bucket. It preserves relative paths under `GARAGE_KEY_PREFIX`, defaults to a dry run, and does not replace existing keys. Uploads use S3's conditional `If-None-Match: *` request and verify the returned object size and SHA-256 metadata.

The frontend builds image URLs as `cardImageBaseUrl + <file name>` (`https://web-garage.takaotaku.de/BT1-001.webp`), so objects live at the bucket root: leave `GARAGE_KEY_PREFIX` empty unless the public URL changes too.

On the `coolify` branch, card images are not tracked in Git (`src/assets/images/cards/` is ignored). The Wiki pipeline checks `CardImageIndex`, which looks at local files and the Garage bucket listing, to decide which images to download and which `-J`/`-Sample` fallback path each card uses. Without Garage credentials, it only sees local files and will re-download images and choose wrong fallbacks.

## Local Setup

1. Install the Python dependencies from the repository root:

   ```powershell
   c:\Repositories\Digimon-Card-App\venv\Scripts\python.exe -m pip install -r scripts\python\requirements.txt
   ```

2. Fill in `scripts/python/.env.garage` locally. This file is ignored by Git. Keep the access key restricted to listing and writing the intended bucket/prefix; do not add a write key to Angular configuration or browser code.

3. Run a dry run first:

   ```powershell
   c:\Repositories\Digimon-Card-App\venv\Scripts\python.exe scripts\python\garage_sync.py
   ```

4. Review the missing object keys and confirm the public URL mapping. Only then upload:

   ```powershell
   c:\Repositories\Digimon-Card-App\venv\Scripts\python.exe scripts\python\garage_sync.py --apply
   ```

The command uploads only `.webp` files. It does not remove remote objects or replace keys that already exist. Do not run concurrent syncs unless the deployed Garage version has been verified to enforce conditional writes.

## GitHub Secrets

The **Update Cards** workflow ([update-cards.yaml](../../.github/workflows/update-cards.yaml)) fails early without Garage secrets. After the pipeline runs, it uploads missing images with `garage_sync.py --apply` before committing card data.

In GitHub, open the repository, choose **Settings** → **Secrets and variables** → **Actions**:

- **Secrets** tab → **New repository secret**: `GARAGE_ENDPOINT_URL`, `GARAGE_BUCKET`, `GARAGE_ACCESS_KEY_ID`, `GARAGE_SECRET_ACCESS_KEY`.
- **Variables** tab (optional): `GARAGE_REGION` (default `garage`), `GARAGE_ADDRESSING_STYLE` (default `path`), `GARAGE_KEY_PREFIX` (default empty).

The endpoint must be Garage's S3 API port (usually `3900`), reachable from GitHub runners, not the public web endpoint. Create a key with only read/write on the card bucket (`garage key create` + `garage bucket allow --read --write`). Never commit values or paste credentials into chat, issues, or logs.

## Tests

Run the offline behavior checks with:

```powershell
c:\Repositories\Digimon-Card-App\venv\Scripts\python.exe -m unittest discover -s scripts\python\tests
```