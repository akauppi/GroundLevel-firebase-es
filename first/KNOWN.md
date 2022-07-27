# Known issues

## Deploying backend: "An unexpected error"

```
Error: An unexpected error has occurred.
```

That happens after the functions have been deployed, so we can likely ignore it. Not very helpful, though..

Tried:

- Changing DC mounts from `:ro` to `:rw` does not affect it.


## Deploying: Unhandled error cleaning up build images

```
⚠  functions: Unhandled error cleaning up build images. This could result in a small monthly bill if not corrected. You can attempt to delete these images by redeploying or you can delete them manually at https://console.cloud.google.com/artifacts/docker/groundlevel-jun-22/us-central1/gcf-artifacts

Error: There was an error deploying functions
```

Expected:

- Things should just work

Actual:

- We get the above error.

Work-around:

- Artifact Registry API needs to be manually enabled

   Visit [https://console.cloud.google.com](https://console.cloud.google.com) > (select project) > `≡` > `Artifact Registry` > `ENABLE`
   

