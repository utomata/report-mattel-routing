from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import re
from datetime import datetime, time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Mattel Route Optimization API",
    description="FastAPI backend service for Mattel's field agent route optimization system",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for API responses
class KPIMetrics(BaseModel):
    total_stores: int
    active_agents: int
    weekly_visits_manual: int
    weekly_visits_optimized: int
    avg_service_time: float
    total_sales_coverage: int

class DailyComparison(BaseModel):
    day: str
    manual: int
    optimized: int

class EfficiencyComparison(BaseModel):
    daily_comparison: List[DailyComparison]

class ChainDistribution(BaseModel):
    chain: str
    count: int
    percentage: float

class StoreChainDistribution(BaseModel):
    chains: List[ChainDistribution]

class ComparisonMetric(BaseModel):
    metric: str
    before: int
    after: int
    unit: str
    improvement_percentage: float

class MetricsComparison(BaseModel):
    metrics: List[ComparisonMetric]

class AgentPerformance(BaseModel):
    agent_id: str
    name: str
    visits_before: int
    visits_after: int
    efficiency_gain: float

class AgentPerformanceComparison(BaseModel):
    agents: List[AgentPerformance]

class WeeklyDistribution(BaseModel):
    day: str
    before: int
    after: int
    improvement: float

class WeeklyDistributionData(BaseModel):
    weekly_data: List[WeeklyDistribution]

class AgentCoverage(BaseModel):
    agent_id: str
    name: str
    weekly_visits: int
    store_time_percentage: float
    travel_time_percentage: float
    admin_time_percentage: float
    efficiency_rating: str

class AgentCoverageData(BaseModel):
    agents: List[AgentCoverage]

class ChainAnalysis(BaseModel):
    chain: str
    total_stores: int
    weekly_visits: int
    coverage_ratio: float

class StoreChainAnalysis(BaseModel):
    chains: List[ChainAnalysis]

class SalesRange(BaseModel):
    range: str
    store_count: int
    weekly_visits: int
    avg_sales: float

class SalesRangeAnalysis(BaseModel):
    sales_ranges: List[SalesRange]

class HourlyDistribution(BaseModel):
    hour: str
    visit_count: int

class VisitTimeDistribution(BaseModel):
    hourly_distribution: List[HourlyDistribution]

class StoreLocation(BaseModel):
    store_id: str
    name: str
    sales: int
    latitude: float
    longitude: float
    chain: str
    min_weekly_visits: int
    max_weekly_visits: int

class StoresData(BaseModel):
    stores: List[StoreLocation]

class AgentLocation(BaseModel):
    agent_id: str
    name: str
    home_latitude: float
    home_longitude: float
    assigned_routes: List[str]

class AgentsData(BaseModel):
    agents: List[AgentLocation]

class RouteVisit(BaseModel):
    store_id: str
    arrival_time: str
    departure_time: str
    service_duration: int
    travel_time: int

class Route(BaseModel):
    agent_id: str
    day: str
    visits: List[RouteVisit]

class RoutesData(BaseModel):
    routes: List[Route]

# Global data storage
stores_df = None
workers_df = None
manual_df = None
result_df = None

def load_data():
    """Load and preprocess all CSV data files"""
    global stores_df, workers_df, manual_df, result_df
    
    try:
        # Load stores data
        stores_df = pd.read_csv('data/stores.csv')
        
        # Clean sales data - remove $ and commas, convert to int
        stores_df['sales'] = stores_df['sales'].str.replace('$', '').str.replace(',', '').astype(int)
        
        # Parse location coordinates
        stores_df[['latitude', 'longitude']] = stores_df['location'].str.split(',', expand=True).astype(float)
        
        # Load workers data
        workers_df = pd.read_csv('data/workers.csv')
        
        # Parse worker location coordinates
        workers_df[['home_latitude', 'home_longitude']] = workers_df['home_location'].str.split(',', expand=True).astype(float)
        
        # Load routing data
        manual_df = pd.read_csv('data/manual_optimization.csv')
        result_df = pd.read_csv('data/result.csv')
        
        logger.info("Data loaded successfully")
        
    except Exception as e:
        logger.error(f"Error loading data: {e}")
        raise

