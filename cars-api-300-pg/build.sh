ns=$(oci os ns get | jq .data | tr -d '"')
docker build . --build-arg APIGW_PATH=/api-300 -t fra.ocir.io/$ns/cars-api:3.0.0
