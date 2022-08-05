# Wishes for Grafana Cloud

## Easier collection from Firebase

This likely falls on this repo to do.

---

Grafana is aimed at server-side data collection, but they *could* make it easier for web apps to provide metrics.

Currently (Jul 2022), Grafana Cloud *needs* (seems to need) an external Prometheus instance. They **tbd. link to docs** support PushGateway but only for *another* Prometheus instance to do `remote_write` (maybe wrong spelling) data passing to them.

**Expected**

Grafana Cloud would be a full, cloud based observability service **including** long-term storage for the metrics.

**Actual**

There is a storage component in Mimir, but there's no API to feed it peacemeal.

### Alternatives

- [Managed Service for Prometheus](https://cloud.google.com/managed-prometheus) (Google Cloud) can be used.
- Some Open... system that *looked* to fit the bill (provide an API to push to Grafana Cloud), then casually mentioned "you just need ... Kubernetes". 🥺
- ... Maybe others

<!--
### References

- []
-->