import pytest
from app.calculator import CalculationInput, compute, compute_detail


def test_compute_defaults():
    result = compute(CalculationInput())
    assert result.required_capacity_kWh == pytest.approx(1875.0)
    assert result.total_battery_cost_R == pytest.approx(9375000.0)
    assert result.simple_payback_years == pytest.approx(3.09963, rel=1e-3)


def test_compute_detail_contains_intermediates():
    detail = compute_detail(CalculationInput())
    assert detail.peak_load_energy == pytest.approx(1500.0)
    assert detail.daily_solar_gen_kWh == pytest.approx(675.0)
