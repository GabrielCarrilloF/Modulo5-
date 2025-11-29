variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "bucket_name" {
  type = string
  description = "Nombre único para el bucket S3 del frontend"
}

variable "api_url" {
  type = string
  description = "Endpoint de la API del módulo 1"
}
