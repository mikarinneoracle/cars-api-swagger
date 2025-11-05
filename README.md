# Container Instances Cars API with Swagger, NGINX and OCI Logging

<table border="0">
    <tr>
        <td width="200">
        <img src="./main.png" width="200"/>
        <p>
        Image by <a href="http://www.freepik.com">Freepik</a>
        </td>
        <td width="800">
        <img src="arch.png" width="800"/>
        </td>
    </tr>
</table>
    
<p>

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

