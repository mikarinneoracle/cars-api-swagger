resource "oci_container_instances_container_instance" "container_instance" {
  availability_domain = data.oci_identity_availability_domain.oci_ad.name
  compartment_id      = var.compartment_ocid
  containers {

    image_url    = "nginx"
    display_name = "nginx"

    is_resource_principal_disabled = "false"
    resource_config {
      memory_limit_in_gbs = "1.0"
      vcpus_limit         = "1.0"
    }

    volume_mounts {
          mount_path  = var.www_mount_path
          volume_name = var.www_mount_name
    }

  }
  
  #### LIST ALL APP CONTAINERS HERE ####
  
  containers {

    image_url    = "${var.ocir_region}/${data.oci_objectstorage_namespace.objectstorage_namespace.namespace}/${var.app_image_1}"
    display_name = "app-1"
    environment_variables = {
      "log_file" = "${var.log_mount_path}/${var.log_file}"
    }
    
    is_resource_principal_disabled = "false"
    resource_config {
      memory_limit_in_gbs = "1.0"
      vcpus_limit         = "1.0"
    }
    volume_mounts {
          mount_path  = var.log_mount_path
          volume_name = var.log_mount_name
    }
  }
  
  containers {

    image_url    = "${var.ocir_region}/${data.oci_objectstorage_namespace.objectstorage_namespace.namespace}/${var.app_image_2}"
    display_name = "app-2"
    environment_variables = {
      "log_file" = "${var.log_mount_path}/${var.log_file}"
    }
    
    is_resource_principal_disabled = "false"
    resource_config {
      memory_limit_in_gbs = "1.0"
      vcpus_limit         = "1.0"
    }
    volume_mounts {
          mount_path  = var.log_mount_path
          volume_name = var.log_mount_name
    }
  }
  
  containers {

    image_url    = "${var.ocir_region}/${data.oci_objectstorage_namespace.objectstorage_namespace.namespace}/${var.app_image_3}"
    display_name = "app-3"
    environment_variables = {
      "log_file" = "${var.log_mount_path}/${var.log_file}"
      "secrets_file" = "${var.dbconfig_mount_path}/connection.txt"
    }
    
    is_resource_principal_disabled = "false"
    resource_config {
      memory_limit_in_gbs = "1.0"
      vcpus_limit         = "1.0"
    }
    volume_mounts {
          mount_path  = var.log_mount_path
          volume_name = var.log_mount_name
    }
    volume_mounts {
          mount_path  = var.dbconfig_mount_path
          volume_name = var.dbconfig_mount_name
    }
  }
  
  containers {

    image_url    = "${var.ocir_region}/${data.oci_objectstorage_namespace.objectstorage_namespace.namespace}/${var.app_image_4}"
    display_name = "app-4"
    environment_variables = {
      "REDIS_HOST" = var.redis_host
      "REDIS_SSL" = "true"
      "CONTINUE_URL" = "/private/index.html"
      "LOG_FILE" = "${var.log_mount_path}/${var.log_file}"
    }
    
    is_resource_principal_disabled = "false"
    resource_config {
      memory_limit_in_gbs = "1.0"
      vcpus_limit         = "1.0"
    }
    volume_mounts {
          mount_path  = var.log_mount_path
          volume_name = var.log_mount_name
    }
  }
  
  #######################################
  
  containers {
    image_url    = "${var.ocir_region}/${data.oci_objectstorage_namespace.objectstorage_namespace.namespace}/${var.sidecar_image}"
    display_name = "sidecar for OCI Object Storage and Logging"
    environment_variables = {
      "log_ocid" = var.log_ocid
      "log_file" = "${var.log_mount_path}/${var.log_file}"
      "log_header" = var.log_header
      "www_path" = var.www_mount_path
      "os_bucket" = var.www_data_bucket
      "www_reload_delay" = var.www_reload_delay
    }

    is_resource_principal_disabled = "false"
    resource_config {
      memory_limit_in_gbs = "1.0"
      vcpus_limit         = "1.0"
    }
    volume_mounts {
          mount_path  = var.log_mount_path
          volume_name = var.log_mount_name
    }
    volume_mounts {
          mount_path  = var.www_mount_path
          volume_name = var.www_mount_name
    }
  }
  
  containers {
    image_url    = "${var.ocir_region}/${data.oci_objectstorage_namespace.objectstorage_namespace.namespace}/${var.sidecar_vault_image}"
    display_name = "sidecar for OCI Vault and DB datapump from Object Storage"
    environment_variables = {
        "secrets_file" = "${var.dbconfig_mount_path}/connection.txt"
        "secret_ocid" = var.vault_secret_ocid
        "os_bucket" = var.datapump_bucket
        "datapump_reload_delay" = var.datapump_reload_delay
    }
    
    is_resource_principal_disabled = "false"
    resource_config {
      memory_limit_in_gbs = "1.0"
      vcpus_limit         = "1.0"
    }
    
    volume_mounts {
          mount_path  = var.dbconfig_mount_path
          volume_name = var.dbconfig_mount_name
    }
  }
  
  shape = "CI.Standard.E4.Flex"
  shape_config {
    memory_in_gbs = "16"
    ocpus         = "1"
  }
  
  vnics {
    subnet_id = var.subnet_ocid
  }

  container_restart_policy = "ON_FAILURE"
  display_name             = "Nginx with OCI SDK sidecar, Redis signup and PostgreSQL for API 3.0.0"

  graceful_shutdown_timeout_in_seconds = "10"

  state = "ACTIVE"
  
  volumes {
      name          = var.log_mount_name
      volume_type   = "EMPTYDIR"
      backing_store = "EPHEMERAL_STORAGE"
  }
    
  volumes {
      name          = var.www_mount_name
      volume_type   = "EMPTYDIR"
      backing_store = "EPHEMERAL_STORAGE"
  }
  
  volumes {
      name          = var.dbconfig_mount_name
      volume_type   = "EMPTYDIR"
      backing_store = "EPHEMERAL_STORAGE"
  }
}

data "oci_identity_availability_domain" "oci_ad" {

  compartment_id = var.tenancy_ocid
  ad_number      = var.ad_number
}
