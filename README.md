# SolarCalc SA - Interactive Solar Calculator

A professional solar calculator for South African businesses with real-time calculations and interactive charts.

## Project Structure

```
electricity-sun/
├── frontend-site/          # Next.js frontend application
│   ├── app/calculate/      # Interactive calculator page
│   └── components/         # UI components
├── backend-api/            # FastAPI backend service
│   ├── app/
│   │   ├── main.py        # FastAPI app with CORS config
│   │   └── calculator.py  # Solar calculation engine
│   └── Dockerfile
└── simple_calculator.py   # Original calculation reference
```

## Key Features

- **Interactive Controls**: 6 parameters with real-time slider updates
- **Visual Charts**: Financial timeline, monthly savings, energy flow
- **Live Results**: Key metrics updating on parameter changes
- **Professional Interface**: Clean design for client presentations

## Technical Implementation

### Backend (FastAPI)
- Solar energy calculations with South African tariffs
- CORS middleware for cross-origin requests
- Weekend exclusion: `working_days_per_year = 365 - 104`
- Battery arbitrage calculations with efficiency losses

### Frontend (Next.js)
- Real-time API integration with 300ms debouncing
- Recharts for data visualization with proper axis labels
- Responsive design with touch-friendly controls

### CORS Configuration
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Development

### Backend
```bash
cd backend-api
pip install -e .
python -m app.main
```

### Frontend
```bash
cd frontend-site
npm install
npm run dev
```

## Deployment

### Backend to Render
1. Push code to GitHub
2. Create Web Service on Render
3. Set root directory: `backend-api`
4. Environment: Docker
5. Test at: `https://<service-name>.onrender.com/docs`

### Local Docker Testing
```bash
./backend-deploy.sh  # Builds backend Docker image
```

## API Endpoints

- `POST /calculate` - Returns calculation results
- `GET /` - Health check

## Common Issues

**CORS Errors**: Backend includes CORS middleware to allow frontend connections

**Chart Rendering**: Charts use fallback data during initial load, then update with real API responses

## Key Calculations

- Battery capacity: `peak_load_energy / depth_of_discharge`
- Annual energy moved: `peak_load_energy * efficiency * working_days * cycles_per_day`
- Payback period: `total_cost / annual_savings`


# Calculation 

I'll search the codebase to check if the changes are consistent across the three key areas you mentioned.
Ran tool
Read file: simple_calculator.py
Ran tool
After reviewing the codebase, I can confirm that the calculations are consistent across the three key components:

### 1. Core Calculation Logic Comparison

**Consistency Confirmed:**
- The same calculation methodology is used in all three places (backend API, simple_calculator.py, and frontend).
- Key formulas match across all implementations:
  - Required battery capacity = Average load × Peak hours ÷ Depth of discharge
  - Charge rate = Weighted average of off-peak and standard tariffs
  - Annual savings = kWh moved per year × Rate saving (peak tariff - charge rate)
  - Simple payback = Total battery cost ÷ Annual savings

### 2. Key Differences

**Backend API (`backend-api/app/calculator.py`):**
- Most comprehensive implementation with Pydantic models for validation
- Includes solar calculations (though not used in current frontend)
- Handles edge cases (e.g., division by zero)
- Returns structured data via FastAPI endpoints

**Simple Calculator (`simple_calculator.py`):**
- Educational/demonstration implementation with detailed comments
- Includes visualizations and Pareto analysis
- More focused on explaining concepts
- Missing some of the more advanced features of the backend

**Frontend (`frontend-site/app/calculate/page.tsx`):**
- Focuses on UI/UX and data visualization
- Makes API calls to the backend for calculations
- Handles data formatting for display
- Exports results to Excel/CSV

### 3. Data Flow

The frontend sends parameters to the backend API via POST request to `/calculate`, which runs the calculations using the same core logic as in `simple_calculator.py`, and returns the results that are then displayed in the UI.

### 4. Parameter Consistency

The default values are consistent across implementations:
- Average load: 250 kW
- Peak hours: 6 hours
- Battery DoD: 80%
- Tariffs: Off-peak (R1.18), Standard (R1.69), Peak (R3.99)
- Battery cost: R5000/kWh

### 5. Working Days Calculation

All implementations correctly exclude weekends (104 days) when calculating annual savings, using 261 working days per year (365 - 104).

In summary, the calculation logic is consistent across all three components, with each serving a different purpose in the overall system architecture. The backend handles the core calculations, the frontend handles the user interface and visualization, and the simple calculator serves as an educational tool.