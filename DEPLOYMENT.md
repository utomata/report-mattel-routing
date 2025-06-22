# 🚀 Deployment Guide - Mattel Routing Optimization

Esta guía te ayudará a desplegar la aplicación de optimización de rutas de Mattel en Google Cloud Run usando una arquitectura multi-contenedor.

## 📋 Prerrequisitos

### 1. Herramientas Requeridas
- [Google Cloud CLI](https://cloud.google.com/sdk/docs/install) instalado y configurado
- [Docker](https://docs.docker.com/get-docker/) instalado
- [Node.js 20+](https://nodejs.org/) y [pnpm](https://pnpm.io/) instalados
- Cuenta de Google Cloud con facturación habilitada

### 2. Configuración Inicial de GCP
```bash
# Autenticarse con Google Cloud
gcloud auth login

# Configurar el proyecto
gcloud config set project YOUR_PROJECT_ID

# Verificar configuración
gcloud config list
```

## 🏗️ Arquitectura de Deployment

### 🆕 **Opción 1: Cloud Run Sidecars (Recomendado)**

La aplicación se despliega usando **Cloud Run Sidecars** - patrón multi-contenedor en un solo servicio:

- **Servicio único**: `mattel-routing-app`
- **Contenedores**:
  - **Nginx Sidecar**: Proxy reverso + servidor de archivos estáticos (Puerto 8080)
  - **FastAPI Container**: API backend (Puerto 8000 interno)
- **Comunicación**: localhost entre contenedores
- **Ventajas**: Menor latencia, mejor rendimiento, configuración simplificada

#### 🔄 Flujo de Requests
```
Internet → Cloud Run → Nginx (8080) → FastAPI (8000)
                    ↓
                Static Files (React)
```

### 📦 **Opción 2: Servicios Separados (Alternativa)**

1. **Backend Service** (`mattel-routing-backend`)
   - FastAPI con datos de optimización de rutas
   - Puerto: 8080
   - Imagen: Python 3.11 slim

2. **Frontend Service** (`mattel-routing-frontend`)
   - React SPA servida por Nginx
   - Puerto: 8080
   - Imagen: Node.js 20 Alpine + Nginx

## 🚀 Métodos de Deployment

### 🆕 **Opción A: Sidecar Deployment (Recomendado)**

```bash
# Deployment con patrón sidecar
./scripts/deploy-sidecar.sh production us-central1

# Deployment a staging
./scripts/deploy-sidecar.sh staging us-central1

# Con proyecto específico
./scripts/deploy-sidecar.sh production us-central1 your-project-id
```

### 📦 **Opción B: Servicios Separados**

```bash
# Deployment a producción
pnpm deploy:production

# Deployment a staging
pnpm deploy:staging

# Deployment personalizado
./scripts/deploy.sh [environment] [region]
```

### Opción 2: Deployment Manual

#### Paso 1: Preparar el entorno
```bash
# Habilitar APIs necesarias
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com

# Crear repositorio de Artifact Registry
gcloud artifacts repositories create mattel-routing \
    --repository-format=docker \
    --location=us-central1 \
    --description="Mattel routing optimization containers"

# Configurar Docker
gcloud auth configure-docker us-central1-docker.pkg.dev
```

#### Paso 2: Build y Push de Imágenes
```bash
# Backend
docker build -f apps/backend/Dockerfile -t us-central1-docker.pkg.dev/YOUR_PROJECT/mattel-routing/backend:latest .
docker push us-central1-docker.pkg.dev/YOUR_PROJECT/mattel-routing/backend:latest

# Frontend
docker build -f apps/web/Dockerfile -t us-central1-docker.pkg.dev/YOUR_PROJECT/mattel-routing/frontend:latest .
docker push us-central1-docker.pkg.dev/YOUR_PROJECT/mattel-routing/frontend:latest
```

#### Paso 3: Deploy a Cloud Run
```bash
# Deploy Backend
gcloud run deploy mattel-routing-backend \
    --image=us-central1-docker.pkg.dev/YOUR_PROJECT/mattel-routing/backend:latest \
    --platform=managed \
    --region=us-central1 \
    --allow-unauthenticated \
    --memory=1Gi \
    --cpu=1 \
    --port=8080

# Deploy Frontend (después de obtener la URL del backend)
gcloud run deploy mattel-routing-frontend \
    --image=us-central1-docker.pkg.dev/YOUR_PROJECT/mattel-routing/frontend:latest \
    --platform=managed \
    --region=us-central1 \
    --allow-unauthenticated \
    --memory=512Mi \
    --cpu=1 \
    --port=8080 \
    --set-env-vars="VITE_API_URL=https://YOUR_BACKEND_URL/api"
```

## 🧪 Testing Local con Docker

```bash
# Build y ejecutar localmente
pnpm docker:build
pnpm docker:up

# Acceder a la aplicación
# Frontend: http://localhost:3000
# Backend: http://localhost:8000

# Detener servicios
pnpm docker:down
```

## 📊 Monitoreo y Logs

### Ver Logs en Tiempo Real
```bash
# Logs del backend
gcloud run logs tail mattel-routing-backend --region=us-central1

# Logs del frontend
gcloud run logs tail mattel-routing-frontend --region=us-central1
```

### Métricas y Monitoring
- **Cloud Run Console**: [console.cloud.google.com/run](https://console.cloud.google.com/run)
- **Cloud Logging**: [console.cloud.google.com/logs](https://console.cloud.google.com/logs)
- **Cloud Monitoring**: [console.cloud.google.com/monitoring](https://console.cloud.google.com/monitoring)

## 🔧 Configuración de Variables de Entorno

### Backend (FastAPI)
| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `NODE_ENV` | Entorno de ejecución | `production` |
| `PORT` | Puerto del servidor | `8080` |

### Frontend (React)
| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL del backend API | `https://backend-url.run.app/api` |
| `NODE_ENV` | Entorno de ejecución | `production` |

## 🌐 Configuración de Dominio Personalizado

```bash
# Mapear dominio personalizado
gcloud run domain-mappings create \
    --service=mattel-routing-frontend \
    --domain=app.yourdomain.com \
    --region=us-central1

# Verificar mapeo
gcloud run domain-mappings list --region=us-central1
```

## 🔒 Seguridad y Mejores Prácticas

### Configuraciones de Seguridad Aplicadas
- ✅ Contenedores ejecutan como usuario no-root
- ✅ Health checks configurados
- ✅ Secrets manejados via variables de entorno
- ✅ HTTPS automático via Cloud Run
- ✅ Headers de seguridad en Nginx

### Recomendaciones Adicionales
1. **IAM**: Configurar roles mínimos necesarios
2. **VPC**: Usar VPC Connector para recursos privados
3. **CDN**: Configurar Cloud CDN para assets estáticos
4. **Backup**: Implementar backup de datos si es necesario

## 🚨 Troubleshooting

### Problemas Comunes

#### Error: "Service account does not have permission"
```bash
# Verificar permisos
gcloud projects get-iam-policy YOUR_PROJECT_ID

# Agregar rol necesario
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="user:your-email@domain.com" \
    --role="roles/run.admin"
```

#### Error: "Container failed to start"
```bash
# Verificar logs detallados
gcloud run logs read mattel-routing-backend --region=us-central1 --limit=50

# Verificar configuración del servicio
gcloud run services describe mattel-routing-backend --region=us-central1
```

#### Error: "Frontend no puede conectar con Backend"
1. Verificar que `VITE_API_URL` esté configurado correctamente
2. Verificar que el backend esté respondiendo en `/health`
3. Verificar configuración de CORS en el backend

### Comandos Útiles de Debugging
```bash
# Ejecutar contenedor localmente para debug
docker run -it --rm -p 8080:8080 YOUR_IMAGE_NAME

# Ver configuración de Cloud Run
gcloud run services describe SERVICE_NAME --region=REGION --format=yaml

# Actualizar servicio sin rebuild
gcloud run services update SERVICE_NAME --region=REGION --set-env-vars="KEY=VALUE"
```

## 💰 Estimación de Costos

### Cloud Run Pricing (us-central1)
- **CPU**: $0.00002400 por vCPU-segundo
- **Memory**: $0.00000250 por GiB-segundo
- **Requests**: $0.40 por millón de requests

### Estimación Mensual (tráfico moderado)
- **Backend**: ~$5-15/mes
- **Frontend**: ~$3-10/mes
- **Artifact Registry**: ~$1-5/mes
- **Total**: ~$10-30/mes

## 📞 Soporte

Para soporte técnico o preguntas sobre el deployment:
1. Revisar logs de Cloud Run
2. Consultar documentación de [Cloud Run](https://cloud.google.com/run/docs)
3. Crear issue en el repositorio del proyecto

---

**Última actualización**: $(date +%Y-%m-%d)
**Versión**: 1.0.0 