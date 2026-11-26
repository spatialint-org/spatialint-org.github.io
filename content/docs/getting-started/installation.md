---
title: Installation
description: Clone the repo, create the Python environment, and start the app locally.
weight: 1
date: 2026-11-25
lastmod: 2026-11-26
---

## Requirements

- **Python 3.11 or newer.**
- **Network access on first start.** The app fetches a pinned UI dependency and downloads local
  model weights on first use.
- `make` is convenient but not required. `uv` is used when present; a plain `python -m venv`
  fallback works too.

GDAL ships inside `rasterio`, so you do not need a system GDAL install. Do not install the `gdal`
PyPI package: it publishes no wheels and nothing in the app imports the `osgeo` bindings.

## Install from source

```bash
git clone https://github.com/spatialint-org/spatial-intelligence.git
cd spatial-intelligence
make venv                  # creates .venv and installs the package editable
cp .env.example .env       # then set OPENAI_API_KEY (or your endpoint)
```

`make venv` is idempotent: it creates `.venv` only if missing, then installs the package and the
dev dependency group. The interpreter doubles as the "environment is ready" marker.

### Start the app

```bash
make dev
```

The browser opens at `http://127.0.0.1:8000`. Set `GEOAI_NO_BROWSER=1` if you only want the server.

On Windows, `make dev` works from Git Bash or another make-equipped shell. If you prefer to run
the interpreter directly:

```powershell
.venv\Scripts\python.exe -m spatial_intelligence.server
```

On macOS and Linux:

```bash
.venv/bin/python -m spatial_intelligence.server
```

## Configure a model

Settings come from `.env` in the data root and are loaded at startup. At minimum, choose a
provider and a model:

```bash
OPENAI_API_KEY=sk-...
GEOAI_MODEL=openai:gpt-4o
```

Any OpenAI-compatible endpoint works. With `OPENAI_BASE_URL` set, the API key is optional — this
is the path for Azure OpenAI, LiteLLM, vLLM, llama.cpp, Ollama, OpenRouter, and similar gateways.

```bash
OPENAI_BASE_URL=http://127.0.0.1:11434/v1
GEOAI_MODEL=ollama:llama3.1
```

See [Configuration](/docs/reference/configuration/) for every environment variable and the
settings that persist through the UI.

{{< callout type="warning" >}}
**`OPENAI_API_KEY` already exported in your shell wins over `.env`.** The app prints a notice when
that happens. If a model call fails unexpectedly, check which key your shell actually provides.
{{< /callout >}}

## Optional: research libraries

Local segmentation and object detection are part of the base install. The optional `geoai` extra
adds PyTorch, torchgeo, terratorch, and transformers for heavier research workflows inside the
`run_python` sandbox:

```bash
uv pip install -e ".[geoai]"
```

That is a large download. On a CUDA machine, install `torch` from the CUDA index you want before
this extra; the CPU wheel is what a plain install receives.

## First start

The first start downloads the pinned `marked` bundle for the UI (cached afterwards). Local model
weights download only when you run segmentation or detection — about 40 MB for segmentation and
26 MB for detection. Weights are hash-verified and stored in `.models/`.

If startup is slow or the UI looks unstyled, check that the first-run download completed. The
app keeps its data under `GEOAI_HOME`; in a development checkout that is the repository root.

## Verify the install

```bash
make check       # ruff and the pytest suite, the same checks CI runs
```

If the app starts and the browser shows **Start a workspace**, you are ready for the
[Quickstart](/docs/getting-started/quickstart/).
