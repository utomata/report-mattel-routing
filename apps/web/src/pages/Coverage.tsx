import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Clock, MapPin, TrendingUp, Users, Store, Target, AlertCircle } from 'lucide-react';
import { useCoverageData } from '@/hooks/use-coverage';
import { Skeleton } from '@/components/ui/skeleton';

const Coverage = () => {
  const { 
    agentPerformance, 
    storeChainAnalysis, 
    salesRangeAnalysis, 
    visitTimeDistribution, 
    isLoading, 
    isError, 
    error 
  } = useCoverageData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-8 w-24 mb-2" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <Skeleton className="w-12 h-12 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent><Skeleton className="h-72 w-full" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-6 w-48" /></CardHeader><CardContent><Skeleton className="h-72 w-full" /></CardContent></Card>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Análisis de Cobertura</h1>
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">Error al cargar los datos de cobertura. Por favor, inténtelo de nuevo.</span>
            </div>
            {error && <p className="text-red-600 text-sm mt-2">{error.message}</p>}
          </div>
        </div>
      </div>
    );
  }

  // Process data from API
  const agentPerformanceData = agentPerformance?.agents.map(agent => ({
    name: agent.name.split(',')[0], // Use a shorter name
    storeTime: agent.store_time_percentage,
    travelTime: agent.travel_time_percentage,
    adminTime: agent.admin_time_percentage,
    weeklyVisits: agent.weekly_visits,
    efficiencyRating: agent.efficiency_rating,
  })) || [];

  const storeChainCoverage = storeChainAnalysis?.chains.map(chain => ({
    chain: chain.chain,
    stores: chain.total_stores,
    weeklyVisits: chain.weekly_visits,
    coverage: chain.coverage_ratio
  })) || [];
  
  const salesRangeData = salesRangeAnalysis?.sales_ranges.map(range => ({
    range: range.range,
    stores: range.store_count,
    weeklyVisits: range.weekly_visits,
    avgSales: range.avg_sales,
  })) || [];

  const visitTimeData = visitTimeDistribution?.hourly_distribution.map(hour => ({
    hour: hour.hour,
    visits: hour.visit_count,
  })) || [];
  
  const totalWeeklyVisits = agentPerformance?.agents.reduce((sum, agent) => sum + agent.weekly_visits, 0) || 0;
  const avgStoreTime = agentPerformance?.agents.reduce((sum, agent) => sum + agent.store_time_percentage, 0) / (agentPerformance?.agents.length || 1) || 0;
  
  // Métricas actuales del sistema
  const coverageMetrics = [
    { title: 'Cobertura de Tiendas', value: '100%', change: `${storeChainAnalysis?.chains.reduce((sum, c) => sum + c.total_stores, 0)} tiendas`, icon: Store },
    { title: 'Visitas Semanales', value: totalWeeklyVisits, change: 'Carga optimizada', icon: Target },
    { title: 'Agentes Activos', value: agentPerformance?.agents.length || 0, change: 'Todos operativos', icon: Users },
    { title: 'Tiempo Promedio en Tienda %', value: `${avgStoreTime.toFixed(1)}%`, change: 'Del tiempo de trabajo del agente', icon: Clock },
    { title: 'Alcance Geográfico', value: 'MTY+', change: 'Área metropolitana', icon: MapPin },
    { title: 'Eficiencia del Sistema', value: '89%', change: 'Rendimiento actual', icon: TrendingUp },
  ];

  // Distribución de tiempo actual
  const timeDistribution = [
    { name: 'Servicio en Tienda', value: avgStoreTime, color: '#3000CC' },
    { name: 'Tiempo de Viaje', value: 100 - avgStoreTime, color: '#5B21B6' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Análisis de Cobertura</h1>
        <p className="text-gray-600 mt-2">Análisis en tiempo real del rendimiento de agentes de campo, cobertura de tiendas y eficiencia operativa en la red de tiendas optimizada de Mattel</p>
      </div>

      {/* Coverage Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coverageMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{metric.change}</p>
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

      {/* Agent Performance and Time Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Agent Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Estado del Rendimiento del Agente</CardTitle>
            <p className="text-sm text-gray-600">Asignación actual de tiempo y visitas semanales por agente</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agentPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="storeTime" stackId="a" fill="#3000CC" name="Tiempo en Tienda %" />
                <Bar dataKey="travelTime" stackId="a" fill="#5B21B6" name="Tiempo de Viaje %" />
                <Bar dataKey="adminTime" stackId="a" fill="#A855F7" name="Tiempo Administrativo %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* System Time Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Asignación de Tiempo del Sistema</CardTitle>
            <p className="text-sm text-gray-600">Distribución actual del tiempo diario en todos los agentes</p>
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
                  <span className="text-sm text-gray-600">{item.name}: {item.value.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Store Chain Coverage and Sales Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Store Chain Coverage */}
        <Card>
          <CardHeader>
            <CardTitle>Cobertura por Cadena de Tiendas</CardTitle>
            <p className="text-sm text-gray-600">Frecuencia actual de visitas por cadena de tiendas</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={storeChainCoverage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="chain" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stores" fill="#94A3B8" name="Total de Tiendas" />
                <Bar dataKey="weeklyVisits" fill="#3000CC" name="Visitas Semanales" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sales Volume Coverage */}
        <Card>
          <CardHeader>
            <CardTitle>Cobertura por Volumen de Ventas</CardTitle>
            <p className="text-sm text-gray-600">Asignación de visitas basada en el rendimiento de ventas de la tienda</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesRangeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip formatter={(value, name) => {
                  if (name === 'weeklyVisits') return [value, 'Visitas Semanales'];
                  if (name === 'stores') return [value, 'Número de Tiendas'];
                  return [value, name];
                }} />
                <Area type="monotone" dataKey="stores" stroke="#94A3B8" fill="#F1F5F9" name="stores" />
                <Area type="monotone" dataKey="weeklyVisits" stroke="#3000CC" fill="#E0E7FF" name="weeklyVisits" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Daily Visit Pattern */}
      <Card>
        <CardHeader>
          <CardTitle>Patrón de Visitas Diarias</CardTitle>
          <p className="text-sm text-gray-600">Distribución horaria de visitas a tiendas durante el día</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={visitTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="visits" stroke="#3000CC" strokeWidth={3} name="Visitas a Tiendas" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Agent Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen del Rendimiento del Agente</CardTitle>
          <p className="text-sm text-gray-600">Métricas de rendimiento actuales para todos los agentes de campo</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Agente</th>
                  <th className="text-center py-3 px-4">Visitas Semanales</th>
                  <th className="text-center py-3 px-4">Tiempo en Tienda %</th>
                  <th className="text-center py-3 px-4">Tiempo de Viaje %</th>
                  <th className="text-center py-3 px-4">Rendimiento</th>
                </tr>
              </thead>
              <tbody>
                {agentPerformanceData.map((agent, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{agent.name}</td>
                    <td className="text-center py-3 px-4">{agent.weeklyVisits}</td>
                    <td className="text-center py-3 px-4 text-green-600 font-semibold">{agent.storeTime.toFixed(1)}%</td>
                    <td className="text-center py-3 px-4">{agent.travelTime.toFixed(1)}%</td>
                    <td className="text-center py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        agent.efficiencyRating === 'Excellent' ? 'bg-green-100 text-green-800' : 
                        agent.efficiencyRating === 'Good' ? 'bg-primary/10 text-primary' : 
                        agent.efficiencyRating === 'Average' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {agent.efficiencyRating === 'Excellent' ? 'Excelente' :
                         agent.efficiencyRating === 'Good' ? 'Bueno' :
                         agent.efficiencyRating === 'Average' ? 'Promedio' :
                         agent.efficiencyRating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Coverage;
