ns=$(oci os ns get | jq .data | tr -d '"')
docker build . -t fra.ocir.io/$ns/ci-signup-web:1.0.0
