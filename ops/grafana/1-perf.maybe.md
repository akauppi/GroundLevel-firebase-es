# Performance monitoring

<!-- needed/useful/true??
The `app` package contains [Firebase Performance Monitoring](https://firebase.google.com/docs/perf-mon) instrumentation.
 and if you've played around with the app in "online" mode (`npm run dev:online`), performance information should already have been sent to Firebase Console.
-->

## Purpose

Performance monitoring is partly a developer feature, partly ops. It allows one to get statistical knowledge of how your application works in the hands of actual users, no matter where they live and how they are connected to the Internet.

As a developer, you are:

- validating your assumptions. Do things work "out there" the same as on your developer machine (and your selected development browser/s)
- looking for outliers. Big deviations in some metric may tell about problems with certain kinds of users / browsers / etc.

As an ops engineer, you are:

- looking for trends in the measurements. Did something become faster/slower after a certain deployment? Do measures stay in agreed performance windows (catches long time performance degradation that's not immediately noticable)?


## Digesting the information

>*tbd. Looking at performance information in Grafana Cloud console*

<!--
This section should cover:

- Analyzing custom performance traces in the Firebase Console
-->

---

<p align="right">Next: <a href="README.4-alerts.md">Alerts</a></p>

