# Ops sandbox

Writing metrics to Grafana Cloud with Prometheus "remote write" interface.

No Prometheus agent is involved. The node.js [`prometheus-remote-write`](https://github.com/huksley/prometheus-remote-write) package directly acts at the Protobuf level.
