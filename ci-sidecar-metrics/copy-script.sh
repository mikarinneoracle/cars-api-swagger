# Create manually before running this script:
# cars-metrics-config -bucket with following directories:
#├── grafana/
#│   └── provisioning/
#│       ├── dashboards/
#│       └── datasources/
#└── prometheus/

oci os object bulk-upload --bucket-name cars-metrics-config --overwrite --src-dir ./object-storage
