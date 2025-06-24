import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, MapPin, DollarSign, Clock, Target, AlertCircle, Activity } from 'lucide-react';
import { useDashboardData } from '@/hooks/use-dashboard';
import { useAgentTimeDistribution } from '@/hooks/use-agent-time-distribution';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { kpis, isLoading, isError, error } = useDashboardData();
  const { data: timeDistributionData, loading: timeDistributionLoading, error: timeDistributionError } = useAgentTimeDistribution();

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-96 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
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
          <h1 className="text-3xl font-bold text-gray-900">Panel de Optimización de Rutas Mattel</h1>
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">Error al cargar los datos del panel. Por favor, inténtelo de nuevo más tarde.</span>
            </div>
            {error && (
              <p className="text-red-600 text-sm mt-2">{error.message}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Calculate utilization rate (from your data: 98.40%)
  const utilizationRate = 98.4;

  // Format KPI data - only current optimized state
  const kpiData = kpis ? [
    { title: 'Tiendas Totales', value: kpis.total_stores.toString(), change: 'Puntos de venta Mattel', icon: MapPin },
    { title: 'Agentes de Campo Activos', value: kpis.active_agents.toString(), change: 'Equipo operativo en campo', icon: Users },
            { title: 'Visitas Semanales', value: kpis.weekly_visits_optimized.toString(), change: 'Optimizado con Utomata', icon: Target },
    { title: 'Tiempo Promedio de Servicio', value: `${Math.round(kpis.avg_service_time)} min`, change: 'Por visita a tienda', icon: Clock },
    { title: 'Cobertura de Ventas', value: `$${(kpis.total_sales_coverage / 1000000).toFixed(1)}M`, change: 'Valor de ventas de tiendas cubiertas', icon: DollarSign },
    { title: 'Utilización del Equipo', value: `${utilizationRate}%`, change: 'Eficiencia operativa del equipo', icon: Activity },
  ] : [];

  // Agent time distribution from API
  const timeDistribution = timeDistributionData?.distribution || [
    { name: 'Servicio en Tienda', value: 87, color: '#3000CC' },
    { name: 'Tiempo de Viaje', value: 9, color: '#5B21B6' },
    { name: 'Administrativo', value: 4, color: '#A855F7' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Optimización de Rutas Mattel</h1>
        <p className="text-gray-600 mt-2">Estado actual del sistema optimizado para {kpis?.total_stores || 0} tiendas en el área metropolitana de Monterrey</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{kpi.change}</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Agent Time Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Tiempo del Agente</CardTitle>
          <p className="text-sm text-gray-600">Asignación optimizada del tiempo diario por agente</p>
        </CardHeader>
        <CardContent>
          {timeDistributionLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-64 w-full rounded-full" />
              <div className="flex justify-center space-x-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-32" />
                ))}
              </div>
            </div>
          ) : timeDistributionError ? (
            <div className="text-red-600 text-center py-8">
              <AlertCircle className="w-5 h-5 mx-auto mb-2" />
              Error al cargar distribución de tiempo
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={timeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {timeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center space-x-4 mt-4">
                {timeDistribution.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
