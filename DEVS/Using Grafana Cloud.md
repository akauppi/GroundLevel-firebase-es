# Using Grafana Cloud

## Source of confusion?

When browsing through the Grafana Cloud documentation, some parts felt confusing to the author (Sep 2022). Grafana Cloud brings in a multitude of different data sources, some of them being complementary, others (most) just Not Needed for this repository.

Of the ones built in (LGTM stack: Loki, Grafana, Tempo, Mimir), such sub-brands - though understandable from a modular development point of view - kind of add to the confusion. In addition, there is Prometheus. Likely we don't need it, but coming to that conclusion took some weeks of calendar time from the author..

Also, our use case dramatically differs from the traditional server-based model. We **cannot use a scraper** routine, since a) metrics and logs are collected from hopefully numerous web front ends, b) gathering happens within ephemeral Cloud Functions that only execute momentarily.

Since Grafana Cloud isn't really focusing on this use case, it took some effort and time to see, whether it actually can be done, at all.


## Collecting metrics

**Need:**

Cloud Function code, running scheduled, should be able to ship a set of metrics to be visible in Grafana Cloud.

**Solution:**

Based on [this comment](https://community.grafana.com/t/how-to-push-prometheus-metrics-in-grafana-cloud/47297/8) (Grafana forums > Grafana Cloud), an API surfaced that can be used to push metrics to Grafana Cloud, piece-meal.

- ["Pushing from applications directly"](https://grafana.com/docs/grafana-cloud/data-configuration/metrics/metrics-influxdb/push-from-telegraf/#pushing-from-applications-directly)

>Note: Without the help, this API could have remained lost. We don't deal with InfluxDB, under which it is mentioned.

This works.

>..meaning, we get 204 from the `POST`. Still figuring out where in the Grafana Cloud GUI the metrics can be seen.

<p />

**Alternative solution (not implemented):**

Prometheus `remote_write` interface is normally recommended for "ephemeral" jobs, like batch jobs. Found a client for doing it, but it involves a Protobuf interface, so becomes more complicated than just a REST API.

<!--
## Collecting logs

*tbd. Still WIP. We can `POST` Loki logs, but where should they be seen in the GUI..*
-->


## Grafana Cloud has two faces

### Cloud Portal

>The Cloud Portal is where you view and manage everything related to your Grafana Cloud account. 

The URL can be e.g. 

`https://grafana.com/orgs/ak190722`

Use for:

- creating API keys
- managing stacks (if commercial account)
   - enabling services (Loki, Prometheus???, Grafana??)

Free tier provides just one stack, and no means to add/remove services within it. If you have a commercial account, you can have multiple stacks, all controlled under the same portal. Ok? :)


### Grafana Dashboard

Pushing `Grafana` > `Launch` (or `Log in`) in a stack takes you to that stack's Grafana dashboard.

The URL can be eg.

`https://ak190722.grafana.net/a/cloud-home-app`


>NOTE! Be careful if clicking the `Users` or `API Keys` "tabs" (they aren't really) in the Dashboard UI. They **open Cloud Portal in another browser tab**, without asking. While the back button does take you back to the earlier browser tab, this kind of tab gymnastics is unwanted in the author's point of view. No other site he uses does similar!!
