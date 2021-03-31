# Logging


## Preface

There are multiple kinds of logging in your system:

- Logs from Cloud Functions. These are automatically passed to both Firebase Console > *project* > `Functions` > `Logs` as well as Google's Cloud Logging.
- Firebase Hosting logs. You can [manually enable](https://support.google.com/firebase/answer/9748636) collecting these in Cloud Logging.
- Browser console logs. Useful in debugging but won't leave the browser.

In a traditional web app, problems can sometimes be seen by following the server logs. With a single page application, there are less if any fetches after the initial let-go. Therefore, the app needs a way to mail back to its authors about its health. There are two mechanisms for this: logging and performance metrics.

For logging, we've prepared the `@ops/central` module so that the *app code* can decide what it wants to log, but the *ops code* decides where those logs are routed, how they are buffered and whether meta information is added to them.

The ops layer does some implicit logging as well, informing you of on-field crashes your users have experienced so you can fix them faster.

>Note: With logging, it is CRUCIAL to respect your users' privacy. Do not log information that would breach this (Firebase uid's are likely okay at times, if they help resolving the situation). Make team/company guidance on this!

## Cloud Logging

The default recipient of `central` logs is your Cloud Logging instance.

<font color=red>tbd. Complete once Cloud Logging logging works</font>

<!--
- where to see the logs


-->


## Alerts etc.

Logs provide a real time knowledge of your application's use and its health. In the next chapter, we look at integrating them to alerts, so you don't have to stare at logs all day.

---

<p align="right">Next: <a href="README.3-alerts.md">Alerts</a></p>
