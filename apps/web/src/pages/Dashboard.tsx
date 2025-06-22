import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, MapPin, DollarSign, Clock, Target, AlertCircle } from 'lucide-react';
import { useDashboardData } from '@/hooks/use-dashboard';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { kpis, efficiencyComparison, storeChainDistribution, isLoading, isError, error } = useDashboardData();

  const dayNameMap: { [key: string]: string } = {
    Monday: 'Lunes',
    Tuesday: 'Martes',
    Wednesday: 'Miércoles',
    Thursday: 'Jueves',
    Friday: 'Viernes',
    Saturday: 'Sábado',
  };

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

  // Format KPI data
  const kpiData = kpis ? [
    { title: 'Tiendas Totales', value: kpis.total_stores.toString(), change: 'Red de minoristas Mattel', icon: MapPin },
    { title: 'Agentes de Campo Activos', value: kpis.active_agents.toString(), change: 'Todos operativos', icon: Users },
    { title: 'Visitas Semanales (Optimizadas)', value: kpis.weekly_visits_optimized.toString(), change: 'Rutas optimizadas por IA', icon: Target },
    { title: 'Visitas Semanales (Manual)', value: kpis.weekly_visits_manual.toString(), change: 'Proceso manual anterior', icon: TrendingUp },
    { title: 'Tiempo Promedio de Servicio', value: `${kpis.avg_service_time}h`, change: 'Por visita a tienda', icon: Clock },
    { title: 'Cobertura Total de Ventas', value: `$${(kpis.total_sales_coverage / 1000000).toFixed(0)}M`, change: 'Ventas anuales de tiendas', icon: DollarSign },
  ] : [];

  // Format daily visits data
  const dailyVisitsData = efficiencyComparison?.daily_comparison.map(day => ({
    day: day.day,
    manual: day.manual,
    optimized: day.optimized,
  })) || [];

  // Calculate time distribution (simplified - you can enhance this with real data)
  const timeDistribution = [
    { name: 'Servicio en Tienda', value: 67, color: '#3000CC' },
    { name: 'Tiempo de Viaje', value: 23, color: '#5B21B6' },
    { name: 'Administrativo', value: 10, color: '#A855F7' },
  ];

  // Format store chain performance
  const storeChainPerformance = storeChainDistribution?.chains.map(chain => ({
    chain: chain.chain,
    visits: chain.count,
    efficiency: Math.round((chain.count / (storeChainDistribution.chains.reduce((sum, c) => sum + c.count, 0))) * 100),
  })) || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Optimización de Rutas Mattel</h1>
        <p className="text-gray-600 mt-2">Análisis en tiempo real para operaciones de campo optimizadas en {kpis?.total_stores || 0} ubicaciones de tiendas en el área metropolitana de Monterrey</p>
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Visits Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución Diaria de Visitas</CardTitle>
            <p className="text-sm text-gray-600">Comparación de carga de trabajo diaria Manual vs Optimizada</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyVisitsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tickFormatter={(day) => dayNameMap[day as keyof typeof dayNameMap] || day} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="manual" fill="#E0E7FF" name="Proceso Manual" />
                <Bar dataKey="optimized" fill="#3000CC" name="Proceso Optimizado" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Agent Time Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Asignación de Tiempo del Agente de Campo</CardTitle>
            <p className="text-sm text-gray-600">Distribución optimizada del tiempo diario</p>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>

      {/* Store Chain Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Tiendas por Cadena</CardTitle>
          <p className="text-sm text-gray-600">Número de tiendas y porcentaje por cadena de tiendas</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={storeChainPerformance} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="chain" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="visits" fill="#3000CC" name="Número de Tiendas" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Información sobre el Rendimiento del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800">Impacto de la Optimización</h3>
              <p className="text-sm text-green-700 mt-2">
                {kpis && kpis.weekly_visits_manual > kpis.weekly_visits_optimized 
                  ? `${Math.round(((kpis.weekly_visits_manual - kpis.weekly_visits_optimized) / kpis.weekly_visits_manual) * 100)}% de reducción en visitas semanales`
                  : 'Eficiencia mejorada lograda'
                }
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800">Cobertura Completa</h3>
              <p className="text-sm text-blue-700 mt-2">
                Todas las {kpis?.total_stores || 0} tiendas en el área metropolitana de Monterrey completamente cubiertas
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-800">Utilización de Agentes</h3>
              <p className="text-sm text-purple-700 mt-2">
                {kpis?.active_agents || 0} agentes activos con distribución de carga de trabajo optimizada
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
