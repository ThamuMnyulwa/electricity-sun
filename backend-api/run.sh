#!/bin/bash
# Run FastAPI app locally

if [ -d ".venv" ]; then
  source .venv/bin/activate
fi

uvicorn app.main:app --host 0.0.0.0 --port 8000
