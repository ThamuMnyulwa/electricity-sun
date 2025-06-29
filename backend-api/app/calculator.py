from __future__ import annotations

from pydantic import BaseModel, Field, confloat


class CalculationInput(BaseModel):
    avg_load_kW: float = Field(250, description="Average load in kW")
    peak_hours_per_day: float = Field(6, description="Number of peak hours to shift per day")
    dod: confloat(gt=0, le=1) = Field(0.80, description="Depth of discharge (0-1)")
    days_per_month: int = Field(30, description="Days in billing month")

    solar_capacity_kW: float = Field(150, description="Solar PV system size in kW")
    solar_yield_kWh_kWp: float = Field(4.5, description="Average daily yield in kWh/kWp")
    solar_self_consume: confloat(ge=0, le=1) = Field(0.60, description="Fraction of solar energy directly consumed")

    offpeak_tariff: float = Field(1.18, description="Off-peak tariff (R/kWh)")
    std_tariff: float = Field(1.69, description="Standard tariff (R/kWh)")
    peak_tariff: float = Field(3.99, description="Peak tariff (R/kWh)")
    feed_in_tariff: float = Field(0.75, description="Feed-in tariff (R/kWh)")

    charge_offpeak_hours: float = Field(2.5, description="Hours charged at offpeak rate")
    charge_std_hours: float = Field(2.5, description="Hours charged at standard rate")

    battery_cost_kWh: float = Field(5000, description="Battery cost per kWh installed")
    battery_efficiency: confloat(gt=0, le=1) = Field(0.90, description="Round trip efficiency")
    cycles_per_day: float = Field(2, description="Charge/discharge cycles per day")
    days_per_year: int = Field(365, description="Days per year")
    battery_lifetime_yrs: int = Field(10, description="Expected battery lifetime")


class CalculationResult(BaseModel):
    """Summary of key financial outputs."""

    required_capacity_kWh: float
    total_battery_cost_R: float
    charge_rate: float
    rate_saving: float
    kWh_moved_per_year: float
    annual_arbitrage_saving_R: float
    annual_solar_gen_kWh: float
    solar_self_consumed_kWh: float
    solar_exported_kWh: float
    total_solar_benefit: float
    annual_saving_R: float
    simple_payback_years: float
    levelized_cost_R_kWh: float


class CalculationDetail(CalculationResult):
    """Extended result with intermediate calculations."""

    peak_load_energy: float
    daily_solar_gen_kWh: float
    solar_self_consume_saving: float
    solar_export_revenue: float
    battery_cycles_lifetime: float
    total_energy_lifetime_kWh: float


