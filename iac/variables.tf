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

variable "authorized_emails" {
  description = "List of authorized email addresses for Zero Trust access"
  type        = list(string)
  default     = [
    "admin@utomata.ai",
    "team@utomata.ai"
  ]
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