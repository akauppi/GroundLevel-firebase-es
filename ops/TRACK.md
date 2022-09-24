# Track

## Firebase Crashlytics: Availability for web

- [ ] [FR: Crashlytics firebase](https://github.com/firebase/firebase-js-sdk/issues/710) (GitHub issue; Apr 2018)

   Not available for web, as of May 2022.

   If it becomes, let's consider it vs. Sentry.


## Grafana Cloud: Overview should indicate data is in

>![](https://aws1.discourse-cdn.com/business7/uploads/grafana/original/3X/a/5/a52d72699e891f58cc1d2363bb82bc5ee1c51465.png)

Why do I have `Send Metrics` and `Send Logs` if Grafana Cloud has accepted some data???????

**Expected:**

- Once data has been pushed (via `/api/v1/push/influx/write` = InfluxDB Line Protocol for Prometheus; via `/loki/api/v1/push` for Loki), the overview page should idicate this, somehow.
- In particular, there should no longer be `Send Metrics` and `Send Logs` buttons that lead to a page telling *how* to feed data.

**Actual:**

- Prometheus: `Current Active Series: 0` remains, even once data is in.
- Loki: `Ingest Rate: 0 bytes/hr` remains (and may be correct)

**Tracking**

- Sent an email about this to `cloud-success@grafana.com`, as asked by David Dorman in [his comment](https://community.grafana.com/t/how-to-push-prometheus-metrics-in-grafana-cloud/47297/19?u=akauppi).

