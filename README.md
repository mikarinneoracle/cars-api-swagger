# Container Instances Cars API with Swagger, NGINX and OCI Logging

<img src="./main.png" width="200"/>
<p>
<font size="-2">Image by <a href="freepik.com">Freepik</a></font>

## Build containers

Build containers with GitHub Actions <a href=".github/workflows/containers.yml">pipeline</a>.
<p>
    
This requires three secrets:
<pre>
DOCKER_USERNAME
AUTH_TOKEN
TENANCY_NAMESPACE
</pre>
It uses <code>FRA</code> region for OCIR, i.e. Registry is <code>fra.ocir.io</code>

## Deploy CI stack

You can deploy the Container Instances stack from below with OCI Resource Manager (Terraform) 
or clone this repo to localhost and drag-drop the terraform folder to OCI Resource Manager when
creating a new Stack
<p>
    
[![Deploy to Oracle Cloud](https://oci-resourcemanager-plugin.plugins.oci.oraclecloud.com/latest/deploy-to-oracle-cloud.svg)](https://cloud.oracle.com/resourcemanager/stacks/create?zipUrl=https://github.com/mikarinneoracle/cars-api-swagger/releases/download/latest/ci-stack.zip)

