---
title: FAQ
description: Short answers to the questions that come up first.
weight: 40
date: 2026-11-25
lastmod: 2026-11-26
---

## Where do my results go?

Into the workspace that is open: `results/` for raster and vector outputs, `maps/` for map
projects, `traces/` for run logs. Nothing is uploaded by the app beyond the model requests you
configure.

## Does it work offline?

Partly. Set `GEOAI_OFFLINE=1` to refuse every download. Local files, cached imagery, and models
already in `.models/` still work. Catalog searches and new model downloads do not.

## Can I use a local model?

Yes. Point `OPENAI_BASE_URL` at an OpenAI-compatible server (Ollama, llama.cpp, vLLM, LiteLLM) and
set `GEOAI_MODEL` to the matching model string. With `OPENAI_BASE_URL` set, `OPENAI_API_KEY` is
optional. See [Configuration](/docs/reference/configuration/).

## Why is the first start slow?

The app downloads a pinned `marked` bundle for the UI once, then caches it. Local model weights
download on first use. The first prompt in a fresh environment can also be slower because Python
imports the geospatial stack on demand.

## Why did the agent stop before finishing?

Check the run trace. The two common limits are the request cap (`GEOAI_MAX_REQUESTS`, default 200)
and a model/API failure after the retry cap (`GEOAI_MAX_RETRIES`, default 5). Work already done is
kept; a follow-up prompt can continue it. Tool errors are normally handed back to the agent rather
than ending the run.

## A download failed or a scene is missing. What do I check?

- The data source may require a token or be temporarily unavailable.
- Cloud and date filters may be too strict; ask for a wider search.
- With `GEOAI_OFFLINE=1`, every network fetch is refused by design.

The trace records the search terms and the error the provider returned.

## How do I reset a workspace?

Delete `workspaces/<name>/` while the app is closed (or close the workspace first). Workspaces are
plain folders. Deleting a prompt cell only removes that cell's indexed rows, not the files.

## How do I run the checks?

```bash
make lint     # ruff check .
make test     # pytest -q
make check    # both
```

CI runs the same suite on Python 3.12. New tests are not required for a docs change, but changes to
tool behavior should keep the suite green.

## Is there a packaged release?

The source install is the supported path today. A Linux AppImage build exists under `packaging/`
and can be produced with `make release` where Docker is available. Proper releases and CI
artifacts are planned; the repository is the source of truth until then.
