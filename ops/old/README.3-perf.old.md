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

## Persistence

Performance metrics - like logs - should be treated as flowing information. Firebase Performance Monitoring keeps the last XX days/weeks of data available.

>*Q: Does anyone know, what the retention policy for Firebase Performance Monitoring is?*


## "near real time"?

In Mar 2020, it seems, Firebase Performance Monitoring is still being fed "in batches" instead of a streaming, near real time operations.

See Firebase Performance Monitoring > [FAQ](https://firebase.google.com/docs/perf-mon/troubleshooting?platform=web#faq-real-time-definition)

The page mentions "soon", but gives no reference as to when that claim was made.. Yeah, right. 😐

Hopefully, we'd get the near real time, well... in near Real time.


## Digesting the information

[Firebase Console](https://console.firebase.google.com/u/0/) > project > `Performance`


Would really *LOVE* to finish this section, but telling about something like analytics without proper hands on knowledge is speculative, and waste of time!

This section should cover:

- Analyzing custom performance traces in the Firebase Console
- Grouping URL accesses so that the `Network` tab (of the Console) becomes more useful

`#help`: if you'd like to help with this documentation, that would be YayYayYayyyyyyyy!!! 🤞🎊🎉 


---

<p align="right">Next: <a href="README.4-alerts.md">Alerts</a></p>

