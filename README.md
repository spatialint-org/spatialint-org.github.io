# spatialint.com

The landing page, documentation, and blog for
[Spatial Intelligence](https://github.com/spatialint-org/spatial-intelligence) — a geospatial
analysis agent.

Built with [Hugo](https://gohugo.io/). No theme dependency and no Node build: the layout, CSS, and
JS live in this repository. The site uses system fonts only; no font files are included.

## Run locally

```bash
make dev        # hugo server --buildDrafts --disableFastRender
```

Open `http://localhost:1313`. The server reloads on content, layout, and asset changes.

To build the production site:

```bash
make build      # writes public/
```

```bash
make clean
```

## Structure

```text
content/
  docs/              documentation, grouped by section
  blog/              posts
layouts/
  index.html         landing page
  docs/              docs list + single
  blog/              blog list + single
  partials/          head, nav, footer, docs sidebar, post card
  shortcodes/        callout
assets/
  css/main.css       site theme + standard docs theme, light + dark
  css/chroma.css     syntax highlighting (generated)
  js/main.js         theme toggle, nav, docs menu, copy buttons
static/
  app-preview/       HTML/CSS app shell, static map panel, example cells
  demo/              map plates, class layers, blog covers
  images/            OG image and docs images
  CNAME              custom domain
hugo.toml
```

The homepage embeds a real HTML/CSS app preview in an iframe. The Cells and Data tabs work, and
the map panel's layer eyes, opacity sliders, show/hide-all buttons, and layer search work. The
preview reads `data-theme` from the parent page, so it follows the site's light/dark choice. There is
no separate demo page.

The site follows the operating system preference on the first visit. The header toggle switches
between light and dark and stores the choice in `localStorage`; both palettes share the same tokens
in `assets/css/main.css`.

## Add a doc

Create a Markdown file under `content/docs/` and give it front matter:

```yaml
---
title: My page
description: One sentence used in the docs index and meta tags.
weight: 3
date: 2026-11-26
lastmod: 2026-11-26
---
```

Files in a subdirectory with an `_index.md` form a sidebar group. Order pages with `weight`.

## Add a post

Create `content/blog/my-post.md`:

```yaml
---
title: My post
date: 2026-11-26
description: Used as the card excerpt and meta description.
tags: ["project", "geospatial"]
cover: "/demo/cover-flood.jpg"
coverAlt: A short description of the cover
---
```

The newest post is featured on the blog index. Covers are 1200×630; SVG or raster both work.

## App preview

The homepage embeds `static/app-preview/shell.html` in an iframe. It is real HTML/CSS from the app,
not a screenshot: the menu bar, notebook, and status bar use the app's own markup. The map panel is a
lightweight static copy of the GeoLibre map UI; the raster is a static image. The before/after layers
use `static/demo/map-before.webp` and `map-after.webp`; layer eyes, opacity, show/hide-all, and layer
search are wired in `preview-map.js`. `preview.js` adds the three prompt/result pairs, the Data tab,
and parent-theme synchronization.

The preview is intentionally inert beyond tabs and layer controls. Run buttons, menus, and dialogs do
nothing. Re-copy the app's CSS and rendered `#app` markup when the app shell changes.

Framework marks in the model section come from the official PyTorch, ONNX, and Hugging Face
repositories. The ONNX asset is the official mark cropped to its icon; Hugging Face's mark represents
the Transformers library.

`static/demo/projects.json` documents the source questions, results, layers, and files behind the
app-preview examples. The homepage map plates and class overlays were generated from public imagery:

- Flood: Sentinel-2 L2A over Tulare Lake, 2022 and 2023, NDWI difference.
- Buildings: Google satellite z18 over Long Beach, local RT-DETR roof model (app preview).
- Aircraft: Google satellite z18 over the Denver apron, local detector; 145 marked boxes.
- Cropland: Sentinel-2 L2A over Fresno, 20 July 2023; high-vigor mask from NDVI.
- Surface: USDA NAIP 2023 over Denver, k-means on RGB + NDVI (app preview).

## Deploy

`.github/workflows/pages.yml` builds the site with Hugo and publishes `public/` to GitHub Pages on
every push to `main`.

The workflow reads the deployed Pages URL from `actions/configure-pages` and passes it to
`hugo --baseURL`. The same build therefore works at a project URL such as
`https://rahuldshetty.github.io/spatialint-org.github.io/` and at the custom domain. All internal
asset and content URLs are base-path aware.

**Before merging/deploying upstream:**

- Enable Pages for the repository with **Source: GitHub Actions**.
- Confirm the custom domain `spatialint.com` is set in Pages and that `static/CNAME` matches.
- Configure DNS for the apex and `www` records, then enforce HTTPS.
- Ensure the `github-pages` environment allows deployments from `main`.
- Re-run the workflow after enabling Pages; the first run fails at `configure-pages` if Pages is off.
