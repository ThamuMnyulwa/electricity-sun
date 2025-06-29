"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Sun,
  Zap,
  Battery,
  DollarSign,
  Calculator,
  TrendingUp,
  BarChart3,
  Target,
  RotateCcw,
  Share2,
  Download,
  Info,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LabelList,
} from "recharts";

// Interactive parameters
const parameters = [
  {
    key: "avgLoad",
    label: "Average Load",
    unit: "kW",
    min: 50,
    max: 500,
    default: 250,
    step: 10,
    icon: <Zap className="w-4 h-4" />,
    description: "Peak hour electricity consumption",
    tooltip: "How we use this: We calculate your required battery capacity by multiplying this load by your peak hours. This determines how much energy you need to store during cheap off-peak periods to use during expensive peak periods. Find this number on your electricity bill during your busiest operating hours (typically 7-10am and 6-8pm)."
  },
  {
    key: "peakHours", 
    label: "Peak Hours/Day",
    unit: "hrs",
    min: 2,
    max: 12,
    default: 6,
    step: 0.5,
    icon: <DollarSign className="w-4 h-4" />,
    description: "Hours at peak tariff rates",
    tooltip: "How we use this: We multiply peak hours × average load to calculate your daily energy requirement during expensive periods. This directly affects your battery size and savings potential. Each additional peak hour increases your battery arbitrage opportunity. We exclude weekends (104 days) since most businesses operate Monday-Friday, giving you 261 working days of savings per year."
  },
  {
    key: "batteryDod",
    label: "Battery Depth",
    unit: "%",
    min: 60,
    max: 95,
    default: 80,
    step: 5,
    icon: <Battery className="w-4 h-4" />,
    description: "Depth of discharge",
    tooltip: "How this affects your system: We calculate required battery capacity as Peak Load Energy ÷ Depth of Discharge. At 80% DoD, a 100kWh battery provides 80kWh usable energy. Higher percentages mean smaller, cheaper batteries but may reduce lifespan from 10+ years to 7-8 years. Lower percentages mean larger batteries but longer life. 80% is the engineering sweet spot for commercial applications."
  },
  {
    key: "peakTariff",
    label: "Peak Rate",
    unit: "R/kWh",
    min: 2.5,
    max: 5.0,
    default: 3.99,
    step: 0.1,
    icon: <DollarSign className="w-4 h-4" />,
    description: "Peak electricity rate",
    tooltip: "How we calculate your arbitrage savings: Peak Rate minus blended charging cost (mix of off-peak R1.18 and standard R1.69 rates) = profit per kWh. For example: R3.99 peak - R1.44 charging cost = R2.55 profit per kWh cycled. We multiply this by annual kWh moved through batteries (peak load × efficiency × 261 working days × 2 cycles/day) to get your battery arbitrage savings."
  },
  {
    key: "batteryCost", 
    label: "Battery Cost",
    unit: "R/kWh",
    min: 3000,
    max: 8000,
    default: 5000,
    step: 100,
    icon: <Battery className="w-4 h-4" />,
    description: "Cost per kWh installed",
    tooltip: "How we calculate your investment and payback: Battery Cost × Required Capacity = Total Investment. We calculate payback as Total Investment ÷ Annual Savings. This includes lithium batteries, hybrid inverters, electrical installation, commissioning, and 10-year warranties. Higher quality systems cost more upfront but last longer and require less maintenance, improving long-term ROI."
  }
];