def calculate_visit_efficiency():
    """Calculate visit efficiency metrics between manual and optimized processes"""
    manual_visits = len(manual_df)
    optimized_visits = len(result_df)
    
    improvement = ((optimized_visits - manual_visits) / manual_visits) * 100
    
    return {
        'manual_visits': manual_visits,
        'optimized_visits': optimized_visits,
        'improvement_percentage': improvement
    }

def analyze_agent_workload():
    """Analyze agent workload distribution and efficiency"""
    agent_stats = []
    
    for agent_id in workers_df['worker_id'].unique():
        agent_name = workers_df[workers_df['worker_id'] == agent_id]['name'].iloc[0]
        
        # Get visits for this agent
        agent_manual_visits = len(manual_df[manual_df['worker_id'] == agent_id])
        agent_optimized_visits = len(result_df[result_df['worker_id'] == agent_id])
        
        # Calculate efficiency gain
        if agent_manual_visits > 0:
            efficiency_gain = ((agent_manual_visits - agent_optimized_visits) / agent_manual_visits) * 100
        else:
            efficiency_gain = 0
            
        agent_stats.append({
            'agent_id': agent_id,
            'name': agent_name,
            'visits_before': agent_manual_visits,
            'visits_after': agent_optimized_visits,
            'efficiency_gain': efficiency_gain
        })
    
    return agent_stats

def get_daily_visit_comparison():
    """Get daily visit comparison between manual and optimized processes"""
    days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    day_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    
    daily_comparison = []
    
    for day, day_name in zip(days, day_names):
        manual_count = len(manual_df[manual_df['day'] == day])
        optimized_count = len(result_df[result_df['day'] == day])
        
        daily_comparison.append({
            'day': day_name,
            'manual': manual_count,
            'optimized': optimized_count
        })
    
    return daily_comparison

def get_store_chain_distribution():
    """Get store count and visit distribution by retail chain"""
    # Extract chain names from store names
    stores_df['chain'] = stores_df['store'].str.split(',').str[0]
    
    chain_stats = stores_df.groupby('chain').agg({
        'id': 'count',
        'sales': 'sum'
    }).reset_index()
    
    total_stores = len(stores_df)
    
    chains = []
    for _, row in chain_stats.iterrows():
        percentage = (row['id'] / total_stores) * 100
        chains.append({
            'chain': row['chain'],
            'count': int(row['id']),
            'percentage': round(percentage, 1)
        })
    
    return chains

def get_agent_performance_metrics():
    """Get detailed performance metrics for each field agent"""
    agent_performance = []
    
    for _, worker in workers_df.iterrows():
        agent_id = worker['worker_id']
        agent_name = worker['name']
        
        # Get visits for this agent
        agent_visits = result_df[result_df['worker_id'] == agent_id]
        weekly_visits = len(agent_visits)
        
        if weekly_visits > 0:
            # Calculate time percentages (simplified calculation)
            total_service_time = agent_visits['service_min'].sum()
            total_travel_time = agent_visits['trip_time'].sum()
            total_time = total_service_time + total_travel_time
            
            if total_time > 0:
                store_time_pct = (total_service_time / total_time) * 100
                travel_time_pct = (total_travel_time / total_time) * 100
                admin_time_pct = 100 - store_time_pct - travel_time_pct
            else:
                store_time_pct = travel_time_pct = admin_time_pct = 0
        else:
            store_time_pct = travel_time_pct = admin_time_pct = 0
        
        # Determine efficiency rating
        if weekly_visits >= 15:
            efficiency_rating = "Excellent"
        elif weekly_visits >= 12:
            efficiency_rating = "Good"
        elif weekly_visits >= 8:
            efficiency_rating = "Average"
        else:
            efficiency_rating = "Below Average"
        
        agent_performance.append({
            'agent_id': agent_id,
            'name': agent_name,
            'weekly_visits': weekly_visits,
            'store_time_percentage': round(store_time_pct, 1),
            'travel_time_percentage': round(travel_time_pct, 1),
            'admin_time_percentage': round(admin_time_pct, 1),
            'efficiency_rating': efficiency_rating
        })
    
    return agent_performance

