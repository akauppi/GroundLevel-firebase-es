# Cloud Functions

## Logging

The front-end code does central logging using Cloud Functions.

To see such logs:

```
$ firebase functions:log
...
2020-06-19T23:35:15.393Z ? logs_v1: We got up!
...
```

..or go to Firebase Console > Functions > Logs

>Note: Likely going to use some other service for monitoring, eventually (e.g. Datadog). Firebase doesn't really have a metrics / logging solution does it?
>
>Requirements:
>
>- offline friendly (callables are not)
>- good SRE dashboard

