import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Eye, Store, TrendingUp, Target, BarChart3, MapPin, DollarSign } from 'lucide-react';
import { useCoverageData } from '@/hooks/use-coverage';
import { useChainStores } from '@/hooks/use-chain-stores';
import { useAgentStores } from '@/hooks/use-agent-stores';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const Coverage = () => {
  const [selectedChain, setSelectedChain] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  
  const { 
    agentPerformance, 
    storeChainAnalysis, 
    isLoading, 
    isError, 
    error 
  } = useCoverageData();

  const { 
    stores: chainStores, 
    isLoading: isLoadingStores, 
    error: storesError 
  } = useChainStores(selectedChain);

  const { 
    stores: agentStores, 
    isLoading: isLoadingAgentStores, 
    error: agentStoresError 
  } = useAgentStores(selectedAgent);



  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
              <CardContent><Skeleton className="h-72 w-full" /></CardContent>
            </Card>
          ))}
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
    name: agent.name,
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
  


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Análisis de Cobertura</h1>
        <p className="text-gray-600 mt-2">Análisis detallado del rendimiento de agentes, cobertura de tiendas y distribución por volumen de ventas</p>
      </div>

      {/* Agent Performance Table - Priority 1 */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento del Agente</CardTitle>
          <p className="text-sm text-gray-600">Métricas de rendimiento para todos los agentes de campo activos</p>
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
                  <th className="text-center py-3 px-4">Acción</th>
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
                    <td className="text-center py-3 px-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAgent(agent.name)}
                        className="flex items-center justify-center space-x-1 mx-auto"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Ver</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Store Chain Performance Table - Priority 2 */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento de Cadenas</CardTitle>
          <p className="text-sm text-gray-600">Métricas de cobertura y rendimiento por cadena de tiendas</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
                              <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Cadena</th>
                    <th className="text-center py-3 px-4">Total Tiendas</th>
                    <th className="text-center py-3 px-4">Visitas Semanales</th>
                    <th className="text-center py-3 px-4">Ratio Cobertura</th>
                    <th className="text-center py-3 px-4">Estado</th>
                    <th className="text-center py-3 px-4">Acción</th>
                  </tr>
                </thead>
              <tbody>
                {storeChainCoverage.map((chain, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{chain.chain}</td>
                    <td className="text-center py-3 px-4">{chain.stores}</td>
                    <td className="text-center py-3 px-4 text-blue-600 font-semibold">{chain.weeklyVisits}</td>
                    <td className="text-center py-3 px-4">{chain.coverage.toFixed(2)}</td>
                    <td className="text-center py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        chain.coverage >= 1.0 ? 'bg-green-100 text-green-800' : 
                        chain.coverage >= 0.8 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {chain.coverage >= 1.0 ? 'Óptima' :
                         chain.coverage >= 0.8 ? 'Buena' :
                         'Mejorable'}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedChain(chain.chain)}
                        className="flex items-center justify-center space-x-1 mx-auto"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Ver</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Sheet for Chain Details */}
      <Sheet open={!!selectedChain} onOpenChange={(open) => !open && setSelectedChain(null)}>
        <SheetContent 
          side="right" 
          className="overflow-hidden [&]:!w-[1000px] [&]:!max-w-[1000px] [&]:!min-w-[1000px]"
        >
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Store className="w-5 h-5 mr-2" />
                Calendario de Visitas - {selectedChain}
              </div>
              {!isLoadingStores && !storesError && (
                <span className="text-sm font-normal text-gray-500">
                  {chainStores.length} tiendas
                </span>
              )}
            </SheetTitle>
            <SheetDescription>
              Programación semanal de visitas por tienda - Ordenadas por volumen de ventas
            </SheetDescription>
          </SheetHeader>
          <div className="py-6 max-h-[calc(100vh-180px)] overflow-y-auto">
            {isLoadingStores ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : storesError ? (
              <div className="text-red-600 text-center py-8">
                Error al cargar las tiendas: {storesError.message}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold bg-gray-50 sticky left-0 z-10 min-w-[250px]">
                        Tienda
                      </th>
                      <th className="text-center py-3 px-4 font-semibold bg-blue-50 min-w-[80px]">
                        Lun
                      </th>
                      <th className="text-center py-3 px-4 font-semibold bg-blue-50 min-w-[80px]">
                        Mar
                      </th>
                      <th className="text-center py-3 px-4 font-semibold bg-blue-50 min-w-[80px]">
                        Mié
                      </th>
                      <th className="text-center py-3 px-4 font-semibold bg-blue-50 min-w-[80px]">
                        Jue
                      </th>
                      <th className="text-center py-3 px-4 font-semibold bg-blue-50 min-w-[80px]">
                        Vie
                      </th>
                      <th className="text-center py-3 px-4 font-semibold bg-green-50 min-w-[80px]">
                        Sáb
                      </th>
                      <th className="text-center py-3 px-4 font-semibold bg-green-50 min-w-[80px]">
                        Dom
                      </th>
                      <th className="text-center py-3 px-4 font-semibold bg-gray-50 min-w-[80px]">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {chainStores.map((store, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 sticky left-0 z-10 bg-white border-r">
                          <div className="font-medium text-gray-900">
                            {store.name.includes(',') ? store.name.split(',').slice(1).join(',').trim() : store.name}
                          </div>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                            store.daily_visits.Monday > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {store.daily_visits.Monday || '-'}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                            store.daily_visits.Tuesday > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {store.daily_visits.Tuesday || '-'}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                            store.daily_visits.Wednesday > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {store.daily_visits.Wednesday || '-'}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                            store.daily_visits.Thursday > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {store.daily_visits.Thursday || '-'}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                            store.daily_visits.Friday > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {store.daily_visits.Friday || '-'}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                            store.daily_visits.Saturday > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {store.daily_visits.Saturday || '-'}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                            store.daily_visits.Sunday > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {store.daily_visits.Sunday || '-'}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4 border-l">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                            store.weekly_visits === 0 ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-800'
                          }`}>
                            {store.weekly_visits}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {chainStores.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No se encontraron tiendas para esta cadena
                  </div>
                )}
              </div>
            )}
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline" className="w-full">Cerrar</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Sheet for Agent Details */}
      <Sheet open={!!selectedAgent} onOpenChange={(open) => !open && setSelectedAgent(null)}>
        <SheetContent 
          side="right" 
          className="overflow-hidden [&]:!w-[1000px] [&]:!max-w-[1000px] [&]:!min-w-[1000px]"
        >
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Store className="w-5 h-5 mr-2" />
                Calendario de Visitas - {selectedAgent}
              </div>
              {!isLoadingAgentStores && !agentStoresError && (
                <span className="text-sm font-normal text-gray-500">
                  {agentStores.length} tiendas
                </span>
              )}
            </SheetTitle>
            <SheetDescription>
              Programación semanal de visitas por tienda - Ordenadas por volumen de ventas
            </SheetDescription>
          </SheetHeader>
          <div className="py-6 max-h-[calc(100vh-180px)] overflow-y-auto">
            {isLoadingAgentStores ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : agentStoresError ? (
              <div className="text-red-600 text-center py-8">
                Error al cargar las tiendas: {agentStoresError.message}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold bg-gray-50 sticky left-0 z-10 min-w-[250px]">
                        Tienda
                      </th>
                      <th className="text-center py-3 px-4 font-semibold bg-blue-50 min-w-[80px]">
                        Lun
                      </th>
                      <th className="text-center py-3 px-4 font-semibold bg-blue-50 min-w-[80px]">
                        Mar
                      </th>
                      <th className="text-center py-3 px-4 font-semibold bg-blue-50 min-w-[80px]">
                        Mié
                      </th>
                      <th className="text-center py-3 px-4 font-semibold bg-blue-50 min-w-[80px]">
                        Jue
                      </th>
                      <th className="text-center py-3 px-4 font-semibold bg-blue-50 min-w-[80px]">
                        Vie
                      </th>
                      <th className="text-center py-3 px-4 font-semibold bg-green-50 min-w-[80px]">
                        Sáb
                      </th>
                      <th className="text-center py-3 px-4 font-semibold bg-green-50 min-w-[80px]">
                        Dom
                      </th>
                      <th className="text-center py-3 px-4 font-semibold bg-gray-50 min-w-[80px]">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {agentStores.map((store, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 sticky left-0 z-10 bg-white border-r">
                          <div className="font-medium text-gray-900">
                            {store.name.includes(',') ? store.name.split(',').slice(1).join(',').trim() : store.name}
                          </div>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                            store.daily_visits.Monday > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {store.daily_visits.Monday || '-'}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                            store.daily_visits.Tuesday > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {store.daily_visits.Tuesday || '-'}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                            store.daily_visits.Wednesday > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {store.daily_visits.Wednesday || '-'}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                            store.daily_visits.Thursday > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {store.daily_visits.Thursday || '-'}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                            store.daily_visits.Friday > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {store.daily_visits.Friday || '-'}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                            store.daily_visits.Saturday > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {store.daily_visits.Saturday || '-'}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                            store.daily_visits.Sunday > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {store.daily_visits.Sunday || '-'}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4 border-l">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                            store.weekly_visits === 0 ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-800'
                          }`}>
                            {store.weekly_visits}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {agentStores.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No se encontraron tiendas para este agente
                  </div>
                )}
              </div>
            )}
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline" className="w-full">Cerrar</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>


    </div>
  );
};

export default Coverage;
