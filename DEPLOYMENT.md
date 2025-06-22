# 🚀 Guía de Deployment - Mattel Route Optimization

Guía completa para desplegar la aplicación de optimización de rutas de Mattel en Google Cloud Run.

## 📋 Prerrequisitos

### Herramientas Requeridas
- Google Cloud CLI (`gcloud`)
- Docker Desktop
- Node.js 20+
- pnpm 9+

### Configuración de Google Cloud
```bash
# Autenticación
gcloud auth login
gcloud auth application-default login

# Configurar proyecto
gcloud config set project YOUR_PROJECT_ID

# Verificar configuración
gcloud config list
```

## 🏗️ Arquitectura de Deployment

### 🆕 **Opción 1: Cloud Run Multi-Container (Recomendado)**

La aplicación se despliega usando **Cloud Run Multi-Container** - patrón multi-contenedor en un solo servicio:

- **Servicio único**: `mattel-routing-app`
- **Contenedores**:
  - **Web App**: React frontend como contenedor principal (Puerto 8080)
  - **FastAPI Container**: API backend como servicio interno (Puerto 8000)
- **Comunicación**: localhost entre contenedores
- **Ventajas**: Menor latencia, mejor rendimiento, configuración simplificada

#### 🔄 Flujo de Requests
```
Internet → Cloud Run → Web App (8080) → FastAPI (8000)
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

### 🆕 **Opción A: Multi-Container Deployment (Recomendado)**

```bash
# Deployment simple
pnpm deploy

# Deployment con parámetros específicos
./scripts/deploy.sh us-central1 your-project-id

# Deployment manual
./scripts/deploy.sh [region] [project-id]
```

### 📦 **Opción B: Servicios Separados**

```bash
# Deployment manual
./scripts/deploy.sh us-central1
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