variable "compartment_ocid" {
  type = string
}

variable "tenancy_ocid" {
  type = string
}

variable "subnet_ocid" {
  type = string
}

variable "sidecar_image" {
  type = string
}

#### LIST ALL APP IMAGES HERE ####

variable "app_image_1" {
  type = string
}

variable "app_image_2" {
  type = string
}

##################################

variable "ad_number" {
  type    = number
  default = 1
}

variable "log_ocid" {
  type    = string
}

variable "log_mount_path" {
  type    = string
  default = "/var/log"
}

variable "log_mount_name" {
  type    = string
  default = "applog"
}

variable "log_file" {
  type    = string
  default = "app.log"
}

variable "log_header" {
  type    = string
}

variable "www_mount_path" {
  type    = string
  default = "/usr/share/nginx/html"
}

variable "www_mount_name" {
  type    = string
  default = "nginxdata"
}

variable "www_data_bucket" {
  type    = string
}

variable "apigw_hostname" {
  type    = string
}

variable "www_reload_delay" {
  type    = number
}

