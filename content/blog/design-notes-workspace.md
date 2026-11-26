---
title: "Why the workspace is plain files"
date: 2026-11-12
description: Why the app keeps state in files, declares tools instead of prompting procedures, and treats the map as an output.
tags: ["design", "architecture", "workspace"]
cover: "/demo/cover-workspace.svg"
coverAlt: Map lines and a file tree on paper
---

A geospatial analysis has a longer tail than a chat answer. You come back to the scene next week,
check the cloud mask, and need the raster itself. Those needs shaped the design.

## 1. Files are the state

A workspace is a folder:

```text
workspaces/<name>/
  data/       inputs
  results/    outputs
  maps/       map projects
  traces/     run logs and conversation index
  notebook.ipynb
```

There is no separate analysis database. The map is a JSON document. The outputs are GeoTIFFs,
COGs, GeoJSON, and tables. Run traces are files. If the app is uninstalled, the work is still
readable.

This is less convenient to build than a central store, and it makes some features — multi-user
sharing, server-side search across every workspace — deliberately out of scope for now. The
tradeoff is that a workspace has no migration problem and no hidden ownership.

## 2. Tools are declarations

A tool declares its inputs, whether it can be replayed, whether it needs approval, and how it
reports progress. The registry supplies the rest. The agent sees a consistent contract instead of
a pile of prompt instructions.

```text
@tool(...) on a function
    or on a @pack class method
registered in tools/build.py
```

Visibility, replay safety, approvals, and progress are read from the registry rather than restated
per tool. Adding a capability means adding a declaration, not editing a system prompt and hoping
the model notices.

## 3. Runs are visible

Every prompt, visible assistant note, tool call, and result is recorded. The workspace's
conversation index is searchable, and the agent uses it only when a request refers back to earlier
work. The search itself appears in the trace with its terms and matching excerpts.

Model reasoning is not indexed. That is a deliberate boundary: the record is of work performed,
not of private deliberation. When a result looks wrong, the trace shows the inputs and outputs of
each step.

## 4. The map is an output

It would be easy to let the agent generate a static image and call it a map. Instead, map tools
mutate a real GeoLibre document: layers, styles, legends, swipe comparisons, and saved projects.
The browser renders it; the workspace persists it.

That choice costs complexity in the bridge between the Python process and the iframe. It buys the
ability to hand the map to someone else and have it still be a map.

## 5. Local where it matters

Segmentation and object detection run locally on ONNX Runtime. The model catalog, on-disk store,
residency limits, and idle unload are part of the app, not a cloud service. Weights are
hash-verified and stay under `.models/`.

The language model is the opposite: it is replaceable. The harness resolves a model string and
supports any OpenAI-compatible endpoint. A local Ollama model, a hosted frontier model, and an
internal gateway are configuration, not forks.

## What this rules out, for now

- A shared multi-tenant server. The workspace guard assumes one local user.
- A plugin marketplace. Tool packs are code in the repository.
- A cloud catalog of every run. Traces are local files, searchable per workspace.

Those are reasonable future directions, but they would change the guarantees above. The current
shape is small enough to audit, which is the right starting point for a harness that runs analysis
on your machine.

The [architecture page](/docs/reference/architecture/) has the layer boundaries and the full
workspace layout.
