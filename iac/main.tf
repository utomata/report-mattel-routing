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

# Zero Trust Access Application
resource "cloudflare_zero_trust_access_application" "mattel_routing_app" {
  account_id                = var.cloudflare_account_id
  name                     = "Mattel Routing Dashboard"
  domain                   = var.app_domain
  type                     = "self_hosted"
  session_duration         = "24h"
  auto_redirect_to_identity = true
  
  # Enable App Launcher visibility
  app_launcher_visible = true
  
  # CORS settings for API access
  cors_headers {
    allowed_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allowed_origins = [var.app_domain]
    allow_credentials = true
    max_age = 86400
  }

  tags = ["mattel", "routing", "dashboard"]
}

# Zero Trust Access Policy - Allow specific emails
resource "cloudflare_zero_trust_access_policy" "allow_authorized_users" {
  account_id     = var.cloudflare_account_id
  application_id = cloudflare_zero_trust_access_application.mattel_routing_app.id
  name          = "Allow Authorized Users"
  precedence    = 1
  decision      = "allow"

  include {
    email = var.authorized_emails
  }

  # Require valid session
  require {
    auth_method = "swg"
  }
}

# Zero Trust Access Policy - Block all others
resource "cloudflare_zero_trust_access_policy" "deny_all_others" {
  account_id     = var.cloudflare_account_id
  application_id = cloudflare_zero_trust_access_application.mattel_routing_app.id
  name          = "Deny All Others"
  precedence    = 2
  decision      = "deny"

  include {
    everyone = true
  }
}

# Optional: Create a service token for API access
resource "cloudflare_zero_trust_access_service_token" "api_token" {
  account_id = var.cloudflare_account_id
  name       = "Mattel Routing API Token"
  
  # Token expires in 1 year
  duration = "8760h"
}

# Optional: Policy for service token access
resource "cloudflare_zero_trust_access_policy" "service_token_policy" {
  account_id     = var.cloudflare_account_id
  application_id = cloudflare_zero_trust_access_application.mattel_routing_app.id
  name          = "Service Token Access"
  precedence    = 0
  decision      = "non_identity"

  include {
    service_token = [cloudflare_zero_trust_access_service_token.api_token.id]
  }
} 