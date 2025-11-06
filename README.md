## Container Instances Cars API with Swagger, NGINX, OCI Logging, API Gateway with Authorizer Fn, Redis, PostgreSQL, OCI Vault

<table>
    <tr>
        <td width="200">
        <img src="./main.png" width="200"/>
        <p>
        Image by <a href="http://www.freepik.com">Freepik</a>
        </td>
        <td width="800">
        <img src="arch5.png" width="800"/>
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
<p>
Note! Create the OCIR repos before running the pipeline:
<pre>
fra.ocir.io/$ns/ci-sidecar
fra.ocir.io/$ns/ci-sidecar-vault
fra.ocir.io/$ns/ci-sidecar-metrics
fra.ocir.io/$ns/cars-api
fra.ocir.io/$ns/ci-signup-web
</pre>
where <code>$ns</code> is <code>ns=$(oci os ns get | jq .data | tr -d '"')</code>

## Deploy CI stack

Create a VCN with public and private subnet. Deploy the stack to the private subnet by configuring the private subnet OCID to the stack configuration during deploying.
<p>

In private subnet's security list open the following ports for the public subnet's CIDR:
<pre>
80 for NGINX
3000, 3001, 3002 for Car API versions
8080 for Sign Up Spring Boot web app
8090 for Grafana
5432 for OCI Postgresql PaaS database
6379 for OCI Cache PaaS with Redis
</pre>

In public subnet's security list open the following ports to Internet (CIDR 0.0.0.0/0) :
<pre>
443 for API Gateway
</pre>
Then create the API Gateway to the public subnet manually from OCI console.
<p>

You can deploy the Container Instances stack from below with OCI Resource Manager (Terraform) 
or clone this repo to localhost and drag-drop the terraform folder to OCI Resource Manager when
creating a new Stack
<p>
    
[![Deploy to Oracle Cloud](https://oci-resourcemanager-plugin.plugins.oci.oraclecloud.com/latest/deploy-to-oracle-cloud.svg)](https://cloud.oracle.com/resourcemanager/stacks/create?zipUrl=https://github.com/mikarinneoracle/cars-api-swagger/releases/download/latest/ci-stack.zip)

