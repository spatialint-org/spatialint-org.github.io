---
title: Quickstart
description: Open a workspace, import data, and finish your first analysis.
weight: 2
date: 2026-11-25
lastmod: 2026-11-26
---

This walkthrough takes about ten minutes. It assumes the app is running at
`http://127.0.0.1:8000` and a model is configured.

## 1. Create a workspace

A workspace is the folder the agent reads and writes. Choose **File → New workspace**, give it a
name, and pick a starting point:

- **Blank** — an empty workspace and an empty notebook. Best for your own prompt.
- **Segmentation** — segment features in imagery with a chosen model and AOI.
- **Detection** — detect known objects (cars, boats, buildings) in high-resolution imagery.
- **Change detection** — compare two dates over an AOI and map what changed.

The guided types walk through **Type → Configure → Review**. They write two cells: a record of the
setup and a prompt that the agent can run immediately.

![New workspace dialog with Blank, Segmentation, Detection, and Change detection options](/images/wizard-2x.webp)

## 2. Import data (optional)

Open the **Data** tab. You can:

- **Import files** or **Import folder** from disk.
- **Add from URL** to download a raster or vector into `data/`.
- **Drop files** onto the import area.

Imports land in `data/` and are picked up by the agent automatically. If your question is about a
public dataset, you can skip this step and let the agent search a catalog.

## 3. Ask a question

Open the **Cells** tab, add a **Prompt** cell, and describe the result. Concrete examples:

> Find a recent Sentinel-2 scene over Phewa Lake, Nepal with under 10% cloud, clip it to the lake,
> compute NDVI, and map it.

> Segment the fields, water and buildings in `data/scene.tif` and show the polygons.

> How much of the AOI burned between these two dates?

Press **Run**. The cell streams its progress: planning, tool calls, and results. Long operations
report progress; if a choice would change the result, the agent can pause and ask a structured
question.

{{< callout type="note" >}}
The default request cap is 200 model requests per run, and the default retry cap is 5. A
fetch-then-tile-then-map run can legitimately use dozens of steps. Raise `GEOAI_MAX_REQUESTS` for
a long analysis.
{{< /callout >}}

## 4. Inspect the results

Outputs are written to the workspace and appear in the **Data** tab in the same turn:

```text
workspaces/<name>/
  data/       inputs: imports and downloads
  results/    outputs: GeoTIFF/COG, GeoJSON, tables
  maps/       saved GeoLibre map projects
  traces/     per-cell run logs and the conversation index
  notebook.ipynb
```

The **map** on the left is live. Pan, zoom, toggle layers, and restyle them. The agent's map state
is saved into the workspace's map project.

## 5. Try Python

Add a **Python** cell to run a snippet directly in the same sandbox the agent uses. This is the
escape hatch when no tool fits — the geospatial stack is importable, and generated code can read
the same workspace files.

## Where to go next

- Follow a full example in the [analysis walkthrough](/docs/guides/analysis-walkthrough/).
- Tune models, paths, and runtime in [Configuration](/docs/reference/configuration/).
- Read how the pieces fit in [Architecture](/docs/reference/architecture/).
