---
title: Introducing Spatial Intelligence
date: 2026-11-25
description: A local geospatial agent that finds imagery, runs analysis, and leaves a map and files.
tags: ["project", "geospatial", "agents"]
cover: "/demo/cover-flood.jpg"
coverAlt: Sentinel-2 view of the 2023 Tulare Lake flood in California
---

Spatial Intelligence started from a simple frustration: geospatial questions arrive as outcomes,
but the tools require procedures.

*“Map the flooded area in this AOI and measure the fields it hit”* is a sentence a person can say.
Turning it into work means finding a scene, filtering clouds, clipping, computing an index,
choosing a classification threshold, checking the result, and styling a map. Each step is
reasonable. Together they are a GIS session.

This project lets a question be the input. The agent plans the steps, calls geospatial tools, and
shows its progress. At the end you get normal files and a live map, not only a chat transcript.

![Large buildings in a Long Beach block marked with detection boxes](/demo/long-beach-detections.jpg)

*The building-footprint example. Imagery: Google satellite z18; boxes: a local RT-DETR model.*

Three completed analyses — a flood extent, a building-footprint detection, and a surface
classification — are also available on the [homepage preview](/#app). Toggle a layer or inspect a
box; the data is real even though no model runs in the browser.

## What it does today

The harness has tools for the work a GIS analyst actually does:

- **Find data.** STAC catalogs (Sentinel-1 and 2, Landsat, NAIP, DEMs), ArcGIS Hub services, NASA
  GIBS, USGS 3DEP, Vantor, and OpenAerialMap. Local imports and URL downloads too.
- **Analyze rasters.** Clip, reproject, rescale, spectral indices, zonal statistics, terrain,
  contours, polygonize, RGB composites, and COG conversion.
- **Analyze vectors.** Buffer, clip, dissolve, overlay, joins, selections, aggregation, grids,
  Voronoi, and geometry repair.
- **Run local models.** Segmentation and object detection on ONNX Runtime, with hash-verified
  weights that stay on the machine.
- **Author a map.** Layers, styling, heatmaps, swipe comparison, and saved projects in GeoLibre.

The agent can also run Python against the same stack when no tool fits. That matters: it means a
new model or an odd format does not require a new release, only a snippet.

## Three decisions that shape it

**The workspace is the state.** Every input, output, map project, and run trace is a file under
`workspaces/<name>/`. There is no hidden analysis database to migrate. If you want to keep the
work, copy the folder.

**Tool calls are visible.** The notebook streams planning, tool calls, and results. Run traces keep
the record. When something looks wrong, you can inspect the step instead of guessing.

**The model is replaceable.** The harness speaks model strings, not a single vendor. OpenAI,
Anthropic, Gemini, and any OpenAI-compatible endpoint work — including a local Ollama server.
Local segmentation and detection run without a model provider at all.

## What is still early

This is a young project, and the site reflects that. The docs cover installation, a quickstart,
one full analysis, configuration, and architecture — enough to run it and understand the shape of
the system. Releases, packaging, and broader CI are still ahead.

If you try it, the most useful feedback is a run that did not go the way you expected: the prompt,
the trace, and the output. That is the material this project improves from.

Start with [Installation](/docs/getting-started/) or read the
[analysis walkthrough](/docs/guides/analysis-walkthrough/).
