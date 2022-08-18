# Ops sandbox

The purpose of this folder is to help in developing Cloud Monitoring and Cloud Logging tooling.

As a user of the web app template, you can just ignore it.


## Usage

As from [https://cloud.google.com/monitoring/docs/references/libraries](https://cloud.google.com/monitoring/docs/references/libraries)

### Generate a key file

```
$ export GCLOUD_PROJECT=groundlevel-sep22
$ export JSON_FILE=some.json

$ gcloud iam service-accounts keys create $JSON_FILE --iam-account=${PROJECT_ID}@appspot.gserviceaccount.com	
```

```
$ export GOOGLE_APPLICATION_CREDENTIALS=$(pwd)/$JSON_FILE
```

### Ship metrics

```
$ node ship.js
```



## References

- [Node.js client for Stackdriver](https://github.com/googleapis/nodejs-monitoring) (GitHub)

