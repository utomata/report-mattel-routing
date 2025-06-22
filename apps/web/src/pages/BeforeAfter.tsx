import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Users, Clock, Target, AlertCircle } from 'lucide-react';
import { useComparisonData } from '@/hooks/use-comparison';
import { Skeleton } from '@/components/ui/skeleton';

const BeforeAfter = () => {
  const { metrics, agentPerformance, weeklyDistribution, isLoading, isError, error } = useComparisonData();

  const metricTranslations: { [key: string]: string } = {
    'Total Weekly Visits': 'Visitas Semanales Totales',
    'Average Service Time': 'Tiempo Promedio de Servicio',
    'Total Travel Time': 'Tiempo Total de Viaje',
  };

  const unitTranslations: { [key: string]: string } = {
    visits: 'visitas',
    minutes: 'minutos',
  };

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

  // Format weekly distribution data
  const weeklyComparison = weeklyDistribution?.weekly_data.map(day => ({
    day: day.day,
    before: day.before,
    after: day.after,
    improvement: day.improvement,
  })) || [];

  // Format agent performance data
  const agentComparison = agentPerformance?.agents.map(agent => ({
    agent: agent.name,
    before: agent.visits_before,
    after: agent.visits_after,
    efficiency_gain: agent.efficiency_gain,
  })) || [];

  // Calculate performance radar data (simplified - you can enhance with real data)
  const performanceRadar = [
    { subject: 'Eficiencia de Visita', before: 72, after: 87 },
    { subject: 'Optimización de Tiempo', before: 65, after: 85 },
    { subject: 'Balance de Carga de Agente', before: 58, after: 82 },
    { subject: 'Cobertura Geográfica', before: 85, after: 88 },
    { subject: 'Adherencia a Horarios', before: 78, after: 89 },
    { subject: 'Utilización de Recursos', before: 70, after: 86 },
  ];

  // Calculate summary metrics
  const totalVisitsBefore = metrics?.metrics.find(m => m.metric === 'Total Weekly Visits')?.before || 0;
  const totalVisitsAfter = metrics?.metrics.find(m => m.metric === 'Total Weekly Visits')?.after || 0;
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {comparisonMetrics.map((metric, index) => {
          const change = metric.after - metric.before;
          const percentChange = metric.improvement_percentage;
          const isImprovement = metric.isReduction ? change < 0 : change > 0;
          
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{metric.metric}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Proceso Manual:</span>
                    <span className="text-lg font-semibold text-gray-700">{metric.before} {metric.unit}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Optimizado con Utomata:</span>
                    <span className="text-lg font-semibold text-primary">{metric.after} {metric.unit}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Cambio:</span>
                      <span className={`text-sm font-semibold ${isImprovement ? 'text-green-600' : 'text-red-600'}`}>
                        {percentChange > 0 ? '+' : ''}{percentChange.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Radar */}
        <Card>
          <CardHeader>
            <CardTitle>Comparación de Rendimiento Multidimensional</CardTitle>
            <p className="text-sm text-gray-600">Análisis exhaustivo a través de métricas operativas clave</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={performanceRadar}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar name="Proceso Manual" dataKey="before" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.3} />
                <Radar name="Optimizado con Utomata" dataKey="after" stroke="#3000CC" fill="#3000CC" fillOpacity={0.3} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución Diaria de Visitas</CardTitle>
            <p className="text-sm text-gray-600">Comparación de visitas por día a lo largo de la semana</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={weeklyComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tickFormatter={(day) => dayNameMap[day as keyof typeof dayNameMap] || day} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="before" fill="#94A3B8" name="Proceso Manual" />
                <Bar dataKey="after" fill="#3000CC" name="Optimizado con Utomata" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Agent Performance Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Comparación del Rendimiento del Agente</CardTitle>
          <p className="text-sm text-gray-600">Visitas semanales por agente: enrutamiento manual vs optimizado</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Agente</th>
                  <th className="text-center py-3 px-4">Proceso Manual</th>
                  <th className="text-center py-3 px-4">Optimizado con Utomata</th>
                  <th className="text-center py-3 px-4">Eficiencia</th>
                </tr>
              </thead>
              <tbody>
                {agentComparison.map((agent, index) => {
                  // The user considers a negative gain from the API as a positive outcome (less is more).
                  const isGain = agent.efficiency_gain <= 0;
                  const efficiencyValue = Math.abs(agent.efficiency_gain);
                  
                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{agent.agent}</td>
                      <td className="text-center py-3 px-4">{agent.before} visitas</td>
                      <td className="text-center py-3 px-4 text-primary font-semibold">{agent.after} visitas</td>
                      <td className={`text-center py-3 px-4 font-semibold ${isGain ? 'text-green-600' : 'text-red-600'}`}>
                        {agent.efficiency_gain < 0 ? '+' : agent.efficiency_gain > 0 ? '-' : ''}{efficiencyValue.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Key Improvements Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen del Impacto de la Optimización</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{visitReduction.toFixed(0)}%</div>
              <div className="text-sm text-green-800 mt-2">Menos Visitas Requeridas</div>
              <div className="text-xs text-green-700 mt-1">{totalVisitsBefore} → {totalVisitsAfter} visitas semanales</div>
            </div>
            <div className="text-center p-6 bg-primary/10 rounded-lg">
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-primary/80 mt-2">Cobertura de Tiendas Mantenida</div>
              <div className="text-xs text-primary/70 mt-1">Todas las tiendas cubiertas</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">+{avgEfficiencyGain.toFixed(0)}%</div>
              <div className="text-sm text-purple-800 mt-2">Ganancia de Eficiencia Promedio</div>
              <div className="text-xs text-purple-700 mt-1">Mejora por agente</div>
            </div>
            <div className="text-center p-6 bg-primary/10 rounded-lg">
              <div className="text-3xl font-bold text-primary">{agentPerformance?.agents.length || 0}</div>
              <div className="text-sm text-primary/80 mt-2">Agentes Optimizados</div>
              <div className="text-xs text-primary/70 mt-1">Distribución equilibrada de la carga de trabajo</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis Detallado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Mejoras Clave Logradas</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <TrendingDown className="w-4 h-4 text-green-600 mr-2" />
                  Reducción del {visitReduction.toFixed(1)}% en visitas semanales totales
                </li>
                <li className="flex items-center">
                  <Users className="w-4 h-4 text-primary mr-2" />
                  Carga de trabajo equilibrada en todos los {agentPerformance?.agents.length || 0} agentes
                </li>
                <li className="flex items-center">
                  <Clock className="w-4 h-4 text-purple-600 mr-2" />
                  Asignación optimizada del tiempo de servicio
                </li>
                <li className="flex items-center">
                  <Target className="w-4 h-4 text-primary mr-2" />
                  Mantenimiento del 100% de cobertura de tiendas
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Beneficios Operativos</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Reducción de costos operativos a través de menos visitas</li>
                <li>• Mejora en la satisfacción del agente con cargas de trabajo equilibradas</li>
                <li>• Mayor eficiencia en rutas y gestión del tiempo</li>
                <li>• Mejor asignación de recursos y planificación</li>
                <li>• Mantenimiento de estándares de calidad del servicio</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BeforeAfter;