export default function CalculatePage() {
  const [mounted, setMounted] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Initialize parameters with defaults
  const [params, setParams] = useState(() => 
    parameters.reduce((acc, param) => ({
      ...acc,
      [param.key]: param.default
    }), {} as Record<string, number>)
  );

  useEffect(() => {
    setMounted(true);
    // Calculate initial results
    calculateResults();
  }, []);

  // Real-time calculation with debouncing
  const calculateResults = useCallback(async () => {
    setCalculating(true);
    try {
      const response = await fetch("https://electricity-sun.onrender.com/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          avg_load_kW: params.avgLoad,
          peak_hours_per_day: params.peakHours,
          dod: params.batteryDod / 100, // Convert percentage to decimal
          days_per_month: 30,
          solar_capacity_kW: 0, // No solar
          solar_yield_kWh_kWp: 0,
          solar_self_consume: 0,
          offpeak_tariff: 1.18,
          std_tariff: 1.69,
          peak_tariff: params.peakTariff,
          feed_in_tariff: 0.75,
          charge_offpeak_hours: 2.5,
          charge_std_hours: 2.5,
          battery_cost_kWh: params.batteryCost,
          battery_efficiency: 0.9,
          cycles_per_day: 2,
          days_per_year: 365,
          battery_lifetime_yrs: 10,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data);
        setResult(data);
      } else {
        console.error("API Error:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Calculation failed:", error);
      setResult(null);
    } finally {
      setCalculating(false);
    }
  }, [params]);

  // Debounced parameter updates
  useEffect(() => {
    if (mounted) {
      const timeoutId = setTimeout(calculateResults, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [params, calculateResults, mounted]);

  const updateParam = (key: string, value: number[]) => {
    setParams(prev => ({ ...prev, [key]: value[0] }));
  };

  const resetToDefaults = () => {
    setParams(parameters.reduce((acc, param) => ({
      ...acc,
      [param.key]: param.default
    }), {}));
  };

  const exportToExcel = () => {
    if (!result) return;
    
    const data = [
      ['Solar Calculator Results', '', ''],
      ['Generated on:', new Date().toLocaleString(), ''],
      ['', '', ''],
      ['Client Information', '', ''],
      ['Name:', clientInfo.name, ''],
      ['Email:', clientInfo.email, ''],
      ['Phone:', clientInfo.phone, ''],
      ['Company:', clientInfo.company, ''],
      ['', '', ''],
      ['System Configuration', '', ''],
      ['Average Load:', `${params.avgLoad} kW`, ''],
      ['Peak Hours/Day:', `${params.peakHours} hrs`, ''],
      ['Solar System Size:', `${params.solarSize} kW`, ''],
      ['Battery Depth:', `${params.batteryDod}%`, ''],
      ['Peak Rate:', `R${params.peakTariff}/kWh`, ''],
      ['Battery Cost:', `R${params.batteryCost}/kWh`, ''],
      ['', '', ''],
      ['Financial Results', '', ''],
      ['Required Battery Capacity:', `${result.required_capacity_kWh?.toFixed(0)} kWh`, ''],
      ['Total Investment:', `R${(result.total_battery_cost_R / 1000000)?.toFixed(2)}M`, ''],
      ['Annual Savings:', `R${(result.annual_saving_R / 1000000)?.toFixed(2)}M`, ''],
      ['Monthly Savings:', `R${(result.annual_saving_R / 12 / 1000)?.toFixed(0)}k`, ''],
      ['Payback Period:', `${result.simple_payback_years?.toFixed(1)} years`, ''],
      ['20-Year Total Value:', `R${((result.annual_saving_R * 20 - result.total_battery_cost_R) / 1000000)?.toFixed(1)}M`, ''],
      ['', '', ''],
      ['Energy Analysis', '', ''],
      ['Annual Solar Generation:', `${Math.round(result.annual_solar_gen_kWh / 1000)} MWh`, ''],
      ['Self Consumed:', `${Math.round(result.solar_self_consumed_kWh / 1000)} MWh`, ''],
      ['Grid Export:', `${Math.round(result.solar_exported_kWh / 1000)} MWh`, ''],
      ['Battery Cycling:', `${Math.round(result.kWh_moved_per_year / 1000)} MWh`, ''],
    ];

    const csvContent = data.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `solar_calculation_${clientInfo.name || 'client'}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const shareToClient = () => {
    if (!result || !clientInfo.email) {
      alert('Please enter client email address first');
      return;
    }
    
    const subject = `Solar Calculator Results for ${clientInfo.name || 'Your Business'}`;
    const body = `Dear ${clientInfo.name || 'Client'},\n\nPlease find your personalized solar calculation results below:\n\n` +
      `💰 Payback Period: ${result.simple_payback_years?.toFixed(1)} years\n` +
      `📈 Annual Savings: R${(result.annual_saving_R / 1000000)?.toFixed(2)}M\n` +
      `🔋 Required Battery: ${result.required_capacity_kWh?.toFixed(0)}kWh\n` +
      `💼 Total Investment: R${(result.total_battery_cost_R / 1000000)?.toFixed(2)}M\n` +
      `📊 Monthly Savings: R${(result.annual_saving_R / 12 / 1000)?.toFixed(0)}k\n\n` +
      `System Configuration:\n` +
      `- Peak Load: ${params.avgLoad}kW for ${params.peakHours} hours/day\n` +
      `- Battery Depth: ${params.batteryDod}%\n` +
      `- Battery Size: ${result.required_capacity_kWh?.toFixed(0)}kWh\n\n` +
      `Best regards,\nYour Solar Solutions Team`;
    
    const mailtoLink = `mailto:${clientInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
    setShowShareModal(false);
  };

  const shareToEngineering = () => {
    if (!result) return;
    
    const subject = `Engineering Review Required - ${clientInfo.name || 'Client'} Solar Project`;
    const body = `Engineering Team,\n\nPlease review the following solar + battery system design:\n\n` +
      `CLIENT DETAILS:\n` +
      `Name: ${clientInfo.name}\n` +
      `Company: ${clientInfo.company}\n` +
      `Email: ${clientInfo.email}\n` +
      `Phone: ${clientInfo.phone}\n\n` +
      `SYSTEM SPECIFICATIONS:\n` +
      `- Battery Storage: ${result.required_capacity_kWh?.toFixed(0)}kWh (${params.batteryDod}% DoD)\n` +
      `- Peak Load: ${params.avgLoad}kW for ${params.peakHours} hours/day\n` +
      `- Peak Tariff: R${params.peakTariff}/kWh\n` +
      `- Battery Cost Budget: R${params.batteryCost}/kWh\n\n` +
      `FINANCIAL SUMMARY:\n` +
      `- Investment: R${(result.total_battery_cost_R / 1000000)?.toFixed(2)}M\n` +
      `- Annual Savings: R${(result.annual_saving_R / 1000000)?.toFixed(2)}M\n` +
      `- Payback: ${result.simple_payback_years?.toFixed(1)} years\n` +
      `- ROI: ${(100 / result.simple_payback_years)?.toFixed(1)}%\n\n` +
      `Please confirm technical feasibility and prepare detailed proposal.\n\n` +
      `Generated by: [Sales Agent Name]\n` +
      `Date: ${new Date().toLocaleDateString()}`;
    
    const mailtoLink = `mailto:engineering@solarcalc.co.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
    setShowShareModal(false);
  };

  // Dynamic chart data calculated from API response
  const paybackData = result ? [
    { year: 0, value: 0 },
    { year: 1, value: Number((result.annual_saving_R / 1000000).toFixed(2)) },
    { year: 2, value: Number(((result.annual_saving_R * 2) / 1000000).toFixed(2)) },
    { year: 3, value: Number(((result.annual_saving_R * 3) / 1000000).toFixed(2)) },
    { year: 4, value: Number(((result.annual_saving_R * 4) / 1000000).toFixed(2)) },
    { year: 5, value: Number(((result.annual_saving_R * 5) / 1000000).toFixed(2)) },
    { year: 6, value: Number(((result.annual_saving_R * 6) / 1000000).toFixed(2)) },
    { year: 7, value: Number(((result.annual_saving_R * 7) / 1000000).toFixed(2)) },
    { year: 8, value: Number(((result.annual_saving_R * 8) / 1000000).toFixed(2)) },
    { year: 9, value: Number(((result.annual_saving_R * 9) / 1000000).toFixed(2)) },
    { year: 10, value: Number(((result.annual_saving_R * 10) / 1000000).toFixed(2)) }
  ] : [
    { year: 0, value: 0 },
    { year: 1, value: 2.5 },
    { year: 2, value: 5.0 },
    { year: 3, value: 7.5 },
    { year: 4, value: 10.0 },
    { year: 5, value: 12.5 }
  ];

  const energyData = result ? [
    { name: "Peak Load Energy", value: Math.max(0.1, Math.round((params.avgLoad * params.peakHours) / 1000 * 10) / 10), fill: "#f59e0b" },
    { name: "Battery Cycling", value: Math.max(0.1, Math.round(result.kWh_moved_per_year / 1000)), fill: "#8b5cf6" },
    { name: "Battery Capacity", value: Math.max(0.1, Math.round(result.required_capacity_kWh / 1000 * 10) / 10), fill: "#10b981" }
  ] : [
    { name: "Peak Load Energy", value: 1.5, fill: "#f59e0b" },
    { name: "Battery Cycling", value: 780, fill: "#8b5cf6" },
    { name: "Battery Capacity", value: 1.9, fill: "#10b981" }
  ];

  const monthlyData = result ? [
    { month: "Jan", savings: Math.round(result.annual_saving_R / 12 / 1000) },
    { month: "Feb", savings: Math.round(result.annual_saving_R / 12 / 1000) },
    { month: "Mar", savings: Math.round(result.annual_saving_R / 12 / 1000) },
    { month: "Apr", savings: Math.round(result.annual_saving_R / 12 / 1000) },
    { month: "May", savings: Math.round(result.annual_saving_R / 12 / 1000) },
    { month: "Jun", savings: Math.round(result.annual_saving_R / 12 / 1000) },
    { month: "Jul", savings: Math.round(result.annual_saving_R / 12 / 1000) },
    { month: "Aug", savings: Math.round(result.annual_saving_R / 12 / 1000) },
    { month: "Sep", savings: Math.round(result.annual_saving_R / 12 / 1000) },
    { month: "Oct", savings: Math.round(result.annual_saving_R / 12 / 1000) },
    { month: "Nov", savings: Math.round(result.annual_saving_R / 12 / 1000) },
    { month: "Dec", savings: Math.round(result.annual_saving_R / 12 / 1000) }
  ] : [
    { month: "Jan", savings: 200 },
    { month: "Feb", savings: 200 },
    { month: "Mar", savings: 200 },
    { month: "Apr", savings: 200 },
    { month: "May", savings: 200 },
    { month: "Jun", savings: 200 }
  ];

  const tariffData = result ? [
    { name: "Off-Peak", rate: 1.18, fill: "#10b981" },
    { name: "Standard", rate: 1.69, fill: "#f59e0b" },
    { name: "Charge Rate", rate: Number(result.charge_rate.toFixed(2)), fill: "#3b82f6" },
    { name: "Peak Rate", rate: params.peakTariff, fill: "#ef4444" }
  ] : [
    { name: "Off-Peak", rate: 1.18, fill: "#10b981" },
    { name: "Standard", rate: 1.69, fill: "#f59e0b" },
    { name: "Charge Rate", rate: 1.44, fill: "#3b82f6" },
    { name: "Peak Rate", rate: 3.99, fill: "#ef4444" }
  ];

  if (!mounted) return null;

  console.log("Debug info:", { 
    result, 
    paybackData: paybackData.slice(0, 3), 
    energyData: energyData.slice(0, 2),
    monthlyData: monthlyData.slice(0, 3),
    resultKeys: result ? Object.keys(result) : null
  }); // Debug log

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/20 relative">
      {/* Background matching front page */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/40"></div>
        <Image
          src="/images/solar-panels-hero.jpg"
          alt="Solar panels background"
          fill
          className="object-cover opacity-15"
          priority
          style={{ objectPosition: "center 30%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-white/70"></div>
      </div>

      {/* Header matching front page style */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">SolarCalc SA</h1>
              <p className="text-xs text-slate-600">Interactive Calculator</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-slate-600 hover:text-slate-800 transition-colors">
              Home
            </Link>
            <Link href="/calculate" className="text-amber-600 font-medium">
              Calculator  
            </Link>
            <Button 
              onClick={resetToDefaults} 
              className="h-10 px-5 bg-gradient-to-r from-amber-50 via-amber-100 to-orange-50 border border-amber-100 text-amber-700 shadow-sm rounded-full font-semibold flex items-center gap-2 transition-all duration-200 hover:bg-amber-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-100 focus:ring-offset-2"
            >
              <RotateCcw className="w-5 h-5 text-amber-500" />
              Reset
            </Button>
            <div className="flex items-center space-x-2 h-10 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-200">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="text-sm">
                <div className="font-medium text-slate-800">Sales Agent</div>
                <div className="text-xs text-slate-600">Demo Mode</div>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-16 px-4 relative z-10">
        <div className="container mx-auto max-w-7xl">
          {/* Title Section */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-6 bg-amber-100 text-amber-800 border-amber-200">
              <Calculator className="w-4 h-4 mr-1" /> Interactive Solar Calculator
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Drag. Calculate. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Present.</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Calculator with real-time results.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Interactive Controls */}
            <div className="lg:col-span-1 space-y-6">
              {/* Key Metrics */}
              {result && (
                <Card className="p-6 bg-white/90 backdrop-blur-sm border-slate-200/50 shadow-lg rounded-2xl">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-slate-800">Live Results</h3>
                        <button
                          onClick={() => setShowTooltip(showTooltip === 'live-results' ? null : 'live-results')}
                          className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <Info className="w-3 h-3" />
                        </button>
                      </div>
                      {calculating && (
                        <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                      )}
                    </div>
                    {showTooltip === 'live-results' && (
                      <div className="flex items-start space-x-2 p-3 bg-amber-50 rounded-lg border border-amber-200 mb-4">
                        <Info className="w-3 h-3 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-amber-800 space-y-2">
                          <p><strong>How we calculate these results:</strong></p>
                          <p><strong>Payback Period:</strong> Total battery cost ÷ annual savings. Includes weekday-only operation (excludes 104 weekend days per year).</p>
                          <p><strong>Annual Savings:</strong> Battery arbitrage (charging at off-peak rates, discharging at peak rates) + solar self-consumption savings + grid export revenue.</p>
                          <p><strong>Battery Size:</strong> Peak load energy ÷ depth of discharge. Sized to handle your peak consumption during expensive hours.</p>
                          <p><strong>Investment:</strong> Battery capacity × cost per kWh (includes batteries, inverters, installation, and commissioning).</p>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                        <div className="text-2xl font-bold text-green-700">
                          {result.simple_payback_years?.toFixed(1)}
                        </div>
                        <div className="text-green-600 text-sm">Years Payback</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                        <div className="text-2xl font-bold text-blue-700">
                          R{(result.annual_saving_R / 1000000)?.toFixed(2)}M
                        </div>
                        <div className="text-blue-600 text-sm">Annual Savings</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                        <div className="text-2xl font-bold text-purple-700">
                          {result.required_capacity_kWh?.toFixed(0)}kWh
                        </div>
                        <div className="text-purple-600 text-sm">Battery Size</div>
                      </div>
                      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                        <div className="text-2xl font-bold text-amber-700">
                          R{(result.total_battery_cost_R / 1000000)?.toFixed(1)}M
                        </div>
                        <div className="text-amber-600 text-sm">Investment</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Interactive Sliders */}
              <Card className="p-6 bg-white/90 backdrop-blur-sm border-slate-200/50 shadow-lg rounded-2xl">
                <CardContent className="p-0">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-slate-800">
                        Interactive Controls
                      </h3>
                      <button
                        onClick={() => setShowTooltip(showTooltip === 'controls-overview' ? null : 'controls-overview')}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                    {showTooltip === 'controls-overview' && (
                      <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200 mb-4">
                        <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-800 leading-relaxed">
                          How our calculations work: Each parameter directly feeds into our engineering formulas. 
                          Battery size = Peak Load × Peak Hours ÷ Depth of Discharge. Annual savings = Battery arbitrage + Solar benefits. 
                          Payback = Total investment ÷ Annual savings. All calculations update instantly as you adjust parameters, 
                          so you can see exactly how each change affects the financial outcome.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    {parameters.map((param) => (
                      <div key={param.key} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <span className="text-amber-600">{param.icon}</span>
                            <label className="font-medium text-slate-700">{param.label}</label>
                            <button
                              onClick={() => setShowTooltip(showTooltip === param.key ? null : param.key)}
                              className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              <Info className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-amber-600 font-bold">
                            {params[param.key]?.toFixed(param.unit === 'R/kWh' ? 2 : param.step < 1 ? 1 : 0)} {param.unit}
                          </span>
                        </div>

                        {showTooltip === param.key && (
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700">
                            {param.tooltip}
                          </div>
                        )}
                        
                        <Slider
                          value={[params[param.key]]}
                          onValueChange={(value) => updateParam(param.key, value)}
                          min={param.min}
                          max={param.max}
                          step={param.step}
                          className="w-full"
                        />
                        
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>{param.min} {param.unit}</span>
                          <span className="text-center">{param.description}</span>
                          <span>{param.max} {param.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Client Information */}
              <Card className="p-6 bg-white/90 backdrop-blur-sm border-slate-200/50 shadow-lg rounded-2xl">
                <CardContent className="p-0">
                  <h3 className="text-lg font-semibold text-slate-800 mb-6">
                    Client Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Client Name *
                      </label>
                      <input
                        type="text"
                        value={clientInfo.name}
                        onChange={(e) => setClientInfo(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Enter client name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={clientInfo.email}
                        onChange={(e) => setClientInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="client@example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={clientInfo.phone}
                        onChange={(e) => setClientInfo(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="+27 123 456 7890"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Company (Optional)
                      </label>
                      <input
                        type="text"
                        value={clientInfo.company}
                        onChange={(e) => setClientInfo(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="Company name"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Charts (Stacked Vertically) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Payback Timeline */}
              <Card className="p-6 bg-white/90 backdrop-blur-sm border-slate-200/50 shadow-lg rounded-2xl">
                <CardContent className="p-0">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                        Financial Timeline (10 Years)
                      </h3>
                      <button
                        onClick={() => setShowTooltip(showTooltip === 'financial-timeline' ? null : 'financial-timeline')}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <Info className="w-3 h-3" />
                      </button>
                    </div>
                    {showTooltip === 'financial-timeline' && (
                      <div className="flex items-start space-x-2 p-2 bg-green-50 rounded-lg border border-green-200 mb-2">
                        <Info className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-green-800">
                          How we project your financial returns: Year 1 = Annual Savings, Year 2 = Annual Savings × 2, etc. 
                          The line crosses your initial investment at the payback point. After this, all savings are pure profit. 
                          Steeper curves = faster payback. We calculate 10 years to show long-term value, but most systems 
                          last 15-20 years, providing additional profit beyond what's shown.
                        </p>
                      </div>
                    )}
                  </div>
                  {paybackData.length > 0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={paybackData} margin={{ top: 5, right: 30, left: 70, bottom: 50 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis 
                            dataKey="year" 
                            stroke="#64748b"
                            label={{ value: 'Years', position: 'insideBottom', offset: -10 }}
                          />
                          <YAxis 
                            stroke="#64748b"
                            label={{ value: 'R Millions', angle: -90, position: 'insideLeft' }}
                          />
                          <Tooltip 
                            formatter={(value) => [`R${Number(value).toFixed(2)}M`, 'Cumulative Savings']}
                            labelFormatter={(label) => `Year ${label}`}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#10b981" 
                            fill="#10b981"
                            fillOpacity={0.3}
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-slate-500">
                      {calculating ? "Calculating..." : "No data available"}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Monthly Performance */}
              <Card className="p-6 bg-white/90 backdrop-blur-sm border-slate-200/50 shadow-lg rounded-2xl">
                <CardContent className="p-0">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                        Monthly Savings Pattern
                      </h3>
                      <button
                        onClick={() => setShowTooltip(showTooltip === 'monthly-savings' ? null : 'monthly-savings')}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <Info className="w-3 h-3" />
                      </button>
                    </div>
                    {showTooltip === 'monthly-savings' && (
                      <div className="flex items-start space-x-2 p-2 bg-blue-50 rounded-lg border border-blue-200 mb-2">
                        <Info className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-blue-800">
                          How we calculate monthly cash flow: Annual Savings ÷ 12 months = consistent monthly benefit. 
                          This includes daily battery cycling (charge cheap, discharge expensive) + solar self-consumption 
                          + grid export revenue. Savings are consistent year-round because battery arbitrage works regardless 
                          of weather, while solar varies seasonally but averages out over the year.
                        </p>
                      </div>
                    )}
                  </div>
                  {monthlyData.length > 0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData} margin={{ top: 30, right: 30, left: 70, bottom: 50 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis 
                            dataKey="month" 
                            stroke="#64748b"
                            label={{ value: 'Month', position: 'insideBottom', offset: -10 }}
                          />
                          <YAxis 
                            stroke="#64748b"
                            label={{ value: 'R Thousands', angle: -90, position: 'insideLeft' }}
                          />
                          <Tooltip 
                            formatter={(value) => [`R${Number(value)}k`, 'Monthly Savings']}
                            labelFormatter={(label) => `${label}`}
                          />
                          <Bar dataKey="savings" fill="#10b981">
                            <LabelList dataKey="savings" position="top" formatter={(value) => `R${value}k`} />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-slate-500">
                      {calculating ? "Calculating..." : "No data available"}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tariff Comparison Chart */}
              <Card className="p-6 bg-white/90 backdrop-blur-sm border-slate-200/50 shadow-lg rounded-2xl">
                <CardContent className="p-0">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2 text-amber-500" />
                        Electricity Tariffs & Arbitrage
                      </h3>
                      <button
                        onClick={() => setShowTooltip(showTooltip === 'tariff-comparison' ? null : 'tariff-comparison')}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <Info className="w-3 h-3" />
                      </button>
                    </div>
                    {showTooltip === 'tariff-comparison' && (
                      <div className="flex items-start space-x-2 p-2 bg-amber-50 rounded-lg border border-amber-200 mb-2">
                        <Info className="w-3 h-3 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-amber-800">
                          How we calculate arbitrage profit: Charge Rate = weighted average of off-peak (R1.18) and standard (R1.69) rates. 
                          Battery profit = Peak Rate minus Charge Rate. The bigger the gap between Peak Rate and Charge Rate, 
                          the more you save per kWh. This visual shows your arbitrage opportunity.
                        </p>
                      </div>
                    )}
                  </div>
                  {tariffData.length > 0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={tariffData} margin={{ top: 40, right: 30, left: 70, bottom: 50 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis 
                            dataKey="name" 
                            stroke="#64748b"
                            label={{ value: 'Tariff Type', position: 'insideBottom', offset: -10 }}
                          />
                          <YAxis 
                            stroke="#64748b"
                            label={{ value: 'Rate (R/kWh)', angle: -90, position: 'insideLeft' }}
                          />
                          <Tooltip 
                            formatter={(value) => [`R${Number(value).toFixed(2)}/kWh`, 'Electricity Rate']}
                            labelFormatter={(label) => label}
                          />
                          <Bar dataKey="rate">
                            {tariffData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                            <LabelList dataKey="rate" position="top" formatter={(value) => `R${Number(value).toFixed(2)}/kWh`} />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-slate-500">
                      {calculating ? "Calculating..." : "No data available"}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Client Proposal Summary */}
              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50 shadow-lg rounded-2xl">
                <CardContent className="p-0">
                  <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Client Proposal
                  </h3>
                  
                  {result && (
                    <div className="space-y-4">
                      {/* Key Metric */}
                      <div className="bg-white/80 p-4 rounded-xl text-center">
                        <div className="text-3xl font-bold text-green-700 mb-1">
                          {result.simple_payback_years?.toFixed(1)}
                        </div>
                        <div className="text-green-600 text-sm">Year Payback Period</div>
                      </div>

                      {/* System Details */}
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-700">Battery Size:</span>
                          <span className="font-medium text-slate-800">
                            {result.required_capacity_kWh?.toFixed(0)}kWh
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Investment:</span>
                          <span className="font-medium text-slate-800">
                            R {(result.total_battery_cost_R / 1000000)?.toFixed(2)}M
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Annual Savings:</span>
                          <span className="font-bold text-green-700">
                            R {(result.annual_saving_R / 1000000)?.toFixed(2)}M
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Monthly Savings:</span>
                          <span className="font-bold text-green-700">
                            R {(result.annual_saving_R / 12 / 1000)?.toFixed(0)}k
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-green-200 pt-3">
                          <span className="text-green-700">20-Year Value:</span>
                          <span className="font-bold text-green-700">
                            R {((result.annual_saving_R * 20 - result.total_battery_cost_R) / 1000000)?.toFixed(1)}M
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-4">
                        <Button 
                          onClick={() => window.print()}
                          size="sm" 
                          variant="outline"
                          className="border-green-300 text-green-700 hover:bg-green-50"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Print
                        </Button>
                        <Button 
                          onClick={exportToExcel}
                          size="sm" 
                          variant="outline"
                          className="border-blue-300 text-blue-700 hover:bg-blue-50"
                          disabled={!result || !clientInfo.name}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Excel
                        </Button>
                        <Button 
                          onClick={() => setShowShareModal(true)}
                          size="sm" 
                          className="col-span-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                          disabled={!result}
                        >
                          <Share2 className="w-4 h-4 mr-1" />
                          Share Results
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Share Results</h3>
            <p className="text-sm text-slate-600 mb-6">Who would you like to share these calculation results with?</p>
            
            <div className="space-y-3">
              <Button
                onClick={shareToClient}
                className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                disabled={!clientInfo.email}
              >
                <Share2 className="w-4 h-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Share with Client</div>
                  <div className="text-xs opacity-70">
                    {clientInfo.email ? `Send to ${clientInfo.email}` : 'Enter client email first'}
                  </div>
                </div>
              </Button>
              
              <Button
                onClick={shareToEngineering}
                className="w-full justify-start bg-green-50 hover:bg-green-100 text-green-700 border border-green-200"
              >
                <Share2 className="w-4 h-4 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Share with Engineering Team</div>
                  <div className="text-xs opacity-70">Request technical review & proposal</div>
                </div>
              </Button>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                onClick={() => setShowShareModal(false)}
                variant="outline"
                size="sm"
                className="border-slate-300 text-slate-700"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}