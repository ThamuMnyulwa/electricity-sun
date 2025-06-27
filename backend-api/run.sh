#!/usr/bin/env bash
set -e

# Ensure uv is available
if ! command -v uv >/dev/null 2>&1; then
  pip install --no-cache-dir uv
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

uv pip install --no-cache-dir --system -r pyproject.toml
uvicorn app.main:app --host 0.0.0.0 --port 8000
