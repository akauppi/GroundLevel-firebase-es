# Developer notes

## Hints 🤫

Run at project root:

```
$ gcloud meta list-files-for-upload
```


## Build logs

Logs seem to be made to a folder such as:

```
$ tree ~/.config/gcloud/logs/2021.03.24/
...
├── 10.28.56.820434.log
├── 10.33.56.087111.log
├── 10.33.56.633430.log
├── 10.40.40.522820.log
├── 10.40.41.091705.log
├── 10.42.38.271254.log
├── 10.42.38.876390.log
├── 11.29.27.531947.log
├── 11.29.28.084373.log
├── 11.36.11.061691.log
├── 11.36.11.598513.log
├── 11.36.50.785258.log
├── 11.36.51.330953.log
├── 11.48.46.244448.log
├── 11.48.46.778526.log
├── 11.49.35.273838.log
├── 11.49.35.796257.log
├── 12.30.09.503711.log
├── 12.31.35.041018.log
├── 14.31.10.294233.log
├── 14.44.21.216922.log
├── 14.57.16.315666.log
├── 15.00.53.808320.log
└── 15.02.09.599417.log
```

## `.gcloudignore`

Cloud Build ignores the files in the *root*'s `.gitignore` automatically but:

- it does not check the global `.gitignore` (that's fine)
- it does not check `.gitignore`s in subdirectories (this one is not so fine)

For these reasons, the repo has its own `.gcloudignore` in the root, to keep the transports small.



<!-- remove
## Build logs

These are store by default to: 

```
gs://[PROJECT_NUMBER].cloudbuild-logs.googleusercontent.com/
```

## Sources copied

Stored by default to:

```
gs://[PROJECT_ID]_cloudbuild/source 
```
-->

## Use of Cloud Storage 

Cloud Build uses Cloud Storage (of the same project) to store files. During the development of the repo, the buckets looked like this:

>![](.images/gcs-list.png)

The `groundlevel-160221_cloudbuild` is the important one for us.

It has a `source/` folder with `.tgz` packages.

If you have problems, check that the packaging is how you'd imagine it to be.

>*tbd. Is there a way, in the command line, to tell which files Cloud Build would include?*


### Build logs

One omission in the above screen capture is build logs.

`gcloud builds submit --help` states that they should be stored (by default) in a bucket:

```
gs://[PROJECT_NUMBER].cloudbuild-logs.googleusercontent.com/
```

>*tbd. Where can I see Cloud Build logs?*


## References

- `gcloud topic gcloudignore`
