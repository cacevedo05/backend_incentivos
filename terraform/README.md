# Terraform Azure - Incentivos

Esta configuración crea una VM Linux en Azure, instala Docker y despliega el proyecto con Docker Compose:

- PostgreSQL
- Redis
- 7 microservicios backend
- API Gateway
- Frontend Next.js

## Requisitos

- Terraform instalado
- Azure CLI instalado
- Sesión iniciada con `az login`
- Llave SSH pública disponible, por defecto `~/.ssh/id_rsa.pub`
- Imágenes Docker publicadas:
  - `camilaacevedo/backend-incentivos:latest`
  - `camilaacevedo/front-incentivos:latest`

## Uso

1. Entra a esta carpeta:

```bash
cd backend_incentivos/terraform
```

2. Crea tu archivo de variables:

```bash
cp terraform.tfvars.example terraform.tfvars
```

3. Edita `terraform.tfvars` y cambia al menos:

- `ssh_source_address_prefix`
- `db_password`
- `jwt_secret`

4. Inicializa Terraform:

```bash
terraform init
```

5. Revisa el plan:

```bash
terraform plan
```

6. Despliega en Azure:

```bash
terraform apply
```

Terraform mostrará la IP pública, la URL del frontend y la URL del gateway.

## Acceso

- Frontend: `http://IP_PUBLICA:3001`
- API Gateway: `http://IP_PUBLICA:3000`
- SSH: `ssh azureuser@IP_PUBLICA`

## Eliminar recursos

Para borrar toda la infraestructura creada:

```bash
terraform destroy
```

## Notas

- `terraform.tfvars` no debe subirse a Git porque contiene secretos.
- Para producción, no uses `ssh_source_address_prefix = "*"`; usa tu IP pública con `/32`.
- `Standard_B1s` puede quedarse corto para 11 contenedores. `Standard_B2s` es más recomendable.
