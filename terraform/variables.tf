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
  default = "ci-sidecar:1.0.0"
  description = "CI sidecar image e.g. ci-sidecar:1.0.0"
}

variable "sidecar_vault_image" {
  type = string
  default = "ci-sidecar-vault:1.0.0"
  description = "CI sidecar for OCI Vault image e.g. ci-sidecar-vault:1.0.0"
}

variable "sidecar_metrics_image" {
  type = string
  default = "ci-sidecar-metrics:1.0.0"
  description = "CI sidecar image e.g. ci-sidecar-metrics:1.0.0"
}

variable "prometheus_node_exporter_image" {
  type = string
  default = "quay.io/prometheus/node-exporter:latest"
  description = "Prometheus Node Exporter image e.g. quay.io/prometheus/node-exporter:latest"
}

variable "prometheus_image" {
  type = string
  default = "prom/prometheus:main"
  description = "Prometheus image e.g. prom/prometheus:main"
}

variable "grafana_image" {
  type = string
  default = "grafana/grafana:latest"
  description = "Grafana image e.g. grafana/grafana:latest"
}

#### LIST ALL APP IMAGES HERE ####

variable "app_image_1" {
  type = string
  default = "cars-api:1.0.0-free"
  description = "App 1 image e.g. cars-api:1.0.0-free"
}

variable "app_image_2" {
  type = string
  default = "cars-api:2.0.0"
  description = "App 2 image e.g. cars-api:2.0.0"
}

variable "app_image_3" {
default = "cars-api:3.0.0"
  description = "App 3 image e.g. cars-api:3.0.0"
}

variable "app_image_4" {
  type = string
  default = "ci-signup-web:1.0.0"
  description = "App 4 image e.g. ci-signup-web"
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
  description = "Object Storage bucket name for NGINX WWW data"
}

variable "create_www_data_bucket" {
  type    = bool
  default = false
  description = "Create www-data bucket with directories"
}

variable "www_reload_delay" {
  type    = number
  default = 30000
  description = "Object Storage data reload interval in ms, use zero for never"
}

variable "redis_host" {
  type    = string
  default = ""
  description = "OCI Cache OCID when using Redis for logins"
}

variable "vault_secret_ocid" {
  type    = string
  default = ""
  description = "OCI Vault secret OCID for PostgreSQL connection string"
}

variable "dbconfig_mount_path" {
  type    = string
  default = "/dbconfig"
  description = "OCI Vault secret path for Postgres connection url"
}

variable "dbconfig_mount_name" {
  type    = string
  default = "dbconfig"
  description = "OCI Vault secret mount name for Postgres connection url"
}

variable "datapump_bucket" {
  type    = string
  description = "Datapump Object Storage bucket name"
}

variable "datapump_reload_delay" {
  type    = number
  default = 30000
  description = "Datapump Object Storage data reload interval in ms, use zero for never"
}

variable "metrics_config_mount_name" {
  type    = string
  default = "prometheus_grafana_configs"
}

variable "metrics_config_mount_path" {
  type    = string
  default = "/etc"
  description = "Prometheus and Grafana config path on volume mount"
}

variable "metrics_config_bucket" {
  type    = string
  default = "metrics-config"
  description = "Prometheus and Grafana config bucket name in Object Storage"
}

variable "metrics_config_reload_delay" {
  type    = number
  default = 30000
  description = "Prometheus and Grafana config reload interval in ms, use zero for never"
}
