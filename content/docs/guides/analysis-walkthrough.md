---
title: Analysis walkthrough
description: A Sentinel-2 scene from catalog search to a mapped NDVI result.
weight: 1
date: 2026-11-25
lastmod: 2026-11-26
---

This is one complete run, using the example from the README. The point is not the exact scene —
imagery changes daily — but the shape of the work: search, download, analyze, map, and keep the
files.

## The prompt

Create a **Blank** workspace named `phewa-ndvi`, then add a prompt cell:

> Find a recent Sentinel-2 scene over Phewa Lake, Nepal with under 10% cloud, clip it to the lake,
> compute NDVI, and map it.

Run the cell. Everything below streams into the notebook while it happens.

## What the agent does

1. **Resolve the place.** A geocode call turns “Phewa Lake, Nepal” into an area of interest. The
   AOI appears on the map; you can adjust it before a long download if you want.
2. **Search a catalog.** The agent queries a STAC catalog for Sentinel-2 scenes intersecting the
   AOI, filtered by date and cloud cover.
3. **Pick and fetch a scene.** It chooses a scene, then reads only the window it needs over HTTP
   range requests where the source is a COG, instead of downloading every band for the whole tile.
4. **Clip and index.** The scene is clipped to the AOI and a spectral-index tool computes NDVI.
5. **Map the result.** The raster is added to the live map with a colormap and legend. If the
   GeoTIFF the map needs is striped rather than tiled, the agent converts a copy to COG first.
6. **Keep the evidence.** The run trace records each tool call and its result; the notebook keeps
   the visible steps. Outputs are written under `results/`.

The trace's tool names are the quickest way to see what happened. In a run like this, expect
`geocode`, `search_data`, `download_data`, `clip`, `spectral_index`, `add_raster`, and `save_map`,
plus `to_cog` if a conversion was required.

## What you have at the end

The workspace contains ordinary files, not opaque records:

```text
workspaces/phewa-ndvi/
  data/                 downloaded scene bands (or the window used)
  results/              clipped scene, NDVI GeoTIFF/COG, optional stats
  maps/                 map project with the NDVI layer and legend
  traces/               run log and searchable conversation index
  notebook.ipynb        prompt, visible steps, and results
```

Filenames are chosen per run, so inspect the Data tab rather than expecting a fixed name. The
georeferencing is preserved: outputs open in QGIS, GeoLibre, or any other raster reader.

## A useful follow-up

Once the NDVI layer exists, ask a question about it in the same workspace:

> Summarize NDVI inside the lake polygon and write a CSV with mean, p10, and p90.

The agent already knows the workspace and can recall the earlier run, because every prompt, note,
tool call, and result is indexed for the workspace. It searches that index only when a request
refers back to earlier work. The search appears in the trace with its terms and matching excerpts.

![Large buildings in Long Beach with detection boxes](/demo/long-beach-detections.jpg)

*A different run — building detection over Long Beach. The pattern is the same: an image, a model,
a map layer, and files on disk.*

## Things that commonly surprise people

- **The first run is slower.** The app may fetch the UI dependency and model weights; later runs
  use the cache.
- **Cloud filtering is a preference, not a guarantee.** If no scene meets the filter, the agent may
  ask or pick the closest option. Check the trace.
- **The map is not a screenshot.** It is a real map document in `maps/`; reopening the workspace
  restores it.
- **Want to work offline?** Set `GEOAI_OFFLINE=1` to refuse every download. Local files and already
  cached data still work.
