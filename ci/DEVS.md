# Developer notes


## `.gcloudignore`

Cloud Build ignores the files in the *root*'s `.gitignore` automatically but:

- it does not check the global `.gitignore`
- it does not check `.gitignore`s in subdirectories

For these reasons, the repo has its own `.gcloudignore`, to keep the transports small.


## Use of Cloud Storage 

Cloud Build uses Cloud Storage (of the same project) to store files. During the development of the repo, the buckets looked like this:

>![](.images/storage-list.png)

The `*_cloudbuild` bucket has a `source/` folder with `.tgz` packages.

>Note: These `.tgz` files are not big (~120 kB) but they do add up. You may want to wipe the folder, or set a lifecycle for it.
>
>(Please suggest the steps for adding the lifecycle, eg. retain for 30 days only. `#help`)


<!-- hidden; not really a problem?
## Build logs

`gcloud builds submit --help` states that build logs should be stored (by default) in a bucket:

```
gs://[PROJECT_NUMBER].cloudbuild-logs.googleusercontent.com/
```

>*tbd. Where can I see Cloud Build logs?*
-->

## Troubleshoot locally

To launch a Docker container, similar to what `gcloud builds submit` does:

```
$ docker run -it --volume `pwd`/..:/workspace gcr.io/groundlevel-160221/firebase-ci-builder:9.11.0-node16-npm7 /bin/bash
bash-5.0#
```

You can now execute the build steps and debug, if something doesn't work right. Faster than changing `cloudbuild.yaml`.

>Note DIFFERENCES: Whereas Cloud Build copies files and **excludes** certain ones, here you see a mapping of the actual disk contents on your host. If you remove something, it's removed in the host.


## Viewing builds

See -> [Viewing build results](https://cloud.google.com/build/docs/view-build-results) (Cloud Build docs)


## Kaniko caching

Not for us. It seems a technology worth if one builds Docker containers (this is *not* clearly stated in its documentation, but implied).


## Misc notes

- Timeout for the builds seems to be 10min (600s); seen in `gcloud builds describe <id>`.


## References

- `gcloud topic gcloudignore`
- `gcloud builds submit --help`

