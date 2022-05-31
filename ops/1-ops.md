## Operational monitoring

### Introduction 

Operational monitoring ("ops" for short) is like a sports watch on your app. It lets you know:

- do we have any users?
   - from where are they from?
   - do they return to the application, and if so, how frequently?

- how is the user experience?
   - are there any crashes?
   - is the performance at anticipated levels? 

To do all this, operational monitoring ties to multiple other services (source code control; alerts) and is more of an *ecosystem* than a single product.

You can mix-and-match such products in multiple ways. We present one - working - solution that may fit your needs.

- 🚀 [Performance monitoring](./README.1-perf.md)

   [Firebase Performance Monitoring](https://firebase.google.com/docs/perf-mon) collects performance information of your application. The reports are visible within the normal Firebase Console.
   
   Some of the performance data is automatically collected; others are sections of code that you want to explicitly monitor.

- 💔 [Error monitoring](./README.2-errors.md)

   [Sentry](http://sentry.io) is an anomaly reporting framework. It's comprehensive, yet easy to use. You should study its documents at your own pace, but to get things started it's enough to follow the steps.

- 📜 [Logging](./README.3-logging.md)

   Central logging is often seen as a backend-kind of thing, but makes sense also for web applications. In lack of a tool that would do this nicely, the template (with some help from its backend) runs a proxy that allows collecting logs in the Google Cloud Logging service.

