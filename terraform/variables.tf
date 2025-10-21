variable "compartment_ocid" {
  type = string
  description = "Compartment OCID to create the resources at"
}

variable "tenancy_ocid" {
  type = string
  description = "Tenancy OCID"
}

variable "subnet_ocid" {
  type = string
  description = "Subnet OCID to create the resources at, preferably private"
}

variable "ocir_region" {
  type = string
  default = "fra.ocir.io"
  description = "OCIR region"
}

variable "sidecar_image" {
  type = string
  description = "CI sidecar image e.g. ci-sidecar:1.0.0"
}

#### LIST ALL APP IMAGES HERE ####

variable "app_image_1" {
  type = string
  description = "App 1 image e.g. car-api:1.0.0-free"
}

variable "app_image_2" {
  type = string
  description = "App 2 image e.g. car-api:2.0.0"
}

##################################

variable "ad_number" {
  type    = number
  default = 1
  description = "AD number (1,2,or 3)"
}

variable "log_ocid" {
  type    = string
  description = "OCI Logging log OCID"
}

variable "log_mount_path" {
  type    = string
  default = "/var/log"
  description = "Application logs path"
}

variable "log_mount_name" {
  type    = string
  default = "applog"
  description = "Application logs mount name"
}

variable "log_file" {
  type    = string
  default = "app.log"
  description = "Application log name"
}

variable "log_header" {
  type    = string
  description = "Application log row header e.g. Cars-API"
}

variable "www_mount_path" {
  type    = string
  default = "/usr/share/nginx/html"
  description = "NGINX www-data path"
}

variable "www_mount_name" {
  type    = string
  default = "nginxdata"
  description = "NGINX data mount name"
}

variable "www_data_bucket" {
  type    = string
  description = "Object Storage bucket name"
}

variable "create_www_data_bucket" {
  type    = bool
  default = false
  description = "Create www-data bucket with directories"
}

variable "apigw_hostname" {
  type    = string
  description = "API Gateway hostname for Swagger server urls"
}

variable "www_reload_delay" {
  type    = number
  default = 30000
  description = "Object Storage data reload interval in ms, use zero for never"
}

