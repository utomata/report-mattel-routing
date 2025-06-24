output "application_id" {
  description = "The ID of the Zero Trust Access application"
  value       = cloudflare_zero_trust_access_application.mattel_routing_app.id
}

output "application_domain" {
  description = "The domain of the Zero Trust Access application"
  value       = cloudflare_zero_trust_access_application.mattel_routing_app.domain
}

output "application_aud" {
  description = "The AUD (audience) tag for the application"
  value       = cloudflare_zero_trust_access_application.mattel_routing_app.aud
}

output "service_token_id" {
  description = "The ID of the service token for API access"
  value       = var.enable_service_token ? cloudflare_zero_trust_access_service_token.api_token[0].id : null
}

output "service_token_client_id" {
  description = "The client ID of the service token"
  value       = var.enable_service_token ? cloudflare_zero_trust_access_service_token.api_token[0].client_id : null
  sensitive   = true
}

output "service_token_client_secret" {
  description = "The client secret of the service token"
  value       = var.enable_service_token ? cloudflare_zero_trust_access_service_token.api_token[0].client_secret : null
  sensitive   = true
}

output "zone_id" {
  description = "The Cloudflare Zone ID"
  value       = data.cloudflare_zone.domain.id
}

output "access_policies" {
  description = "List of created access policies"
  value = {
    reusable_policy = {
      id   = cloudflare_zero_trust_access_policy.reusable_policy.id
      name = cloudflare_zero_trust_access_policy.reusable_policy.name
    }
    service_token_policy = var.enable_service_token ? {
      id   = cloudflare_zero_trust_access_policy.service_token_policy[0].id
      name = cloudflare_zero_trust_access_policy.service_token_policy[0].name
    } : null
  }
}
