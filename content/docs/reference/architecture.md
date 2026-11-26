---
title: Architecture
description: How the harness, tool registry, workspace, and web UI fit together.
weight: 2
date: 2026-11-25
lastmod: 2026-11-26
---

The app is a FastAPI server with a browser front end. The browser talks HTTP and SSE; every
geospatial operation happens in the Python process on the machine running the app.

## Dependency direction

Imports point one way. A module may depend on the layer to its left, never the reverse:

```text
contracts ← services ← tools ← agent ← session ← server
                                      ↑
                                   web/ (HTTP + SSE only)
```

- **contracts** — types shared by every layer: effects, progress jobs, errors.
- **settings** — data root, `.env`, model resolution, persisted settings.
- **workspace** — the workspace tree, notebook document, run traces, file I/O.
- **map** — the live GeoLibre document, snapshots, styles, iframe bridge.
- **geo** — rasterio and GeoPandas services, open-data catalog clients.
- **ai** — model catalog, on-disk store, residency, segmentation and detection.
- **pythonruntime** — `run_python` sandbox, output store, API help, skills reader.
- **skills** — API references for heavy packages (authored and generated).
- **tools** — the tool registry (`@tool`/`@pack`) and its packs.
- **agent** — prompt, model resolution, run loop, interaction protocol.
- **session** — notebook session, run queue, progress jobs, event bus.
- **server** — FastAPI app factory, routers, asset bootstrap.
- **web** — browser front end (ES modules and stylesheets).

## Tools are declarations

A tool is a function marked with `@tool(...)`, or a method on a `@pack` class, registered in
`tools/build.py`. The registry supplies visibility, replay safety, approval requirements, and
progress reporting. Calling code does not restate those policies per tool.

That is why the tool list can stay legible: a tool's signature and annotations describe what it
needs, and the harness reads the rest from the registry.

## The workspace is the boundary

Tool paths are confined to the active workspace. Writes go under `results/`, `maps/`, or `data/`
only. The layout is:

```text
workspaces/<name>/
  data/                 inputs: imports, downloads, dropped files
  results/              outputs: GeoTIFF/COG, GeoJSON, tables
  maps/                 saved .geolibre.json map projects
  traces/               per-cell agent run logs
    conversation.db     searchable index of prompts, notes, tool calls, results
  notebook.ipynb        cells, plus recorded agent steps
  workspace.json        manifest: outputs and version
```

The conversation index opens when its workspace opens and closes when the workspace changes.
Deleting a prompt cell deletes its indexed rows. Model reasoning is not indexed; prompts, visible
assistant notes, tool calls, and results are.

## The map bridge

The left pane is a GeoLibre map inside an iframe. The agent does not manipulate the DOM directly:
it calls map tools, which update the live document and persist state to `maps/`. The browser
receives updates over SSE and renders them. Snapshots and styles travel through the same bridge.

This keeps the map a real output: you can save it, reopen it, or export it, without the agent
holding a screenshot as the source of truth.

## Runtime boundaries

- **Python sandbox.** `run_python` runs generated code with a curated package surface and no
  network. Helper methods such as `ws.*`, `vision.ask`, and `models.*` are exposed by configuration.
- **Local models.** ONNX Runtime runs segmentation and detection; residency is bounded by
  `GEOAI_MODEL_CACHE_SIZE` and idle unload by `GEOAI_MODEL_TTL`.
- **Network.** Catalog clients and downloads use the machine's network. `GEOAI_OFFLINE=1` refuses
  every download, including model fetches.
- **Files.** The workspace guard confines reads and writes; dangerous mode lifts it deliberately.

## Packaging note

GDAL ships inside `rasterio`; the `osgeo` bindings are not used. The optional `geoai` extra is the
only extra because PyTorch is large and a CUDA machine needs a different wheel index. The AppImage
build is separate from the source install; see `packaging/` in the repository.
