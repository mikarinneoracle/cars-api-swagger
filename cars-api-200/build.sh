ns=$(oci os ns get | jq .data | tr -d '"')
docker build . --build-arg APIGW_PATH=/api-200 -t fra.ocir.io/$ns/cars-api:2.0.0
