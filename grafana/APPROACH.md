# Approach


## In flux..

[Grafana Cloud Faro](https://grafana.com/oss/faro/) changes the metrics collection environment, by allowing web clients to feed Grafana Cloud, directly.

The repo doesn't currently support it, but this is planned for spring 2023.

**Until that is the case, consider the information in this folder temporary, at best!**


## Why Grafana Cloud?

Part of the problem of monitoring is simply to pick the right monitoring environment. This is a strategic choice. You shouldn't end up having multiple (at least, more than 2) monitoring tools within your projects, since this scatters knowledge and makes it more difficult for people to jump between projects.

The author considered the following approaches:

- making monitoring modular
- Raygun
- Sentry

..before finding Grafana Cloud and settling on it.

Let's visit each of the tried approaches, a bit.

**Making monitoring modular**

This is enticing for a market where companies already have picked their monitoring stack. The superframework would provide its own abstractions for e.g. timing measurement (browser Performance API can be used) and counters.

This turned out to be too complex, in practise. It works, but feels superficial, like many database-agnostic APIs do.

Also, functionality between different vendors seemed surprisingly far off, from each other. Doing a common API would anyways have gravitated towards a certain reference solution.

**Sentry**

Fine, but then the author found Grafana Cloud.

**LogRocket**

Tempting. A clear forerunner in the session recording aspect.


### Larger picture!!

If we aim the repo for *new companies* and *budding developers*, there doesn't need to be an existing monitoring environment to support. Part of the *value* of the repo becomes that someone's selected one, which is growing, good enough and stable.

This is the route that was taken.