def _calculate_values(inputs: CalculationInput) -> dict:
    """Return a dictionary of all intermediate values used in the analysis."""

    # 1. Tariff-weighted charge rate
    total_charge_hours = inputs.charge_offpeak_hours + inputs.charge_std_hours
    if total_charge_hours > 0:
        charge_rate = (
            inputs.offpeak_tariff * inputs.charge_offpeak_hours
            + inputs.std_tariff * inputs.charge_std_hours
        ) / total_charge_hours
    else:
        charge_rate = 0

    # 2. Rate spread (arbitrage saving per kWh)
    rate_saving = inputs.peak_tariff - charge_rate / inputs.battery_efficiency

    # 3. Peak-load energy demand (kWh/day)
    peak_load_energy = inputs.avg_load_kW * inputs.peak_hours_per_day

    # 4. Required battery capacity (kWh)
    required_capacity_kWh = peak_load_energy / inputs.dod

    # 5. Total battery system cost (R)
    total_battery_cost_R = required_capacity_kWh * inputs.battery_cost_kWh

    # 6. Annual kWh shifted (accounting for efficiency losses and excluding weekends)
    working_days_per_year = 365 - 104  # Exclude 104 weekend days
    kWh_moved_per_year = (
        peak_load_energy
        * inputs.battery_efficiency  
        * working_days_per_year
        * inputs.cycles_per_day
    )

    # 7. Solar generation calculations
    daily_solar_gen_kWh = inputs.solar_capacity_kW * inputs.solar_yield_kWh_kWp
    annual_solar_gen_kWh = daily_solar_gen_kWh * inputs.days_per_year
    solar_self_consumed_kWh = annual_solar_gen_kWh * inputs.solar_self_consume
    solar_exported_kWh = annual_solar_gen_kWh - solar_self_consumed_kWh

    # 8. Solar savings calculations
    solar_self_consume_saving = solar_self_consumed_kWh * inputs.peak_tariff
    solar_export_revenue = solar_exported_kWh * inputs.feed_in_tariff
    total_solar_benefit = solar_self_consume_saving + solar_export_revenue

    # 9. Annual arbitrage savings (R)
    annual_arbitrage_saving_R = kWh_moved_per_year * rate_saving

    # 10. Total annual savings
    annual_saving_R = annual_arbitrage_saving_R + total_solar_benefit

    # 11. Simple payback (years)
    simple_payback_years = (
        total_battery_cost_R / annual_saving_R if annual_saving_R else float("inf")
    )

    # 12. Levelized cost calculations
    battery_cycles_lifetime = (
        inputs.cycles_per_day * inputs.days_per_year * inputs.battery_lifetime_yrs
    )
    total_energy_lifetime_kWh = (
        peak_load_energy * battery_cycles_lifetime * inputs.battery_efficiency
    )
    levelized_cost_R_kWh = total_battery_cost_R / total_energy_lifetime_kWh

    return {
        "charge_rate": charge_rate,
        "rate_saving": rate_saving,
        "peak_load_energy": peak_load_energy,
        "required_capacity_kWh": required_capacity_kWh,
        "total_battery_cost_R": total_battery_cost_R,
        "kWh_moved_per_year": kWh_moved_per_year,
        "daily_solar_gen_kWh": daily_solar_gen_kWh,
        "annual_solar_gen_kWh": annual_solar_gen_kWh,
        "solar_self_consumed_kWh": solar_self_consumed_kWh,
        "solar_exported_kWh": solar_exported_kWh,
        "solar_self_consume_saving": solar_self_consume_saving,
        "solar_export_revenue": solar_export_revenue,
        "total_solar_benefit": total_solar_benefit,
        "annual_arbitrage_saving_R": annual_arbitrage_saving_R,
        "annual_saving_R": annual_saving_R,
        "simple_payback_years": simple_payback_years,
        "battery_cycles_lifetime": battery_cycles_lifetime,
        "total_energy_lifetime_kWh": total_energy_lifetime_kWh,
        "levelized_cost_R_kWh": levelized_cost_R_kWh,
    }


def compute(inputs: CalculationInput) -> CalculationResult:
    values = _calculate_values(inputs)
    return CalculationResult(
        required_capacity_kWh=values["required_capacity_kWh"],
        total_battery_cost_R=values["total_battery_cost_R"],
        charge_rate=values["charge_rate"],
        rate_saving=values["rate_saving"],
        kWh_moved_per_year=values["kWh_moved_per_year"],
        annual_arbitrage_saving_R=values["annual_arbitrage_saving_R"],
        annual_solar_gen_kWh=values["annual_solar_gen_kWh"],
        solar_self_consumed_kWh=values["solar_self_consumed_kWh"],
        solar_exported_kWh=values["solar_exported_kWh"],
        total_solar_benefit=values["total_solar_benefit"],
        annual_saving_R=values["annual_saving_R"],
        simple_payback_years=values["simple_payback_years"],
        levelized_cost_R_kWh=values["levelized_cost_R_kWh"],
    )


def compute_detail(inputs: CalculationInput) -> CalculationDetail:
    values = _calculate_values(inputs)
    return CalculationDetail(
        peak_load_energy=values["peak_load_energy"],
        daily_solar_gen_kWh=values["daily_solar_gen_kWh"],
        solar_self_consume_saving=values["solar_self_consume_saving"],
        solar_export_revenue=values["solar_export_revenue"],
        battery_cycles_lifetime=values["battery_cycles_lifetime"],
        total_energy_lifetime_kWh=values["total_energy_lifetime_kWh"],
        required_capacity_kWh=values["required_capacity_kWh"],
        total_battery_cost_R=values["total_battery_cost_R"],
        charge_rate=values["charge_rate"],
        rate_saving=values["rate_saving"],
        kWh_moved_per_year=values["kWh_moved_per_year"],
        annual_arbitrage_saving_R=values["annual_arbitrage_saving_R"],
        annual_solar_gen_kWh=values["annual_solar_gen_kWh"],
        solar_self_consumed_kWh=values["solar_self_consumed_kWh"],
        solar_exported_kWh=values["solar_exported_kWh"],
        total_solar_benefit=values["total_solar_benefit"],
        annual_saving_R=values["annual_saving_R"],
        simple_payback_years=values["simple_payback_years"],
        levelized_cost_R_kWh=values["levelized_cost_R_kWh"],
    )