def get_store_chain_analysis():
    """Get coverage analysis by retail chain"""
    # Extract chain names
    stores_df['chain'] = stores_df['store'].str.split(',').str[0]
    
    # Count visits per chain
    chain_visits = {}
    for _, visit in result_df.iterrows():
        store_id = visit['store_id_destination']
        if store_id in stores_df['id'].values:
            chain = stores_df[stores_df['id'] == store_id]['chain'].iloc[0]
            chain_visits[chain] = chain_visits.get(chain, 0) + 1
    
    chains = []
    for chain in stores_df['chain'].unique():
        store_count = len(stores_df[stores_df['chain'] == chain])
        weekly_visits = chain_visits.get(chain, 0)
        coverage_ratio = weekly_visits / store_count if store_count > 0 else 0
        
        chains.append({
            'chain': chain,
            'total_stores': store_count,
            'weekly_visits': weekly_visits,
            'coverage_ratio': round(coverage_ratio, 2)
        })
    
    return chains

def get_sales_range_analysis():
    """Get visit allocation based on store sales performance"""
    # Define sales ranges
    sales_ranges = [
        (0, 1000000, "$0-$1M"),
        (1000000, 2000000, "$1M-$2M"),
        (2000000, 5000000, "$2M-$5M"),
        (5000000, 10000000, "$5M-$10M"),
        (10000000, float('inf'), "$10M+")
    ]
    
    range_stats = []
    
    for min_sales, max_sales, range_label in sales_ranges:
        if max_sales == float('inf'):
            stores_in_range = stores_df[stores_df['sales'] >= min_sales]
        else:
            stores_in_range = stores_df[(stores_df['sales'] >= min_sales) & (stores_df['sales'] < max_sales)]
        
        store_count = len(stores_in_range)
        
        # Count visits to stores in this range
        weekly_visits = 0
        for _, visit in result_df.iterrows():
            store_id = visit['store_id_destination']
            if store_id in stores_in_range['id'].values:
                weekly_visits += 1
        
        avg_sales = stores_in_range['sales'].mean() if store_count > 0 else 0
        
        range_stats.append({
            'range': range_label,
            'store_count': store_count,
            'weekly_visits': weekly_visits,
            'avg_sales': round(avg_sales, 0)
        })
    
    return range_stats

def get_visit_time_distribution():
    """Get hourly distribution of store visits"""
    hourly_counts = {}
    
    for _, visit in result_df.iterrows():
        arrival_time = visit['arrival_time']
        hour = arrival_time.split(':')[0] + ':00'
        hourly_counts[hour] = hourly_counts.get(hour, 0) + 1
    
    # Sort by hour
    sorted_hours = sorted(hourly_counts.keys())
    
    hourly_distribution = []
    for hour in sorted_hours:
        hourly_distribution.append({
            'hour': hour,
            'visit_count': hourly_counts[hour]
        })
    
    return hourly_distribution

def get_stores_data():
    """Get all store locations with metadata"""
    stores = []
    
    for _, store in stores_df.iterrows():
        stores.append({
            'store_id': store['id'],
            'name': store['store'],
            'sales': store['sales'],
            'latitude': store['latitude'],
            'longitude': store['longitude'],
            'chain': store['store'].split(',')[0],
            'min_weekly_visits': store['min_weekly_visits'],
            'max_weekly_visits': store['max_weekly_visits']
        })
    
    return stores

def get_agents_data():
    """Get all field agent locations and assignments"""
    agents = []
    
    for _, worker in workers_df.iterrows():
        # Get assigned routes (simplified - just count visits)
        agent_visits = result_df[result_df['worker_id'] == worker['worker_id']]
        assigned_routes = [f"route_{i+1}" for i in range(len(agent_visits))]
        
        agents.append({
            'agent_id': worker['worker_id'],
            'name': worker['name'],
            'home_latitude': worker['home_latitude'],
            'home_longitude': worker['home_longitude'],
            'assigned_routes': assigned_routes
        })
    
    return agents

def get_routes_data(process_type: str):
    """Get route data for visualization (manual or optimized)"""
    if process_type == "manual":
        df = manual_df
    elif process_type == "optimized":
        df = result_df
    else:
        raise ValueError("process_type must be 'manual' or 'optimized'")
    
    routes = []
    
    for agent_id in df['worker_id'].unique():
        agent_routes = df[df['worker_id'] == agent_id]
        
        for day in agent_routes['day'].unique():
            day_routes = agent_routes[agent_routes['day'] == day]
            
            visits = []
            for _, visit in day_routes.iterrows():
                visits.append({
                    'store_id': visit['store_id_destination'],
                    'arrival_time': visit['arrival_time'],
                    'departure_time': visit['departure_time'],
                    'service_duration': visit['service_min'],
                    'travel_time': visit['trip_time']
                })
            
            routes.append({
                'agent_id': agent_id,
                'day': day,
                'visits': visits
            })
    
    return routes

