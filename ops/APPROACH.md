# Approach

## Collecting metrics from front end

This was surprisingly hard.

Monitoring frameworks are geared towards server-side processes.

### Alternatives considered

|||
|---|---|
|Grafana Cloud|Integration would happen via Prometheus "remote-write", meaning there needs to be a *local* Prometheus instance, first.<br />This is a perfectly valid arrangement, and its reasons are described in ["Introducing Prometheus Agent mode, ..."](https://prometheus.io/blog/2021/11/16/agent/) (blog, Nov 2021). However, it doesn't really match our case.|
|OpenCensus|Glimpsed this. Would work, but going with the native Google Cloud Monitoring API seemed more appropriate.|
|`@google-cloud/monitoring`|The "winner", because we only need a Node.js client. Thus it should work best for proxying metrics at a Cloud Function|

### Proxy via Cloud Functions

It makes sense that a monitoring collection site is not publicly available in the Internet. No matter which backend, we likely will need the proxying via Cloud Functions (only for logged in users) to remain in place.

The same proxying mechanism can be used for centralized logging, as well.

## Married to Google Cloud?

Not necessarily.

If Grafana Cloud makes it equally easy for us to deliver metrics as the `@google-cloud/monitoring` does, we can use it, instead. Or both.

Currently (Aug 2022), Grafana Cloud requires a Prometheus instance (at least in agent mode) on our side.

