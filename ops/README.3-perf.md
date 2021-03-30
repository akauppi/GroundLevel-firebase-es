# Performance monitoring

The `app` package contains [Firebase Performance Monitoring](https://firebase.google.com/docs/perf-mon) instrumentation and if you've played around with the app in "online" mode (`npm run dev:online`), performance information should already have been sent to Firebase Console.

## Purpose

Performance monitoring is partly a developer feature, partly ops. It allows one to get statistical knowledge of how your application works in the hands of actual users, no matter where they live and how they are connected to the Internet.

As a developer, you are:

- validating your assumptions. Do things work "out there" the same as on your developer machine (and your selected development browser)
- looking for outliers. Big deviations in some metric may tell about problems with certain kinds of users / browsers / etc.


As an ops engineer, you are:

- looking for trends in the measurements. Did something become faster/slower after a certain deployment? Do measures stay in agreed performance windows (catches long time performance crawl that's not immediately noticable)?

## Persistence

Performance metrics - like logs - should be treated as flowing information. Firebase Performance Monitoring keeps the last <font color=red>*tbd. fill in (days/weeks)*</font> of data available.


## Digesting the information

[Firebase Console](https://console.firebase.google.com/u/0/) > project > `Performance`

You should see:

![](.images/sdk-detected.png)

>If not, follow their troubleshooting instructions. In short, use the app for a while, switch pages, leave open for a moment.

Getting statistics seems to take up to 24h more. Then:

<!-- tbd... -->
... 


---

<p align="right">Next: <a href="README.4-alerts.md">Alerts</a></p>

