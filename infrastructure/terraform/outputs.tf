output "namespace_name" {
  value = kubernetes_namespace.app.metadata[0].name
}
