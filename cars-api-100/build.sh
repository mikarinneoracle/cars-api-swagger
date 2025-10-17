ns=$(oci os ns get | jq .data | tr -d '"')
docker build . --build-arg APIGW_PATH=/api-100 -t fra.ocir.io/$ns/cars-api:1.0.0-free
