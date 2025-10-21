resource "oci_objectstorage_bucket" "www_data_bucket" {
  compartment_id = var.compartment_ocid
  name           = var.www_data_bucket
  namespace      = data.oci_objectstorage_namespace.objectstorage_namespace.namespace
  access_type    = "NoPublicAccess"
  object_events_enabled = "false"
  storage_tier          = "Standard"
  versioning            = "Disabled"
}

resource "oci_objectstorage_object" "public_dir" {
  bucket    = oci_objectstorage_bucket.www_data_bucket.name
  namespace = data.oci_objectstorage_namespace.objectstorage_namespace.namespace
  storage_tier = "Standard"
  content_type = "application/x-directory"
  object       = "public/"
}

resource "oci_objectstorage_object" "private_dir" {
  bucket    = oci_objectstorage_bucket.www_data_bucket.name
  namespace = data.oci_objectstorage_namespace.objectstorage_namespace.namespace
  storage_tier = "Standard"
  content_type = "application/x-directory"
  object       = "private/"
}

resource "oci_objectstorage_object" "public_images_dir" {
  bucket    = oci_objectstorage_bucket.www_data_bucket.name
  namespace = data.oci_objectstorage_namespace.objectstorage_namespace.namespace
  storage_tier = "Standard"
  content_type = "application/x-directory"
  object       = "public/images/"
}

resource "oci_objectstorage_object" "private_images_dir" {
  bucket    = oci_objectstorage_bucket.www_data_bucket.name
  namespace = data.oci_objectstorage_namespace.objectstorage_namespace.namespace
  storage_tier = "Standard"
  content_type = "application/x-directory"
  object       = "private/images/"
}
