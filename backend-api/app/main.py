from fastapi import FastAPI
from .calculator import (
    CalculationInput,
    compute,
    compute_detail,
    CalculationResult,
    CalculationDetail,
)

app = FastAPI(title="Renewable Energy Calculator")


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
