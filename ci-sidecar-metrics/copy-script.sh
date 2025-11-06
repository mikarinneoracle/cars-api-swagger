# Create manually before running this script:
# metrics-config -bucket with following directories:
#├── grafana/
#│   └── provisioning/
#│       ├── dashboards/
#│       └── datasources/
#└── prometheus/

oci os object bulk-upload --bucket-name metrics-config --overwrite --src-dir ./object-storage
