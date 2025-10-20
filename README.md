# Container Instances Cars API with Swagger, NGINX and OCI Logging

## Build containers

Build containers with GitHub Actions <a href=".github/workflows/containers.yml">pipeline</a>.
<p>
    
This requires three secrets:
<pre>
fra.ocir.io DOCKER_USERNAME
fra.ocir.io AUTH_TOKEN
TENANCY_NAMESPACE
</pre>

## Deploy CI stack

[![Deploy to Oracle Cloud](https://oci-resourcemanager-plugin.plugins.oci.oraclecloud.com/latest/deploy-to-oracle-cloud.svg)](https://cloud.oracle.com/resourcemanager/stacks/create?zipUrl=https://github.com/mikarinneoracle/cars-api-swagger/releases/download/latest/ci-stack.zip)
