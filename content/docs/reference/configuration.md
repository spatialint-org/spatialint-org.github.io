---
title: Configuration
description: Model, paths, and runtime settings for the app and the agent.
weight: 1
date: 2026-11-25
lastmod: 2026-11-26
---

Settings come from `.env` in the data root (loaded at startup) and from **File → Settings**, which
persists the model, theme, retry cap, and step recording to `settings.json`.

## Model

| Variable | Default | Purpose |
| --- | --- | --- |
| `OPENAI_API_KEY` | — | Provider key (OpenAI, Azure, or a compatible endpoint). |
| `OPENAI_BASE_URL` | — | Custom OpenAI-compatible endpoint (Azure OpenAI, LiteLLM, vLLM, llama.cpp, Ollama, OpenRouter, DeepSeek). With it set, the key is optional. |
| `GEOAI_MODEL` | `openai:gpt-4o` | Model string, e.g. `anthropic:claude-sonnet-4-5`, `google-gla:gemini-2.5-pro`, `ollama:llama3.1`. |
| `GEOAI_MAX_RETRIES` | `5` | Attempts for a transient model/API failure before a run is reported as failed. Tool errors are handed to the agent instead. |
| `GEOAI_MAX_REQUESTS` | `200` | Model requests one run may spend before it stops cleanly, keeping the work already done. Raise it for a long analysis. |
| `GEOAI_CONTEXT_WINDOW` | resolved from the model id | The window in tokens compaction targets (half of it) and where the app stops a run whose history no longer fits. Set it for a self-hosted endpoint whose model id no registry describes. |

A minimal `.env`:

```bash
OPENAI_API_KEY=sk-...
GEOAI_MODEL=openai:gpt-4o
```

An OpenAI-compatible local endpoint:

```bash
OPENAI_BASE_URL=http://127.0.0.1:11434/v1
GEOAI_MODEL=ollama:llama3.1
```

## Paths and storage

| Variable | Default | Purpose |
| --- | --- | --- |
| `GEOAI_HOME` | the checkout root in a dev clone, else `~/.local/share/spatial-intelligence` | Data root: `workspaces/` (including `workspaces/tools.json`), `settings.json`, `.env`, `.models/`, `.skills/`. |
| `GEOAI_MODELS_DIR` | `<GEOAI_HOME>/.models` | Where models and weights are cached. |
| `GEOAI_SKILLS_DIR` | `<GEOAI_HOME>/.skills` | Per-machine skills cache; the shipped trees live in the package. |
| `GEOAI_OFFLINE` | off | Set to `1` to refuse every download. |
| `HF_TOKEN` | — | Hugging Face token, for gated repositories. |

## Runtime

| Variable | Default | Purpose |
| --- | --- | --- |
| `GEOAI_PORT` | `8000` | HTTP port. |
| `GEOAI_NO_BROWSER` | off | Set to `1` to skip opening the browser on start. |
| `GEOAI_MODEL_CACHE_SIZE` | `2` | Local models kept in memory at once. |
| `GEOAI_MODEL_TTL` | `300` | Seconds a loaded model may stay idle before it can be unloaded. |
| `GEOAI_ONNX_THREADS` | up to 4 | ONNX Runtime threads for local models. |
| `GEOAI_WORKSPACE` | — | Default workspace name to open. |

## In-app settings

**File → Settings** persists the model, theme, retry cap, context window, and step recording to
`settings.json`. Keeping `record_agent_steps` on is what makes runs inspectable in the notebook
and searchable later.

The sliders button beside Settings opens **Tool Configuration**:

- **Tools** enables or disables tool categories, including object detection, segmentation, and
  image analysis.
- **Python runtime** controls which packages `run_python` may import and which helpers it exposes.
- **Scope** chooses where Save writes: **Global** writes `<data root>/workspaces/tools.json`;
  **This workspace** writes `tools.json` inside the workspace and overrides the global file.

Some tools stay enabled because the system prompt depends on them. Harness capabilities such as
planning, tool search, and web search are always available. `search_conversation_history` is also
locked: follow-up questions must be able to reach earlier prompts and results.

**Dangerous mode** (the toggle at the right of the menu bar) lifts the sandbox guard. Leave it off
unless you are deliberately running your own code.
