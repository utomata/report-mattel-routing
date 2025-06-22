# 🚛 Mattel Routing Optimization Report

Una aplicación fullstack para visualizar y analizar la optimización de rutas de distribución de Mattel, construida con React, FastAPI y desplegada en Google Cloud Run.

## 📋 Descripción del Proyecto

Esta aplicación presenta un dashboard interactivo que muestra:
- **Comparación antes/después** de la optimización de rutas
- **Análisis de cobertura** de tiendas y trabajadores
- **Mapas interactivos** con visualización de rutas
- **Métricas de rendimiento** y KPIs de optimización

## 🏗️ Arquitectura

### Monorepo con Turborepo
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI + Python + CSV data processing
- **UI Components**: shadcn/ui component library
- **Package Manager**: pnpm workspaces

### Deployment Options
1. **Cloud Run Sidecars** (Recomendado) - Un servicio con múltiples contenedores
2. **Servicios Separados** - Frontend y backend independientes

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 20+
- Python 3.11+
- pnpm 9+
- Docker (para deployment)

### Instalación
```bash
# Clonar repositorio
git clone https://github.com/utomata/report-mattel-routing.git
cd report-mattel-routing

# Instalar dependencias
pnpm install

# Desarrollo local
pnpm dev
```

### URLs de Desarrollo
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📁 Estructura del Proyecto

```
report-mattel-routing/
├── apps/
│   ├── web/                    # React frontend
│   │   ├── src/
│   │   │   ├── components/     # UI components
│   │   │   ├── pages/          # Page components
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   └── lib/            # Utilities and API client
│   │   └── Dockerfile          # Frontend container
│   └── backend/                # FastAPI backend
│       ├── data/               # CSV data files
│       ├── main.py             # FastAPI application
│       └── Dockerfile          # Backend container
├── docker/                     # Sidecar Dockerfiles
│   ├── nginx-sidecar/          # Nginx proxy + React
│   └── fastapi-sidecar/        # FastAPI optimized
├── scripts/                    # Deployment scripts
└── packages/                   # Shared packages
```

## 🛠️ Scripts Disponibles

### Desarrollo
```bash
pnpm dev                        # Ejecutar frontend y backend
pnpm dev --filter=web          # Solo frontend
pnpm dev --filter=backend      # Solo backend
pnpm build                     # Build de producción
pnpm lint                      # Linting
pnpm check-types               # Type checking
```

### Docker Local
```bash
pnpm docker:build              # Build containers
pnpm docker:up                 # Ejecutar con docker-compose
pnpm docker:down               # Detener containers
```

### Deployment
```bash
# Cloud Run Sidecars (Recomendado)
pnpm deploy:sidecar:production
pnpm deploy:sidecar:staging

# Servicios Separados
pnpm deploy:production
pnpm deploy:staging
```

## 🚀 Deployment

### Opción 1: Cloud Run Sidecars (Recomendado)
Un solo servicio con Nginx como proxy y FastAPI como backend:

```bash
./scripts/deploy-sidecar.sh production us-central1
```

### Opción 2: Servicios Separados
Frontend y backend como servicios independientes:

```bash
./scripts/deploy.sh production us-central1
```

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones detalladas.

## 🎨 Stack Tecnológico

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Maps**: Leaflet
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.11
- **Data**: CSV processing with Pandas
- **CORS**: Configurado para desarrollo y producción

### DevOps
- **Monorepo**: Turborepo
- **Package Manager**: pnpm
- **Containerization**: Docker multi-stage builds
- **Cloud Platform**: Google Cloud Run
- **CI/CD**: GitHub Actions (configuración pendiente)

## 📊 Características

### Dashboard Principal
- Métricas de optimización de rutas
- Comparación de KPIs antes/después
- Gráficos interactivos de rendimiento

### Análisis Antes/Después
- Tabla comparativa de rutas
- Métricas de distancia y tiempo
- Visualización de mejoras

### Cobertura
- Análisis de cobertura de tiendas
- Distribución de trabajadores
- Mapas de calor de cobertura

### Mapas Interactivos
- Visualización de rutas optimizadas
- Marcadores de tiendas y trabajadores
- Controles de capas interactivos

## 🤝 Contribución

### Conventional Commits

Este proyecto utiliza [Conventional Commits](https://www.conventionalcommits.org/) para mantener un historial de commits limpio y semántico.

#### Formato
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Tipos Principales
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bugs
- `docs`: Cambios en documentación
- `style`: Cambios de formato (no afectan funcionalidad)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Tareas de mantenimiento

#### Ejemplos
```bash
feat(dashboard): add route optimization metrics
fix(api): resolve CORS issue for production
docs(readme): update deployment instructions
style(components): format table component
refactor(hooks): optimize data fetching logic
chore(deps): update dependencies to latest versions
```

#### Scopes Sugeridos
- `dashboard`: Página principal
- `maps`: Componentes de mapas
- `api`: Backend/API changes
- `components`: Componentes UI
- `hooks`: Custom hooks
- `deployment`: Configuración de deployment
- `docker`: Configuración de contenedores

### Flujo de Trabajo
1. Fork del repositorio
2. Crear branch con nombre descriptivo: `feat/route-optimization`
3. Commits siguiendo conventional commits
4. Pull request con descripción detallada

## 📝 Licencia

Este proyecto es privado y pertenece a Utomata para el cliente Mattel.

## 🔗 Enlaces Útiles

- **Repositorio**: https://github.com/utomata/report-mattel-routing
- **Documentación de Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Turborepo Docs**: https://turborepo.com/docs
- **Cloud Run Sidecars**: https://cloud.google.com/blog/products/serverless/cloud-run-now-supports-sidecar-deployments
- **Conventional Commits**: https://www.conventionalcommits.org/

---

Desarrollado con ❤️ por el equipo de [Utomata](https://utomata.io) para Mattel
