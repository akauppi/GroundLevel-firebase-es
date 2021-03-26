# Developer notes

## Hints 🤫

Run at project root:

```
$ gcloud meta list-files-for-upload
```


## `.gcloudignore`

Cloud Build ignores the files in the *root*'s `.gitignore` automatically but:

- it does not check the global `.gitignore`
- it does not check `.gitignore`s in subdirectories (this one is not so fine)

For these reasons, the repo has its own `.gcloudignore`, to keep the transports small.


## Use of Cloud Storage 

Cloud Build uses Cloud Storage (of the same project) to store files. During the development of the repo, the buckets looked like this:

>![](.images/gcs-list.png)

The `groundlevel-160221_cloudbuild` is the important one for us.

It has a `source/` folder with `.tgz` packages.

If you have problems, check that the packaging is how you'd imagine it to be.


### Build logs

One omission in the above screen capture is build logs.

`gcloud builds submit --help` states that they should be stored (by default) in a bucket:

```
gs://[PROJECT_NUMBER].cloudbuild-logs.googleusercontent.com/
```

>*tbd. Where can I see Cloud Build logs?*


## References

- `gcloud topic gcloudignore`
