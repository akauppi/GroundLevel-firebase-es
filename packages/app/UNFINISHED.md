# Unfinished

Once this gets done, make an entry in `APPROACH.md`.



## Where to log?

This should be simple, but...

Firebase doesn't have a solution for central logging of web applications.

### Considered: Log Events

There is [Log Events](https://firebase.google.com/docs/analytics/events) (part of Analytics) that states:

> Events provide insight on what is happening in your app, such as user actions, system events, or errors.

That's great! Pretty much what I want. Except...

To use "Log Events" one needs to enable Google Analytics for the Firebase project. The author would rather not have that, for such a central (*pun*) step as logging is.

<!-- disabled (readability)
>Sideline: You can of course use Log Events if that suits your application. Bake it into your app in the `app` subpackage. Or create an ops adapter for it.
-->

### Cloud Logging

As an initial adapter, we support [Cloud Logging](https://cloud.google.com/logging/docs). This is where your Cloud Functions logs are going, anyhow. The product also passes the "ease and speed" test above, in the author's opinion.

For some reason, there is no direct web app -> Cloud Logging possibility (without possibly complex authentication dances?). This is why the Cloud Logging adapter batches and ships the logs to your Cloud Functions, which then pass them on to Cloud Logging - which makes them visible for you in the dashboard.

This is not ideal. It means we need to cater for offline mode, transmission failures and optimize for batch size. But heck, it seems it's the way to go. 

**References:**

- [Collecting browser console logs in Stackdriver](https://medium.com/google-cloud/collecting-browser-console-logs-in-stackdriver-fa388a90d32b) (blog, Dec 2019)

   *Stackdriver is the earlier name for Cloud Logging*

