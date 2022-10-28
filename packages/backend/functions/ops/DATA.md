# Data

This file documents the use of Realtime Database, for proxying metrics and logs to Grafana Cloud.


## Cache

```
bridge/
  prom-position: {prom-key-string}
  loki-position: {loki-key-string}
  prom/
    {key}: IncEntry | ObsEntry
  loki/
    {key}: LogEntry
```  

The entries are arranged in two different lists, because they need two different APIs in the Grafana Cloud side, to push to. (This also means, two different location markers).

The `key` is an automatically increasing index, e.g. `"-NFTaEsWp652Iz2E-opx"`.


### Marker

The `bridge/{prom|loki}-position` entries carry the *last key(s) already transferred to Grafana Cloud* (or don't exist for a virgin list).

A scheduled function reads this first, and updates it once pushing to Grafana Cloud has happened.


### Definitions

```
IncEntry: { id: string, inc: double (>= 0.0), ctx: Ctx }
LogEntry: { id: string, level: "info"|"warn"|"error"|"fatal", msg: string, args: Array of any, ctx: Ctx }
ObsEntry: { id: string, obs: double, ctx: Ctx }

Ctx: { clientTimestamp: number, stage?: string, release?: string, uid?: string, ... }
```

