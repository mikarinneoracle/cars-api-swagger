ci_private_ip="10.0.1.55"
deployment_ocid="ocid1.apideployment.oc1.eu-frankfurt-1.amaaaaaauevftmqaexvtoknbc5wv4mqcsmmiwmpcupweqrhzisgaxy76ky6q"
timestamp=$(date +%s)
sed "s|{CI_PRIVATE_IP}|$ci_private_ip|g" deployment.json > "deployment_$timestamp.json"
cat "deployment_$timestamp.json"
oci api-gateway deployment update --deployment-id $deployment_ocid --specification file://./"deployment_$timestamp.json"
rm -f "deployment_$timestamp.json"