source settings.env
read -p "Enter Container Instances private IP:" ci_private_ip
timestamp=$(date +%s)
sed "s|{CI_PRIVATE_IP}|$ci_private_ip|g" deployment.json > "deployment_$timestamp.json"
sed -i "s|{AUTH_FUNC_OCID}|$auth_function_ocid|g" "deployment_$timestamp.json"
cat "deployment_$timestamp.json"
oci api-gateway deployment update --deployment-id $deployment_ocid --specification file://./"deployment_$timestamp.json"
rm -f "deployment_$timestamp.json"
