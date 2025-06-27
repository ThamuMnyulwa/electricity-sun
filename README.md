# Electricity Sun

This repository provides a simple FastAPI backend for performing renewable energy calculations.

## Backend API

The backend code lives in `backend-api/`. To run it locally, execute:

```bash
cd backend-api
./run.sh
```

The `run.sh` script uses the `uv` package manager. Dependencies are defined in `pyproject.toml` before launching the FastAPI server with Uvicorn.

The API exposes two endpoints:

- `POST /calculate` returns a summary of the financial metrics.
- `POST /calculate/detail` returns the same summary plus intermediate values useful for plotting how each parameter impacts the calculation.

A `Dockerfile` is included for deployment with Python 3.12.

## Running tests

Install `pytest` and run the test suite:

```bash
pip install pytest
PYTHONPATH=backend-api pytest
```
