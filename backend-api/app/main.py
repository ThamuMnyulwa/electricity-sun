from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .calculator import (
    CalculationInput,
    compute,
    compute_detail,
    CalculationResult,
    CalculationDetail,
)

app = FastAPI(title="Renewable Energy Calculator")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


@app.get("/")
def read_root():
    return {"message": "Welcome to the Renewable Energy Calculator API"}


@app.post("/calculate", response_model=CalculationResult)
def calculate(data: CalculationInput):
    """Return renewable energy calculation results."""
    return compute(data)


@app.post("/calculate/detail", response_model=CalculationDetail)
def calculate_detail(data: CalculationInput):
    """Return calculation results with intermediate values."""
    return compute_detail(data)


def main():
    """Entry point for the application."""
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)


if __name__ == "__main__":
    main()
