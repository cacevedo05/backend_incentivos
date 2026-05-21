output "public_ip" {
  description = "IP pública de la VM"
  value       = azurerm_public_ip.main.ip_address
}

output "ssh_command" {
  description = "Comando para conectarse por SSH"
  value       = "ssh ${var.admin_username}@${azurerm_public_ip.main.ip_address}"
}

output "gateway_url" {
  description = "URL del API Gateway"
  value       = "http://${azurerm_public_ip.main.ip_address}:3000"
}

output "frontend_url" {
  description = "URL del Frontend"
  value       = "http://${azurerm_public_ip.main.ip_address}:3001"
}

output "resource_group_name" {
  description = "Grupo de recursos creado"
  value       = azurerm_resource_group.main.name
}
