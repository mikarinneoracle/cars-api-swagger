data "oci_objectstorage_namespace" "objectstorage_namespace" {
  compartment_id = var.compartment_ocid
}

resource "oci_objectstorage_bucket" "www_data_bucket" {
  compartment_id = var.compartment_ocid
  name           = var.www_data_bucket
  namespace      = data.oci_objectstorage_namespace.objectstorage_namespace.namespace
  access_type    = "NoPublicAccess"
  object_events_enabled = "false"
  storage_tier          = "Standard"
  versioning            = "Disabled"
  count = var.create_www_data_bucket ? 1 : 0
}

resource "oci_objectstorage_object" "public_dir" {
  bucket    = var.www_data_bucket
  namespace = data.oci_objectstorage_namespace.objectstorage_namespace.namespace
  storage_tier = "Standard"
  content_type = "application/x-directory"
  object       = "public/"
  count = var.create_www_data_bucket ? 1 : 0
}

resource "oci_objectstorage_object" "private_dir" {
  bucket    = var.www_data_bucket
  namespace = data.oci_objectstorage_namespace.objectstorage_namespace.namespace
  storage_tier = "Standard"
  content_type = "application/x-directory"
  object       = "private/"
  count = var.create_www_data_bucket ? 1 : 0
}

resource "oci_objectstorage_object" "public_images_dir" {
  bucket    = var.www_data_bucket
  namespace = data.oci_objectstorage_namespace.objectstorage_namespace.namespace
  storage_tier = "Standard"
  content_type = "application/x-directory"
  object       = "public/images/"
  count = var.create_www_data_bucket ? 1 : 0
}

resource "oci_objectstorage_object" "private_images_dir" {
  bucket    = var.www_data_bucket
  namespace = data.oci_objectstorage_namespace.objectstorage_namespace.namespace
  storage_tier = "Standard"
  content_type = "application/x-directory"
  object       = "private/images/"
  count = var.create_www_data_bucket ? 1 : 0
}
