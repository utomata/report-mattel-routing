variable "cloudflare_api_token" {
  description = "Cloudflare API Token with Zero Trust permissions"
  type        = string
  sensitive   = true
}

variable "cloudflare_account_id" {
  description = "Cloudflare Account ID"
  type        = string
}

variable "domain_name" {
  description = "The domain name managed by Cloudflare"
  type        = string
  default     = "utomata.ai"
}

variable "app_domain" {
  description = "The full domain for the application"
  type        = string
  default     = "mattel-routing-app.utomata.ai"
}



variable "reusable_policy_group_id" {
  description = "ID of the reusable access group to use for the application"
  type        = list(string)
}





variable "enable_service_token" {
  description = "Whether to create a service token for API access"
  type        = bool
  default     = true
}

variable "session_duration" {
  description = "Session duration for Zero Trust access"
  type        = string
  default     = "24h"
}
