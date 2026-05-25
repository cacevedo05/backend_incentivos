variable "project_name" {
  description = "Nombre corto del proyecto usado en los recursos de Azure"
  type        = string
  default     = "incentivos"
}

variable "environment" {
  description = "Ambiente del despliegue"
  type        = string
  default     = "dev"
}

variable "location" {
  description = "Región de Azure"
  type        = string
  default     = "eastus2"
}

variable "vm_size" {
  description = "Tamaño de la VM (Standard_B1s entra en free tier)"
  type        = string
  default     = "Standard_D2s_v3"
}

variable "admin_username" {
  description = "Usuario administrador de la VM"
  type        = string
  default     = "azureuser"
}

variable "ssh_public_key_path" {
  description = "Ruta local de la llave pública SSH que se instalará en la VM"
  type        = string
  default     = "~/.ssh/id_rsa.pub"
}

variable "ssh_source_address_prefix" {
  description = "IP o CIDR autorizado para SSH. Usa tu IP pública con /32 en producción"
  type        = string
  default     = "181.142.26.101/32"
}

variable "backend_image" {
  description = "Imagen Docker del backend publicada en Docker Hub o ACR"
  type        = string
  default     = "camilaacevedo/backend-incentivos:latest"
}

variable "frontend_image" {
  description = "Imagen Docker del frontend publicada en Docker Hub o ACR"
  type        = string
  default     = "camilaacevedo/front-incentivos:latest"
}

# db_password y jwt_secret se inyectan por SSH en el pipeline (Jenkinsfile)
# ya no se pasan por Terraform para evitar recrear la VM en cada build
