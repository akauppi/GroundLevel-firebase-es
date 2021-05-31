# CI setup

All local commands are expected to be run in the `ci` folder.

## Aim 🎯

For a PR:

1. test `backend`
2. test `app`

For merge to `master`:

1. test `backend` (paranoia)
2. test `app` (paranoia)
3. build and deploy `app-deploy-ops`

>Note: With Cloud Build, one cannot check or limit direct pushes to `master`. It's a convention that PRs should be used. This makes it important that also merges to `master` are tested, before a deployment.


## Requirements

- `gcloud`

   Follow [Installing Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
	
	>Note: At least earlier, on macOS, it was best to run the `./google-cloud-sdk/install.sh` in the folder that would remain the install target. 
	>
	>The author has `gcloud` under `~/bin/google-cloud-sdk`.

   ```
   $ gcloud --version
	Google Cloud SDK 341.0.0
	...
   ```

   Update by: `gcloud components update`

- Docker

   Needed for building the builder image.

## See what is going out

```
$ gcloud meta list-files-for-upload ..
```

This set of files is controlled by `.gcloudignore` in the project root.


## Build the Builder

The `firebase-ci-builder:<tag>` builder used in `cloudbuild.*.yaml` files needs to be published to this GCP project's Container Registry.

- clone [`firebase-ci-builder`](https://github.com/akauppi/firebase-ci-builder) and follow its instructions

   TL;DR GCP login; `make build; make push`


## Cloud setup

*We're using Cloud Build (instead of GitHub's own CI) "just because".*

### GitHub: Enable App triggers

You need this, in order to create Cloud Build triggers on GitHub PRs:

- In [GitHub Marketplace](https://github.com/marketplace), enable the "Google Cloud Build" application
- Add your GitHub repo to the Cloud Build app


### Enable `Cloud Build API` 

- [GCP Console](https://console.cloud.google.com/home/dashboard) > `≡` > `APIs & Services`
- `+ Enable APIs and Services`
- Search for: `Cloud Build`
- `Enable`

*Without this, you might get into problems, later. Instructions normally don't mention this step.*

<!-- Q: is this needed?
### Set your `gcloud` project

Using the same project name as with `firebase use`:

```
$ gcloud config set project testing-230321
Updated property [core/project].
```
-->


### Grant Firebase IAM roles to the Cloud Build service account

This is needed for the Cloud Build to be able to deploy to Firebase, using `firebase` CLI.

- Google Cloud console > `Cloud Build` > `Settings`
- Change `Firebase Admin` to `Enabled`

>![](.images/firebase-admin-enabled.png)

There was one more role needed, not covered in the normal documentation. Deploying Cloud Functions needs this.

Get the number from the "Service account email" (above screenshot).

Use the Firebase project id.

```
$ MEMBER=serviceAccount:337......369@cloudbuild.gserviceaccount.com
$ PROJECT_ID=...
$ gcloud iam service-accounts add-iam-policy-binding $PROJECT_ID@appspot.gserviceaccount.com --member=$MEMBER --role=roles/iam.serviceAccountUser
Updated IAM policy for serviceAccount [...]
...
```

With that, deploying a Cloud Function in Cloud Build succeeds. 😅

>Note: Would changing the `Service Account User` in the screenshot have done the same? Likely. 
>
>Interestingly, the GUI does not change the state of `Service Account User` to `ENABLED` - maybe it contains more roles than the one we changed at the command line?

### Add "API Keys Admin" role to the Cloud Build service account

>*Note: [Deploying to Firebase](https://cloud.google.com/build/docs/deploying-builds/deploy-firebase) mentions this but the community Firebase builder `README` doesn't. Things might work without it, too?*

- Google Cloud console > `IAM & Admin`
- Spot `@cloudbuild.gserviceaccount.com` account on the list > <font size="+1.5">`✎`</font> (edit)
- Add the `API Keys Admin` role:

>![](.images/add-api-keys-admin.png)


### Create the triggers!

GCP Console > (project) > `Cloud Build` > `Triggers` > `+ Create Trigger`

>![](.images/edit-trigger.png)

*Above is just a sample.*



## Run CI jobs 

```
$ gcloud builds submit --config=cloudbuild.pr.yaml ..
```

<!-- tbd. add `--substitutions=` once we have `master` and `staging` running...
-->

This command packs the source files, runs the CI in the cloud. It saves you from `git commit` and awkward PRs just for testing.


## From here...

The purpose of this page is to show how the CI has been set up. It's not for teaching the specifics.

When you make PRs, the CI should kick in and show the status within GitHub.

### Limitations

You cannot restrict pushes to `master` or `staging`, in this way. Cloud Build only gets to know about merges after the fact - it can not prevent them.


## References

- [Cloud Build](https://cloud.google.com/build/) (GCP)
- [Creating GitHub App triggers](https://cloud.google.com/build/docs/automating-builds/create-github-app-triggers) (Cloud Build docs)
- [Deploying to Firebase](https://cloud.google.com/build/docs/deploying-builds/deploy-firebase) (Cloud Build docs)
- [Building and debugging locally](https://cloud.google.com/build/docs/build-debug-locally) (Cloud Build docs)
- `gcloud builds submit --help`

