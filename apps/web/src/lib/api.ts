// API Base URL - Use environment variable or empty string for same-origin requests
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Types based on the OpenAPI schema
export interface KPIMetrics {
  total_stores: number;
  active_agents: number;
  weekly_visits_manual: number;
  weekly_visits_optimized: number;
  avg_service_time: number;
  total_sales_coverage: number;
}

export interface DailyComparison {
  day: string;
  manual: number;
  optimized: number;
}

export interface EfficiencyComparison {
  daily_comparison: DailyComparison[];
}

export interface ChainDistribution {
  chain: string;
  count: number;
  percentage: number;
}

export interface StoreChainDistribution {
  chains: ChainDistribution[];
}

export interface ComparisonMetric {
  metric: string;
  before: number;
  after: number;
  unit: string;
  improvement_percentage: number;
}

export interface MetricsComparison {
  metrics: ComparisonMetric[];
}

export interface AgentPerformance {
  agent_id: string;
  name: string;
  visits_before: number;
  visits_after: number;
  efficiency_gain: number;
}

export interface AgentPerformanceComparison {
  agents: AgentPerformance[];
}

export interface WeeklyDistribution {
  day: string;
  before: number;
  after: number;
  improvement: number;
}

export interface WeeklyDistributionData {
  weekly_data: WeeklyDistribution[];
}

export interface AgentCoverage {
  agent_id: string;
  name: string;
  weekly_visits: number;
  store_time_percentage: number;
  travel_time_percentage: number;
  admin_time_percentage: number;
  efficiency_rating: string;
}

export interface AgentCoverageData {
  agents: AgentCoverage[];
}

export interface ChainAnalysis {
  chain: string;
  total_stores: number;
  weekly_visits: number;
  coverage_ratio: number;
}

export interface StoreChainAnalysis {
  chains: ChainAnalysis[];
}



export interface HourlyDistribution {
  hour: string;
  visit_count: number;
}

export interface VisitTimeDistribution {
  hourly_distribution: HourlyDistribution[];
}

export interface DailyVisits {
  Monday: number;
  Tuesday: number;
  Wednesday: number;
  Thursday: number;
  Friday: number;
  Saturday: number;
  Sunday: number;
}

export interface ChainStore {
  store_id: string;
  name: string;
  sales: number;
  weekly_visits: number;
  min_weekly_visits: number;
  max_weekly_visits: number;
  coverage_status: string;
  daily_visits: DailyVisits;
  latitude: number;
  longitude: number;
}

export interface ChainStoresData {
  chain: string;
  total_stores: number;
  stores: ChainStore[];
}

export interface AgentStore {
  name: string;
  sales: number;
  coverage_status: string;
  weekly_visits: number;
  daily_visits: DailyVisits;
}

export interface AgentStoresData {
  agent: string;
  stores: AgentStore[];
}

export interface StoreLocation {
  store_id: string;
  name: string;
  sales: number;
  latitude: number;
  longitude: number;
  chain: string;
  min_weekly_visits: number;
  max_weekly_visits: number;
}

export interface StoresData {
  stores: StoreLocation[];
}

export interface AgentLocation {
  agent_id: string;
  name: string;
  home_latitude: number;
  home_longitude: number;
  assigned_routes: string[];
}

export interface AgentsData {
  agents: AgentLocation[];
}

export interface RouteVisit {
  store_id: string;
  arrival_time: string;
  departure_time: string;
  service_duration: number;
  travel_time: number;
}

export interface Route {
  agent_id: string;
  day: string;
  visits: RouteVisit[];
}

export interface RoutesData {
  routes: Route[];
}

// API Service class
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  // Dashboard APIs
  async getDashboardKPIs(): Promise<KPIMetrics> {
    return this.request<KPIMetrics>('/api/dashboard/kpis');
  }

  async getEfficiencyComparison(): Promise<EfficiencyComparison> {
    return this.request<EfficiencyComparison>('/api/dashboard/efficiency-comparison');
  }

  async getStoreChainDistribution(): Promise<StoreChainDistribution> {
    return this.request<StoreChainDistribution>('/api/dashboard/store-chain-distribution');
  }

  // Before/After Comparison APIs
  async getComparisonMetrics(): Promise<MetricsComparison> {
    return this.request<MetricsComparison>('/api/comparison/metrics');
  }

  async getAgentPerformanceComparison(): Promise<AgentPerformanceComparison> {
    return this.request<AgentPerformanceComparison>('/api/comparison/agent-performance');
  }

  async getWeeklyDistribution(): Promise<WeeklyDistributionData> {
    return this.request<WeeklyDistributionData>('/api/comparison/weekly-distribution');
  }

  // Coverage Analytics APIs
  async getAgentPerformance(): Promise<AgentCoverageData> {
    return this.request<AgentCoverageData>('/api/coverage/agent-performance');
  }

  async getStoreChainAnalysis(): Promise<StoreChainAnalysis> {
    return this.request<StoreChainAnalysis>('/api/coverage/store-chain-analysis');
  }



  async getVisitTimeDistribution(): Promise<VisitTimeDistribution> {
    return this.request<VisitTimeDistribution>('/api/coverage/visit-time-distribution');
  }

  // Chain and Agent specific store APIs
  async getChainStores(chainName: string): Promise<ChainStoresData> {
    return this.request<ChainStoresData>(`/api/coverage/chain-stores/${encodeURIComponent(chainName)}`);
  }

  async getAgentStores(agentName: string): Promise<AgentStoresData> {
    return this.request<AgentStoresData>(`/api/coverage/agent-stores/${encodeURIComponent(agentName)}`);
  }

  // Maps and Routing APIs
  async getStores(): Promise<StoresData> {
    return this.request<StoresData>('/api/maps/stores');
  }

  async getAgents(): Promise<AgentsData> {
    return this.request<AgentsData>('/api/maps/agents');
  }

  async getRoutes(processType: 'manual' | 'optimized'): Promise<RoutesData> {
    return this.request<RoutesData>(`/api/maps/routes/${processType}`);
  }

  // Health check
  async getHealth(): Promise<{ status: string; message: string }> {
    return this.request<{ status: string; message: string }>('/health');
  }
}

// Export singleton instance
export const apiService = new ApiService();

// React Query hooks for easy integration
export const API_ENDPOINTS = {
  dashboard: {
    kpis: '/api/dashboard/kpis',
    efficiencyComparison: '/api/dashboard/efficiency-comparison',
    storeChainDistribution: '/api/dashboard/store-chain-distribution',
  },
  comparison: {
    metrics: '/api/comparison/metrics',
    agentPerformance: '/api/comparison/agent-performance',
    weeklyDistribution: '/api/comparison/weekly-distribution',
  },
  coverage: {
    agentPerformance: '/api/coverage/agent-performance',
    storeChainAnalysis: '/api/coverage/store-chain-analysis',
    visitTimeDistribution: '/api/coverage/visit-time-distribution',
  },
  maps: {
    stores: '/api/maps/stores',
    agents: '/api/maps/agents',
    routes: (processType: string) => `/api/maps/routes/${processType}`,
  },
  health: '/health',
} as const; 