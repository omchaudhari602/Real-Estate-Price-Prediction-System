variable "kubeconfig_path" {
  type        = string
  description = "Path to kubeconfig for kubernetes provider"
  default     = "~/.kube/config"
}

variable "namespace" {
  type    = string
  default = "houseprice-app"
}
