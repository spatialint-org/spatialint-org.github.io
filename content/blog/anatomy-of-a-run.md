---
title: "How a run works: finding buildings in an image"
date: 2026-11-20
description: "One building-detection run, step by step: image, local model, threshold, map, and files."
tags: ["walkthrough", "detection", "buildings"]
cover: "/demo/cover-buildings.jpg"
coverAlt: Aerial image of Long Beach with large building footprints marked
---

The building-detection example is a run between an image and a map. This post describes what happens
between the two.

![Large buildings in Long Beach with detection boxes](/demo/long-beach-detections.jpg)

*Imagery: Google satellite z18. Boxes: a local RT-DETR roof model at a 0.40 confidence threshold.*

## The question

> Find the large buildings in this Long Beach block and map each footprint.

The image is a four-block crop of a residential area. The goal is not every roof; it is the large
structures that are easy to find and useful for an inventory.

## The run

1. **Crop the image.** The source is a Google satellite image at z18, about 0.5 m per pixel. The crop
   is 2000 × 1125 pixels and covers roughly 2 km × 1.1 km.
2. **Load a local model.** The run uses an RT-DETR model trained on satellite roof imagery. The
   weights are stored locally; the image does not leave the machine.
3. **Detect at a threshold.** The model returns candidate boxes. The run keeps boxes at 0.40
   confidence or higher. That threshold is visible in the output.
4. **Draw the boxes.** The boxes are added to the map as a vector layer and written as GeoJSON.
5. **Inspect the result.** The map shows 15 boxes. Larger apartment and school buildings are found;
   the smaller houses are not. That is the expected result at this threshold and image scale.

## What the output is

The workspace contains an ordinary file set:

```text
data/
  long-beach-z18.jpg
results/
  large_buildings.geojson
maps/
  long-beach-buildings.geolibre.json
traces/
  run.jsonl
```

The GeoJSON stores one box per detection with the confidence. The map project keeps the layer and
view. The trace records the steps above.

## Limits

This is one image and one threshold. It is a roof model, not a land-cover classifier, and it does not
claim to find every building. Raise or lower the threshold and the count changes. For an operational
inventory, validate against a sample and use a source with better geometry.

The point of the example is the shape of the work: a question, a local model, a threshold, a map,
and files that can be checked later.
