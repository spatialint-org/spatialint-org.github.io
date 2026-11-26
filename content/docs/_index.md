---
title: Documentation
description: Install Spatial Intelligence, run your first analysis, and understand how the agent, tools, and workspace fit together.
weight: 1
date: 2026-11-25
lastmod: 2026-11-26
---

These pages cover installation, the first workspace, one analysis, and the settings and structure
behind the app.

{{< callout type="tip" >}}
Start with [Installation](/docs/getting-started/), then the
[Quickstart](/docs/getting-started/quickstart/). The
[analysis walkthrough](/docs/guides/analysis-walkthrough/) follows one analysis end to end.
{{< /callout >}}

## What the app is

Spatial Intelligence is a local web application with three parts:

- An agent that plans and runs geospatial tools.
- A workspace on disk for inputs, outputs, maps, and run traces.
- A live map (GeoLibre) that the agent updates as it works.

The model is a setting. The analysis runs against the same open-source geospatial libraries as the
app: rasterio, GeoPandas, Shapely, scikit-image, and others.
