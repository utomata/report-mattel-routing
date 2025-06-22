# Mattel Route Optimization Backend API

FastAPI backend service for Mattel's field agent route optimization system. This service processes and analyzes routing data from CSV files to provide optimization insights and comparisons.

## Data Sources

The backend processes the following CSV data files:

- **stores.csv**: Store information including sales, location, visit constraints, and operating hours
- **workers.csv**: Field agent information including home locations and work schedules  
- **manual_optimization.csv**: Current manual routing process data
- **result.csv**: AI-optimized routing recommendations

## Required API Endpoints

### 1. Dashboard APIs

#### GET /api/dashboard/kpis
Returns key performance indicators for the dashboard.

**Response:**
```json
{
  "total_stores": 128,
  "active_agents": 13,
  "weekly_visits_manual": 194,
  "weekly_visits_optimized": 168,
  "avg_service_time": 2.8,
  "total_sales_coverage": 420000000
}
```

#### GET /api/dashboard/efficiency-comparison
Daily visit comparison between manual and optimized processes.

**Response:**
```json
{
  "daily_comparison": [
    {"day": "Monday", "manual": 28, "optimized": 24},
    {"day": "Tuesday", "manual": 27, "optimized": 24},
    ...
  ]
}
```

#### GET /api/dashboard/store-chain-distribution
Store count and visit distribution by retail chain.

**Response:**
```json
{
  "chains": [
    {"chain": "Walmart/Supercenter", "count": 28, "percentage": 22},
    {"chain": "Bodega Aurrera", "count": 20, "percentage": 16},
    ...
  ]
}
```

### 2. Before/After Comparison APIs

#### GET /api/comparison/metrics
Core comparison metrics between manual and optimized processes.

**Response:**
```json
{
  "metrics": [
    {
      "metric": "Total Weekly Visits",
      "before": 194,
      "after": 168,
      "unit": "visits",
      "improvement_percentage": -13.4
    },
    ...
  ]
}
```

#### GET /api/comparison/agent-performance
Agent-level comparison of visit counts and efficiency.

**Response:**
```json
{
  "agents": [
    {
      "agent_id": "w_id_1",
      "name": "Linda Flores",
      "visits_before": 17,
      "visits_after": 14,
      "efficiency_gain": 18
    },
    ...
  ]
}
```

#### GET /api/comparison/weekly-distribution
Visit distribution across days of the week.

**Response:**
```json
{
  "weekly_data": [
    {"day": "Monday", "before": 28, "after": 24, "improvement": 14.3},
    ...
  ]
}
```

### 3. Coverage Analytics APIs

#### GET /api/coverage/agent-performance
Detailed performance metrics for each field agent.

**Response:**
```json
{
  "agents": [
    {
      "agent_id": "w_id_1",
      "name": "Linda Flores",
      "weekly_visits": 14,
      "store_time_percentage": 65,
      "travel_time_percentage": 25,
      "admin_time_percentage": 10,
      "efficiency_rating": "Good"
    },
    ...
  ]
}
```

#### GET /api/coverage/store-chain-analysis
Coverage analysis by retail chain.

**Response:**
```json
{
  "chains": [
    {
      "chain": "Walmart/Supercenter",
      "total_stores": 28,
      "weekly_visits": 42,
      "coverage_ratio": 1.5
    },
    ...
  ]
}
```

#### GET /api/coverage/sales-range-analysis
Visit allocation based on store sales performance.

**Response:**
```json
{
  "sales_ranges": [
    {
      "range": "$1M-$2M",
      "store_count": 45,
      "weekly_visits": 54,
      "avg_sales": 1500000
    },
    ...
  ]
}
```

#### GET /api/coverage/visit-time-distribution
Hourly distribution of store visits.

**Response:**
```json
{
  "hourly_distribution": [
    {"hour": "08:00", "visit_count": 18},
    {"hour": "09:00", "visit_count": 24},
    ...
  ]
}
```

### 4. Maps and Routing APIs

#### GET /api/maps/stores
All store locations with metadata.

**Response:**
```json
{
  "stores": [
    {
      "store_id": "s_id_1",
      "name": "Bodega Aurrera, Apodaca Sur",
      "sales": 1074604,
      "latitude": 25.7388447,
      "longitude": -100.1547635,
      "chain": "Bodega Aurrera",
      "min_weekly_visits": 0,
      "max_weekly_visits": 2
    },
    ...
  ]
}
```

#### GET /api/maps/agents
All field agent locations and assignments.

**Response:**
```json
{
  "agents": [
    {
      "agent_id": "w_id_1",
      "name": "Linda Flores",
      "home_latitude": 25.7126384,
      "home_longitude": -100.2243776,
      "assigned_routes": ["route_1", "route_2"]
    },
    ...
  ]
}
```

#### GET /api/maps/routes/{process_type}
Route data for visualization (manual or optimized).

**Parameters:**
- process_type: "manual" or "optimized"

**Response:**
```json
{
  "routes": [
    {
      "agent_id": "w_id_1",
      "day": "monday",
      "visits": [
        {
          "store_id": "s_id_111",
          "arrival_time": "08:40",
          "departure_time": "11:40",
          "service_duration": 180,
          "travel_time": 35
        },
        ...
      ]
    },
    ...
  ]
}
```

## Required Processing Functions

### Data Analysis Functions

1. **calculate_visit_efficiency()**
   - Compare visit counts between manual and optimized processes
   - Calculate percentage improvements

2. **analyze_agent_workload()**
   - Balance analysis across all 13 agents
   - Time allocation calculations (store time, travel time, admin time)

3. **compute_geographic_clustering()**
   - Analyze geographic distribution of visits
   - Calculate travel optimization metrics

4. **evaluate_store_coverage()**
   - Ensure all 128 stores are covered appropriately
   - Analyze visit frequency vs store sales/importance

### Optimization Algorithms

1. **route_optimization_engine()**
   - Process manual_optimization.csv data
   - Generate optimized routes (result.csv logic)
   - Consider store hours, agent schedules, and geographic constraints

2. **workload_balancer()**
   - Distribute visits evenly across agents
   - Respect agent working hours and capacity

3. **time_window_optimizer()**
   - Optimize visit timing within store operating hours
   - Minimize travel time between consecutive visits

## Data Validation Requirements

1. **Store Data Validation**
   - Validate GPS coordinates are within Monterrey metropolitan area
   - Ensure sales figures are realistic
   - Verify operating hours format

2. **Agent Data Validation**
   - Confirm agent locations are reasonable
   - Validate work schedule consistency
   - Check agent capacity constraints

3. **Route Data Validation**
   - Verify visit times respect store operating hours
   - Ensure travel times are realistic
   - Validate service duration constraints


## Dependencies

```python
fastapi
pandas
numpy
geopy
uvicorn
pydantic
```

## Environment Variables

```
DATABASE_URL=sqlite:///./mattel_routing.db  # Optional for persistence
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
LOG_LEVEL=INFO
```

## Development Setup

1. Install dependencies: `uv sync`
2. Place CSV files in `/data` directory
3. Run server: `uvicorn main:app --reload`
4. Access API docs: `http://localhost:8000/docs`

## Notes

- All calculations are based on the provided CSV data
- The system assumes static data (no real-time updates)
- Geographic calculations use Monterrey, Mexico as the base location
- All monetary values are in Mexican Pesos (MXN)
- Time zones are assumed to be Mexico Central Time (CST)