# Load data on startup
@app.on_event("startup")
async def startup_event():
    load_data()

# Dashboard APIs
@app.get("/api/dashboard/kpis", response_model=KPIMetrics)
async def get_dashboard_kpis():
    """Get key performance indicators for the dashboard"""
    total_stores = len(stores_df)
    active_agents = len(workers_df)
    weekly_visits_manual = len(manual_df)
    weekly_visits_optimized = len(result_df)
    
    # Calculate average service time
    avg_service_time = result_df['service_min'].mean()
    
    # Calculate total sales coverage
    total_sales_coverage = stores_df['sales'].sum()
    
    return KPIMetrics(
        total_stores=total_stores,
        active_agents=active_agents,
        weekly_visits_manual=weekly_visits_manual,
        weekly_visits_optimized=weekly_visits_optimized,
        avg_service_time=round(avg_service_time, 1),
        total_sales_coverage=total_sales_coverage
    )

@app.get("/api/dashboard/efficiency-comparison", response_model=EfficiencyComparison)
async def get_efficiency_comparison():
    """Get daily visit comparison between manual and optimized processes"""
    daily_comparison = get_daily_visit_comparison()
    return EfficiencyComparison(daily_comparison=daily_comparison)

@app.get("/api/dashboard/store-chain-distribution", response_model=StoreChainDistribution)
async def get_store_chain_distribution_endpoint():
    """Get store count and visit distribution by retail chain"""
    chains = get_store_chain_distribution()
    return StoreChainDistribution(chains=chains)

# Before/After Comparison APIs
@app.get("/api/comparison/metrics", response_model=MetricsComparison)
async def get_comparison_metrics():
    """Get core comparison metrics between manual and optimized processes"""
    efficiency = calculate_visit_efficiency()
    
    metrics = [
        ComparisonMetric(
            metric="Total Weekly Visits",
            before=efficiency['manual_visits'],
            after=efficiency['optimized_visits'],
            unit="visits",
            improvement_percentage=round(efficiency['improvement_percentage'], 1)
        ),
        ComparisonMetric(
            metric="Average Service Time",
            before=int(manual_df['service_min'].mean()),
            after=int(result_df['service_min'].mean()),
            unit="minutes",
            improvement_percentage=0.0  # Calculate if needed
        ),
        ComparisonMetric(
            metric="Total Travel Time",
            before=int(manual_df['trip_time'].sum()),
            after=int(result_df['trip_time'].sum()),
            unit="minutes",
            improvement_percentage=0.0  # Calculate if needed
        )
    ]
    
    return MetricsComparison(metrics=metrics)

@app.get("/api/comparison/agent-performance", response_model=AgentPerformanceComparison)
async def get_agent_performance_comparison():
    """Get agent-level comparison of visit counts and efficiency"""
    agent_stats = analyze_agent_workload()
    
    agents = []
    for stat in agent_stats:
        agents.append(AgentPerformance(
            agent_id=stat['agent_id'],
            name=stat['name'],
            visits_before=stat['visits_before'],
            visits_after=stat['visits_after'],
            efficiency_gain=round(stat['efficiency_gain'], 1)
        ))
    
    return AgentPerformanceComparison(agents=agents)

@app.get("/api/comparison/weekly-distribution", response_model=WeeklyDistributionData)
async def get_weekly_distribution():
    """Get visit distribution across days of the week"""
    daily_comparison = get_daily_visit_comparison()
    
    weekly_data = []
    for day_data in daily_comparison:
        improvement = ((day_data['manual'] - day_data['optimized']) / day_data['manual']) * 100 if day_data['manual'] > 0 else 0
        weekly_data.append(WeeklyDistribution(
            day=day_data['day'],
            before=day_data['manual'],
            after=day_data['optimized'],
            improvement=round(improvement, 1)
        ))
    
    return WeeklyDistributionData(weekly_data=weekly_data)

