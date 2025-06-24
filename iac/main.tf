terraform {
  required_version = ">= 1.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# Data source to get zone information
data "cloudflare_zone" "domain" {
  name = var.domain_name
}

# Note: Using existing Google Identity Provider ID
# You can find this ID in Cloudflare Zero Trust dashboard under Settings > Authentication

# Zero Trust Access Application
resource "cloudflare_zero_trust_access_application" "mattel_routing_app" {
  account_id                = var.cloudflare_account_id
  name                      = "Mattel Routing Dashboard"
  domain                    = var.app_domain
  type                      = "self_hosted"
  session_duration          = "24h"
  auto_redirect_to_identity = false

  # Enable App Launcher visibility
  app_launcher_visible = true

  # CORS settings for API access
  cors_headers {
    allowed_methods   = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allowed_origins   = [var.app_domain]
    allow_credentials = true
    max_age           = 86400
  }

  # tags = ["mattel", "routing", "dashboard"] # Disabled - tags must be created first
}

# Use existing reusable policy
resource "cloudflare_zero_trust_access_policy" "reusable_policy" {
  account_id     = var.cloudflare_account_id
  application_id = cloudflare_zero_trust_access_application.mattel_routing_app.id
  name           = "Reusable Policy"
  precedence     = 1
  decision       = "allow"

  include {
    group = var.reusable_policy_group_id
  }
}

# Optional: Create a service token for API access
resource "cloudflare_zero_trust_access_service_token" "api_token" {
  count = var.enable_service_token ? 1 : 0

  account_id = var.cloudflare_account_id
  name       = "Mattel Routing API Token"

  # Token expires in 1 year
  duration = "8760h"
}

# Optional: Policy for service token access
resource "cloudflare_zero_trust_access_policy" "service_token_policy" {
  count = var.enable_service_token ? 1 : 0

  account_id     = var.cloudflare_account_id
  application_id = cloudflare_zero_trust_access_application.mattel_routing_app.id
  name           = "Service Token Access"
  precedence     = 0
  decision       = "non_identity"

  include {
    service_token = [cloudflare_zero_trust_access_service_token.api_token[0].id]
  }
}
