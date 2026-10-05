---
description: 'Safety and testing guidance for card-data Python scripts'
applyTo: 'scripts/python/**/*.py'
---

# Python Script Instructions

## Project Context
- Python utilities live in the frontend repository under `scripts/python`; this is a separate repo from the Express backend.
- Dependencies are declared in `scripts/python/requirements.txt`.
- Wiki workflows use repo-root-relative paths and can download files, rewrite card JSON/assets, move images, and delete temporary PNGs.
- `UpdateUserDecks.py` performs remote bulk writes. Treat it as production-affecting unless a test target is explicitly configured.

## Safety
- Before running a script, trace its network requests, inputs, output paths, and destructive effects.
- Never run a remote-write, in-place rewrite, file-move, or deletion script against real data as a test. Use temporary fixtures, mocks, or a disposable service.
- Keep network calls bounded in tests; mock external APIs by default.
- Do not add credentials to source, card data, Angular environment files, logs, or committed configuration. Use environment variables or the ignored `scripts/python/.env.garage` file.
- Garage image sync is opt-in: run `python scripts/python/garage_sync.py` for a dry run; `--apply` requires explicit user approval and a confirmed bucket/key mapping.
- Preserve existing generated and staged card data. Do not regenerate assets unless that is the requested operation.

## Validation
- Run Python tests with `python -m unittest discover -s scripts/python/tests`.
- Run static syntax checks only after checking whether they would recreate tracked or staged bytecode files.
- Validate output-producing scripts against temporary copies and inspect the resulting diff before accepting generated data.
- Report scripts that need unavailable inputs, secrets, or live services instead of substituting production endpoints or credentials.