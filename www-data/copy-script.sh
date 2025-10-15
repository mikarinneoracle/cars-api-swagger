# Create manually before running this script:
# cars-api-swagger -bucket with following directories:
# public
# public/images
# private
# private/images

oci os object bulk-upload --bucket-name cars-api-swagger --overwrite --src-dir .
