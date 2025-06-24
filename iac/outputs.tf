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
  value       = cloudflare_zero_trust_access_service_token.api_token.id
}

output "service_token_client_id" {
  description = "The client ID of the service token"
  value       = cloudflare_zero_trust_access_service_token.api_token.client_id
  sensitive   = true
}

output "service_token_client_secret" {
  description = "The client secret of the service token"
  value       = cloudflare_zero_trust_access_service_token.api_token.client_secret
  sensitive   = true
}

output "zone_id" {
  description = "The Cloudflare Zone ID"
  value       = data.cloudflare_zone.domain.id
}

output "access_policies" {
  description = "List of created access policies"
  value = {
    allow_policy = {
      id   = cloudflare_zero_trust_access_policy.allow_authorized_users.id
      name = cloudflare_zero_trust_access_policy.allow_authorized_users.name
    }
    deny_policy = {
      id   = cloudflare_zero_trust_access_policy.deny_all_others.id
      name = cloudflare_zero_trust_access_policy.deny_all_others.name
    }
    service_token_policy = {
      id   = cloudflare_zero_trust_access_policy.service_token_policy.id
      name = cloudflare_zero_trust_access_policy.service_token_policy.name
    }
  }
} 
