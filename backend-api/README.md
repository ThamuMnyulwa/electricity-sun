# Electricity Sun

This repository provides a FastAPI backend for performing renewable energy calculations. It is designed to serve as the backend for the `frontend-site` application, enabling users to estimate the financial and technical benefits of solar and battery systems.

## Overview

The backend exposes a simple REST API that receives detailed energy and cost parameters, performs calculations, and returns results for solar and battery storage scenarios. The API is intended to be consumed by the frontend web application, but can also be used directly for integration or testing.

he API exposes two endpoints:

- `POST /calculate` returns a summary of the financial metrics.
- `POST /calculate/detail` returns the same summary plus intermediate values useful 
for plotting how each parameter impacts the calculation.

## API Endpoints

- `POST /calculate`  
  Accepts: `CalculationInput` (JSON)  
  Returns: `CalculationResult` (summary of financial metrics)

- `POST /calculate/detail`  
  Accepts: `CalculationInput` (JSON)  
  Returns: `CalculationDetail` (summary plus intermediate values for deeper analysis)

### Example Input (`CalculationInput`)
- Average load (kW)
- Peak hours per day
- Depth of discharge
- Solar PV system size
- Tariffs (off-peak, standard, peak, feed-in)
- Battery cost, efficiency, cycles, and more

### Example Output
- Required battery capacity
- Total battery cost
- Annual savings
- Simple payback period
- Levelized cost of storage
- Solar generation and export values

## Calculation Logic

The core logic is implemented in `calculator.py` using Pydantic models for input validation. The API computes:
- Battery and solar system sizing
- Cost savings from energy arbitrage and solar self-consumption
- Payback period and levelized cost
- Intermediate values for detailed analysis (via `/calculate/detail`)

## Usage

To run locally:
```bash
cd backend-api
./run.sh
```

Or build and run with Docker (Python 3.12):
```bash
docker build -t solarcalc-backend .
docker run -p 8000:8000 solarcalc-backend
```

## Running tests

Install `pytest` and run the test suite:
```bash
pip install pytest
PYTHONPATH=backend-api pytest
```

---

This backend is intended to be used with the `frontend-site` for a complete solar and battery calculation platform.

## User Workflow with Sales Consultant

### 1. Basic Workflow
1. Sales consultant logs in and opens the calculation page
2. Inputs are entered:
   - Load profile data
   - Applicable tariff structures 
   - Proposed solar system size
   - Battery specifications
3. Frontend sends calculation request to backend API
4. Backend processes and returns:
   - Financial metrics (savings, payback, ROI)
   - Technical specifications
   - System optimization recommendations
5. Frontend displays interactive results
6. Consultant can generate proposal or pre-approval
7. Once the consultant has reviewd it off site they can approve it and send it out to the client

### 2. Visualization Components
The frontend implements interactive charts showing:
- Savings trajectory over time
- Payback period analysis
- Solar generation vs grid consumption
- Battery utilization patterns
- Cost breakdown and ROI metrics

Using chart.js/recharts for dynamic visualizations, consultants can:
- Adjust inputs to see real-time impact
- Compare different system configurations
- Demonstrate value proposition to clients


# Deployment Scripts

Here’s what you need:

- **run.sh**: Runs your FastAPI app locally using uvicorn (with your synced environment).
- **build.sh**: Builds your Docker image using the Dockerfile, ready for deployment (e.g., to Render).

Let’s create both scripts:

---

**run.sh**  
Runs the FastAPI app locally (using your virtual environment if present):

**build.sh**  
Builds the Docker image (tagged as backend-api:latest)

- **run.sh**: Runs your FastAPI app locally, activating the virtual environment if present.
- **build.sh**: Builds your Docker image using the Dockerfile, tagging it as `backend-api:latest` (ready for Render or any other deployment).

You can now:
- Run locally: `bash run.sh`
- Build for deployment: `bash build.sh`