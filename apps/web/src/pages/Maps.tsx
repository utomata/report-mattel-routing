import React, { useState, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline, InfoWindow } from '@react-google-maps/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, AlertCircle } from 'lucide-react';
import { useStores, useAgents, useRoutes } from '@/hooks/use-maps';
import { Skeleton } from '@/components/ui/skeleton';
import { StoreLocation, RouteVisit } from '@/lib/api';
import { DataTable } from '@/components/route-table/data-table';
import { columns, RouteVisitRow } from '@/components/route-table/columns';

const DAY_COLORS: { [key: string]: string } = {
  'mon': '#E53935', // Red
  'tue': '#D81B60', // Pink
  'wed': '#FBC02D', // Amber
  'thu': '#FB8C00', // Orange
  'fri': '#8E24AA', // Purple
  'sat': '#5E35B1', // Deep Purple
  'default': '#37474F' // Blue Grey
};

const DAY_NAMES: { [key: string]: string } = {
  'mon': 'Lunes',
  'tue': 'Martes',
  'wed': 'Miércoles',
  'thu': 'Jueves',
  'fri': 'Viernes',
  'sat': 'Sábado'
};

const dayOrder = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

type SelectedStore = StoreLocation & RouteVisit & { sequence: number };

const Maps = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const [selectedStoreInfo, setSelectedStoreInfo] = useState<SelectedStore | null>(null);
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');

  const { data: storesData, isLoading: isLoadingStores, isError: isErrorStores } = useStores();
  const { data: agentsData, isLoading: isLoadingAgents, isError: isErrorAgents } = useAgents();
  const { data: routesData, isLoading: isLoadingRoutes, isError: isErrorRoutes } = useRoutes('optimized');

  const isLoading = isLoadingStores || isLoadingAgents || isLoadingRoutes;
  const isError = isErrorStores || isErrorAgents || isErrorRoutes;

  const filteredRoutes = useMemo(() => {
    if (!routesData) return [];

    const routes = routesData.routes.filter(route => 
      (selectedAgent === 'all' || route.agent_id === selectedAgent) &&
      (selectedDay === 'all' || route.day.toLowerCase() === selectedDay)
    );

    // Sort visits within each route by arrival time
    routes.forEach(route => {
      route.visits.sort((a, b) => a.arrival_time.localeCompare(b.arrival_time));
    });
    
    // Sort the routes themselves by day of the week
    routes.sort((a, b) => dayOrder.indexOf(a.day.toLowerCase()) - dayOrder.indexOf(b.day.toLowerCase()));

    return routes;
  }, [routesData, selectedAgent, selectedDay]);
  
  const mapContainerStyle = { width: '100%', height: '600px' };
  const center = { lat: 25.6866, lng: -100.3161 }; // Centered in Monterrey
  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
  };

  const tableData = useMemo(() => {
    const data: RouteVisitRow[] = [];
    if (!filteredRoutes || !storesData) return data;

    filteredRoutes.forEach(route => {
      route.visits.forEach((visit, index) => {
        const store = storesData.stores.find(s => s.store_id === visit.store_id);
        data.push({
          day: route.day,
          sequence: index + 1,
          storeName: store?.name || 'Tienda Desconocida',
          arrivalTime: visit.arrival_time,
          serviceDuration: visit.service_duration,
        });
      });
    });
    return data;
  }, [filteredRoutes, storesData]);

  if (isLoading) {
    return <div className="space-y-6">
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-6 w-2/3" />
      <Card>
        <CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader>
        <CardContent><Skeleton className="h-[600px] w-full" /></CardContent>
      </Card>
    </div>;
  }

  if (isError || !isLoaded) {
    return <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mapas de Rutas y Cobertura</h1>
      </div>
      <div className="flex items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
        <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
        <span className="text-red-800">
          {isError ? 'Error al cargar los datos del mapa. Por favor, inténtelo de nuevo más tarde.' : 'Error al cargar el script de Google Maps. Por favor, verifique su clave de API y conexión de red.'}
        </span>
      </div>
    </div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mapas de Rutas y Cobertura</h1>
        <p className="text-gray-600 mt-2">Visualización geográfica de rutas, cobertura de tiendas y gestión de territorios</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Mapa de Rutas Optimizado con Utomata
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Mostrando {filteredRoutes.length} de {routesData?.routes.length || 0} rutas totales.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-4 items-center">
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filtrar por Agente" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Agentes</SelectItem>
                {agentsData?.agents.map(agent => (
                  <SelectItem key={agent.agent_id} value={agent.agent_id}>{agent.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filtrar por Día" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Días</SelectItem>
                {dayOrder.map(dayKey => (
                  <SelectItem key={dayKey} value={dayKey}>{DAY_NAMES[dayKey]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => { setSelectedAgent('all'); setSelectedDay('all'); }}>Limpiar Filtros</Button>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={11}
            options={mapOptions}
          >
            {filteredRoutes.map(route => 
              route.visits.map((visit, index) => {
                const store = storesData?.stores.find(s => s.store_id === visit.store_id);
                if (!store) return null;
                
                const sequence = index + 1;
                const color = DAY_COLORS[route.day.toLowerCase()] || DAY_COLORS.default;
                
                const markerIcon = {
                  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
                      <circle cx="12" cy="12" r="11" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>
                      <text x="12" y="16" font-size="12" font-family="sans-serif" font-weight="bold" text-anchor="middle" fill="white">${sequence}</text>
                    </svg>`
                  )}`,
                  scaledSize: new window.google.maps.Size(32, 32),
                };

                return <Marker
                  key={`${route.agent_id}-${store.store_id}-${sequence}`}
                  position={{ lat: store.latitude, lng: store.longitude }}
                  onClick={() => setSelectedStoreInfo({ ...store, ...visit, sequence })}
                  icon={markerIcon}
                  zIndex={selectedStoreInfo?.store_id === store.store_id ? 999 : sequence}
                />
              })
            )}

            {filteredRoutes.map((route, routeIndex) => {
              const path = route.visits.map(visit => {
                const store = storesData?.stores.find(s => s.store_id === visit.store_id);
                return store ? { lat: store.latitude, lng: store.longitude } : null;
              }).filter(p => p !== null) as google.maps.LatLngLiteral[];
              
              const color = DAY_COLORS[route.day.toLowerCase()] || DAY_COLORS.default;
              return <Polyline key={`${route.agent_id}-${route.day}-${routeIndex}`} path={path} options={{ strokeColor: color, strokeOpacity: 0.8, strokeWeight: 3 }} />;
            })}

            {selectedStoreInfo && (
              <InfoWindow
                position={{ lat: selectedStoreInfo.latitude, lng: selectedStoreInfo.longitude }}
                onCloseClick={() => setSelectedStoreInfo(null)}
              >
                <div className="p-2 max-w-sm">
                  <h3 className="font-semibold text-gray-900 mb-2">{selectedStoreInfo.name}</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Orden de Visita:</span> {selectedStoreInfo.sequence}</p>
                    <p><span className="font-medium">Cadena:</span> {selectedStoreInfo.chain}</p>
                    <p><span className="font-medium">Ventas:</span> ${selectedStoreInfo.sales.toLocaleString()}</p>
                    <p><span className="font-medium">Llegada:</span> {selectedStoreInfo.arrival_time}</p>
                    <p><span className="font-medium">Servicio:</span> {selectedStoreInfo.service_duration} min</p>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
          <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {Object.entries(DAY_COLORS).filter(([key]) => key !== 'default').map(([dayKey, color]) => (
                <div key={dayKey} className="flex items-center">
                    <div className="w-4 h-1 mr-2" style={{backgroundColor: color}}></div>
                    <span>{DAY_NAMES[dayKey]}</span>
                </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalles de Ruta</CardTitle>
          <p className="text-sm text-gray-500">
            Información detallada de visitas para el agente y día seleccionados.
          </p>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={tableData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Maps;