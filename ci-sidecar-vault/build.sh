ns=$(oci os ns get | jq .data | tr -d '"')
docker build . -t fra.ocir.io/$ns/ci-sidecar-vault:1.0.0
