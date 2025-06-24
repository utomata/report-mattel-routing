# Cloudflare Zero Trust Infrastructure

Este directorio contiene la configuración de Terraform para configurar Cloudflare Zero Trust para la aplicación Mattel Routing Dashboard.

## Prerequisitos

1. **Terraform instalado** (versión >= 1.0)
2. **Cuenta de Cloudflare** con el dominio `utomata.ai` configurado
3. **API Token de Cloudflare** con los siguientes permisos:
   - Account: `Cloudflare Tunnel:Edit`
   - Account: `Access: Apps and Policies:Edit`
   - Zone: `Zone:Read`
   - Zone: `DNS:Edit`

## Configuración

### 1. Obtener credenciales de Cloudflare

#### Account ID:
1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. En la barra lateral derecha, copia tu **Account ID**

#### API Token:
1. Ve a [API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Clic en **Create Token**
3. Usa el template **Custom token**
4. Configura los permisos:
   - **Account** - `Cloudflare Tunnel:Edit`
   - **Account** - `Access: Apps and Policies:Edit`
   - **Zone** - `Zone:Read` - Include `utomata.ai`
   - **Zone** - `DNS:Edit` - Include `utomata.ai`

### 2. Configurar variables

```bash
# Copia el archivo de ejemplo
cp terraform.tfvars.example terraform.tfvars

# Edita con tus valores reales
nano terraform.tfvars
```

### 3. Inicializar y aplicar

```bash
# Inicializar Terraform
terraform init

# Verificar el plan
terraform plan

# Aplicar la configuración
terraform apply
```

## Lo que se crea

Esta configuración creará:

1. **Zero Trust Access Application** para `mattel-routing-app.utomata.ai`
2. **Políticas de acceso**:
   - Permitir usuarios autorizados (emails específicos)
   - Denegar todos los demás
   - Acceso para service token (API)
3. **Service Token** para acceso programático
4. **Configuración CORS** para la aplicación

## Uso después del despliegue

### Acceso de usuarios
Los usuarios autorizados podrán acceder a `https://mattel-routing-app.utomata.ai` y serán redirigidos a la página de login de Cloudflare Access.

### Acceso de API
Usa el service token para acceso programático:

```bash
# Obtener el token
terraform output -raw service_token_client_id
terraform output -raw service_token_client_secret

# Usar en requests
curl -H "CF-Access-Client-Id: <client_id>" \
     -H "CF-Access-Client-Secret: <client_secret>" \
     https://mattel-routing-app.utomata.ai/api/endpoint
```

## Gestión

### Ver outputs
```bash
terraform output
```

### Actualizar configuración
```bash
# Editar terraform.tfvars
nano terraform.tfvars

# Aplicar cambios
terraform apply
```

### Destruir recursos
```bash
terraform destroy
```

## Estructura de archivos

- `main.tf` - Configuración principal de recursos
- `variables.tf` - Definición de variables
- `outputs.tf` - Outputs de la configuración
- `terraform.tfvars.example` - Ejemplo de variables
- `terraform.tfvars` - Variables reales (no incluir en git)

## Seguridad

⚠️ **IMPORTANTE**: Nunca commits el archivo `terraform.tfvars` al repositorio ya que contiene credenciales sensibles.

Agrega a `.gitignore`:
```
iac/terraform.tfvars
iac/.terraform/
iac/*.tfstate
iac/*.tfstate.backup
``` 