# Coverage Analytics APIs
@app.get("/api/coverage/agent-performance", response_model=AgentCoverageData)
async def get_agent_performance():
    """Get detailed performance metrics for each field agent"""
    agent_performance = get_agent_performance_metrics()
    
    agents = []
    for perf in agent_performance:
        agents.append(AgentCoverage(
            agent_id=perf['agent_id'],
            name=perf['name'],
            weekly_visits=perf['weekly_visits'],
            store_time_percentage=perf['store_time_percentage'],
            travel_time_percentage=perf['travel_time_percentage'],
            admin_time_percentage=perf['admin_time_percentage'],
            efficiency_rating=perf['efficiency_rating']
        ))
    
    return AgentCoverageData(agents=agents)

@app.get("/api/coverage/store-chain-analysis", response_model=StoreChainAnalysis)
async def get_store_chain_analysis_endpoint():
    """Get coverage analysis by retail chain"""
    chains = get_store_chain_analysis()
    
    chain_analysis = []
    for chain in chains:
        chain_analysis.append(ChainAnalysis(
            chain=chain['chain'],
            total_stores=chain['total_stores'],
            weekly_visits=chain['weekly_visits'],
            coverage_ratio=chain['coverage_ratio']
        ))
    
    return StoreChainAnalysis(chains=chain_analysis)

@app.get("/api/coverage/sales-range-analysis", response_model=SalesRangeAnalysis)
async def get_sales_range_analysis_endpoint():
    """Get visit allocation based on store sales performance"""
    sales_ranges = get_sales_range_analysis()
    
    range_analysis = []
    for range_data in sales_ranges:
        range_analysis.append(SalesRange(
            range=range_data['range'],
            store_count=range_data['store_count'],
            weekly_visits=range_data['weekly_visits'],
            avg_sales=range_data['avg_sales']
        ))
    
    return SalesRangeAnalysis(sales_ranges=range_analysis)

@app.get("/api/coverage/visit-time-distribution", response_model=VisitTimeDistribution)
async def get_visit_time_distribution_endpoint():
    """Get hourly distribution of store visits"""
    hourly_distribution = get_visit_time_distribution()
    
    distribution = []
    for hour_data in hourly_distribution:
        distribution.append(HourlyDistribution(
            hour=hour_data['hour'],
            visit_count=hour_data['visit_count']
        ))
    
    return VisitTimeDistribution(hourly_distribution=distribution)

# Maps and Routing APIs
@app.get("/api/maps/stores", response_model=StoresData)
async def get_stores():
    """Get all store locations with metadata"""
    stores = get_stores_data()
    
    store_locations = []
    for store in stores:
        store_locations.append(StoreLocation(
            store_id=store['store_id'],
            name=store['name'],
            sales=store['sales'],
            latitude=store['latitude'],
            longitude=store['longitude'],
            chain=store['chain'],
            min_weekly_visits=store['min_weekly_visits'],
            max_weekly_visits=store['max_weekly_visits']
        ))
    
    return StoresData(stores=store_locations)

@app.get("/api/maps/agents", response_model=AgentsData)
async def get_agents():
    """Get all field agent locations and assignments"""
    agents = get_agents_data()
    
    agent_locations = []
    for agent in agents:
        agent_locations.append(AgentLocation(
            agent_id=agent['agent_id'],
            name=agent['name'],
            home_latitude=agent['home_latitude'],
            home_longitude=agent['home_longitude'],
            assigned_routes=agent['assigned_routes']
        ))
    
    return AgentsData(agents=agent_locations)

@app.get("/api/maps/routes/{process_type}", response_model=RoutesData)
async def get_routes(process_type: str):
    """Get route data for visualization (manual or optimized)"""
    if process_type not in ["manual", "optimized"]:
        raise HTTPException(status_code=400, detail="process_type must be 'manual' or 'optimized'")
    
    routes_data = get_routes_data(process_type)
    
    routes = []
    for route_data in routes_data:
        visits = []
        for visit_data in route_data['visits']:
            visits.append(RouteVisit(
                store_id=visit_data['store_id'],
                arrival_time=visit_data['arrival_time'],
                departure_time=visit_data['departure_time'],
                service_duration=visit_data['service_duration'],
                travel_time=visit_data['travel_time']
            ))
        
        routes.append(Route(
            agent_id=route_data['agent_id'],
            day=route_data['day'],
            visits=visits
        ))
    
    return RoutesData(routes=routes)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "Mattel Route Optimization API is running"}

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Mattel Route Optimization API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)