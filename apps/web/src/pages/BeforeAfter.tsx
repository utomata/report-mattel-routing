import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { TrendingUp, TrendingDown, Users, Clock, Target, AlertCircle } from 'lucide-react';
import { useComparisonData } from '@/hooks/use-comparison';
import { useDashboardData } from '@/hooks/use-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTableSimple } from '@/components/store-table/data-table-simple';
import { columns } from '@/components/store-table/columns';
import { DataTable as AgentDataTable } from '@/components/agent-table/data-table';
import { columns as agentColumns } from '@/components/agent-table/columns';

const BeforeAfter = () => {
  const { metrics, agentPerformance, storePerformance, isLoading, isError, error } = useComparisonData();
  const { kpis } = useDashboardData();

  const metricTranslations: { [key: string]: string } = {
    'Total Weekly Visits': 'Visitas Semanales Totales',
    'Sales Coverage': 'Cobertura de Ventas',
    'Agent Utilization': 'Utilización de Agentes',
    'Store Utilization': 'Utilización de Tiendas',
  };

  const unitTranslations: { [key: string]: string } = {
    visits: 'visitas',
    'M MXN': 'M MXN',
    percent: '%',
    tiendas: 'tiendas',
  };



  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-96 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Antes y Después: Análisis de Optimización de Rutas</h1>
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">Error al cargar los datos de comparación. Por favor, inténtelo de nuevo más tarde.</span>
            </div>
            {error && (
              <p className="text-red-600 text-sm mt-2">{error.message}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Format comparison metrics from API data
  const comparisonMetrics = metrics?.metrics.map(metric => ({
    metric: metricTranslations[metric.metric as keyof typeof metricTranslations] || metric.metric,
    before: metric.before,
    after: metric.after,
    unit: unitTranslations[metric.unit as keyof typeof unitTranslations] || metric.unit,
    improvement_percentage: metric.improvement_percentage,
    isReduction: metric.improvement_percentage < 0,
  })) || [];

  // Format agent performance data
  const agentComparison = agentPerformance?.agents.map(agent => ({
    agent: agent.name,
    before: agent.visits_before,
    after: agent.visits_after,
    efficiency_gain: agent.efficiency_gain,
  })) || [];

  // Format store performance data
  const storeComparison = storePerformance?.stores.map(store => ({
    store: store.name,
    chain: store.chain,
    sales: store.sales,
    before: store.visits_before,
    after: store.visits_after,
    change: store.visit_change,
  })) || [];



  // Calculate summary metrics
  const totalVisitsBefore = metrics?.metrics.find(m => m.metric === 'Total Weekly Visits')?.before || 0;
  const totalVisitsAfter = metrics?.metrics.find(m => m.metric === 'Total Weekly Visits')?.after || 0;
  const avgServiceTimeBefore = metrics?.metrics.find(m => m.metric === 'Average Service Time')?.before || 0;
  const avgServiceTimeAfter = metrics?.metrics.find(m => m.metric === 'Average Service Time')?.after || 0;
  const totalTravelTimeBefore = metrics?.metrics.find(m => m.metric === 'Total Travel Time')?.before || 0;
  const totalTravelTimeAfter = metrics?.metrics.find(m => m.metric === 'Total Travel Time')?.after || 0;
  const visitReduction = totalVisitsBefore > 0 ? ((totalVisitsBefore - totalVisitsAfter) / totalVisitsBefore * 100) : 0;
  const avgEfficiencyGain = agentPerformance?.agents.reduce((sum, agent) => sum + agent.efficiency_gain, 0) / (agentPerformance?.agents.length || 1);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Antes y Después: Análisis de Optimización de Rutas</h1>
        <p className="text-gray-600 mt-2">Comparación exhaustiva entre el proceso de enrutamiento manual y las rutas optimizadas con Utomata para las operaciones de campo de Mattel</p>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {comparisonMetrics.map((metric, index) => {
          const change = metric.after - metric.before;
          const percentChange = metric.improvement_percentage;
          const isImprovement = metric.isReduction ? change < 0 : change > 0;
          
          // Display value with unit
          const getDisplayValue = (value: number, unit: string) => {
            return `${value} ${unit}`;
          };
          
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{metric.metric}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                                    {/* Manual vs Optimized - Visual comparison */}
                  <div className="space-y-3">
                    {/* Manual Process */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                      <div className="text-sm text-red-700 font-medium mb-2">Manual</div>
                      <div className="text-xl font-bold text-red-800">
                        {getDisplayValue(metric.before, metric.unit)}
                      </div>
                    </div>
                    
                    {/* Arrow indicator */}
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Optimized Process */}
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
                      <div className="text-sm text-primary font-medium mb-2">Utomata</div>
                      <div className="text-xl font-bold text-primary">
                        {getDisplayValue(metric.after, metric.unit)}
                      </div>
                    </div>
                    
                    {/* Equals indicator */}
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                        <span className="text-gray-600 font-bold text-lg">=</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Improvement indicator */}
                  <div className={`border rounded-lg p-4 text-center ${
                    isImprovement ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="text-sm font-medium mb-2 text-gray-700">Cambio</div>
                    <div className={`text-xl font-bold ${
                      isImprovement ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {metric.before > 0 ? (
                        <>
                          {((metric.after - metric.before) / metric.before * 100) > 0 ? '+' : ''}
                          {(((metric.after - metric.before) / metric.before * 100)).toFixed(1)}%
                        </>
                      ) : (
                        'N/A'
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>



      {/* Agent Performance Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Comparación del Rendimiento del Agente</CardTitle>
          <p className="text-sm text-gray-600">Visitas semanales por agente: enrutamiento manual vs optimizado</p>
        </CardHeader>
        <CardContent>
          <AgentDataTable columns={agentColumns} data={agentComparison} />
        </CardContent>
      </Card>

      {/* Store Performance Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Comparación del Rendimiento de Tiendas</CardTitle>
          <p className="text-sm text-gray-600">Visitas semanales por tienda: enrutamiento manual vs optimizado</p>
        </CardHeader>
        <CardContent>
          <DataTableSimple columns={columns} data={storeComparison} />
        </CardContent>
      </Card>
    </div>
  );
};

export default BeforeAfter;