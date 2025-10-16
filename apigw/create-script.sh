ci_private_ip="10.0.1.55"
compartment_ocid="ocid1.compartment.oc1..aaaaaaaawccfklp2wj4c5ymigrkjfdhcbcm3u5ripl2whnznhmvgiqdatqgq"
gateway_ocid="ocid1.apigateway.oc1.eu-frankfurt-1.amaaaaaauevftmqay6tnijdosv2bbrh5tgsmvy2zcjdeiukp4il23zap6bxa"
timestamp=$(date +%s)
sed "s|{CI_PRIVATE_IP}|$ci_private_ip|g" deployment.json > "deployment_$timestamp.json"
cat "deployment_$timestamp.json"
oci api-gateway deployment create --compartment-id $compartment_ocid --gateway-id $gateway_ocid --path-prefix "/" --specification file://./"deployment_$timestamp.json"
rm -f cat "deployment_$timestamp.json"