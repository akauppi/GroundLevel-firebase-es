# CI setup

All command line commands are expected to be run in the `ci` folder.

## Aim 🎯

For a PR to `master`:

1. test `backend`
2. test `app`

For changes to `master`:

1. If files in `backend` changed:
  - deploy `backend`
2. If files in `app` or `app-deploy-ops` changed:
  - build `app`
  - build `app-deploy-ops`
  - deploy `app-deploy-ops`

>Note: With Cloud Build, one cannot check or limit direct pushes to `master`. It's a convention that PRs should be used.

<!-- author's note:

We'd like to:
- restrict merges to `master` altogether (#help: how is that possible?)
- have two people approve PRs
-->

## Requirements

- `gcloud`

   Follow [Installing Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
	
	>Note: At least earlier, on macOS, it was best to run the `./google-cloud-sdk/install.sh` in the folder that would remain the install target. 
	>
	>The author has `gcloud` under `~/bin/google-cloud-sdk`.

   ```
   $ gcloud --version
	Google Cloud SDK 343.0.0
	...
   ```

   Update by: `gcloud components update`

- Docker

   Needed for building the builder image.


### Log in to the GCP project

To use `gcloud builds submit`, for example, you need to be logged in to the CI project (see "our model", below). Note that this *does not* need to be the same GCP project as used for the application's deployment.

Thus, deployment keys (access eg. to the data) can be kept at a smaller group of people.

```
$ gcloud auth login
```

```
$ gcloud config get-value project
Your active configuration is: [...]
groundlevel-160221
```

This should be the project id you use for the CI (running tests, storing Docker images).


## Our model

There are numerous ways one can set up CI/CD pipelines.

The approach we are taken here is:

- Use [Google Cloud Build GitHub Application](https://github.com/marketplace/google-cloud-build) to keep code in GitHub; run CI/CD workloads in Cloud Build

   >Reasons:
   >
   >- Cloud Build uses Docker images as build steps; the author likes this abstraction.
   >- Cloud Build has generous (120 build min/day) free tier

- Within Cloud Build, we split the CI/CD workloads between two projects (this is optional):

   - CI: runs tests, does not need deployment rights
   - CD: the project itself, does deployment

The split allows you to gather "just test" steps in one project, separate from the operational details. Then you can have "just deploy" projects for eg. staging and production (or only one).

See [APPROACH.md](APPROACH.md) for more details.


## See what is going out

```
$ gcloud meta list-files-for-upload ..
```

This set of files is controlled by `.gcloudignore` in the project root.


## Build the Builder

The `firebase-ci-builder:<tag>` builder used in `cloudbuild.*.yaml` files needs to be published to this GCP project's Container Registry.

```
# in ../firebase-ci-builder.sub
$ make build
$ make push
```

Now Cloud Build can use it.

## GitHub Marketplace: set up Cloud Build integration

You need this, in order to create Cloud Build triggers on GitHub PRs:

- Visit [GitHub Marketplace](https://github.com/marketplace)
- Enable the "Google Cloud Build" application
- Add your GitHub repo to the Cloud Build app

>Note: The UI uses the term "purchase", but installing this application should be completely free. The costs - if any - are based on your agreements with GitHub and Cloud Build.


## Cloud Build setup

You can either:

- use one GCP project for both deployment and CI tests
- use two GCP projects: one for CI tests, another one (or multiple) for deployments

The difference is marked in the table below, showing the details of setting up Cloud Build tasks. Execute the setup for each of these GCP projects.


### Enable `Cloud Build API` 

- [GCP Console](https://console.cloud.google.com/home/dashboard) > `≡` > `APIs & Services`
- `+ Enable APIs and Services`

   ![](.images/enable-apis-and-services.png)

- `Cloud Build` > `Enable`

*Without this, you run into problems. Google's instructions did not mention this step, for some reason. (May 2021)*


### Grant Firebase IAM roles to the Cloud Build service account

This is needed for the GCP projects handling deployment (not for the one simply running tests).

- Google Cloud console > `Cloud Build` > `Settings`
- Change `Firebase Admin` to `Enabled`

>![](.images/firebase-admin-enabled.png)

<font color=orange>There was one more role needed, not covered in the normal documentation. Deploying Cloud Functions needs this.

Get the number from the "Service account email" (above screenshot).

Use the Firebase project id.

>*Note: For using the `gcloud` command, you need to log in from your terminal. Rather, try enabling the `Service Account User` in the screenshot and `#help` make these instructions clearer. The idea is that you would not need to tie your local terminal to Google Cloud, at any stage (see APPROACH files).*

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
</font>

### Add "API Keys Admin" role to the Cloud Build service account

>*Note: [Deploying to Firebase](https://cloud.google.com/build/docs/deploying-builds/deploy-firebase) mentions this but the community Firebase builder `README` doesn't. Things might work without it, too?*

- Google Cloud console > `IAM & Admin`
- Spot `@cloudbuild.gserviceaccount.com` account on the list > <font size="+1.5">`✎`</font> (edit)
- Add the `API Keys Admin` role:

>![](.images/add-api-keys-admin.png)


## Create the triggers

Finally, we can create the triggers we want to run in CI.

GCP Console > (project) > `Cloud Build` > `Triggers` > `+ Create Trigger`

>Note: These settings are *not* in the version control. The workflow relies on you to have set them up, appropriately. The suggested initial settings are below, to get you started.

### Run tests

For the GCP project responsible of running tests.

||**`master-pr-backend`**|
|---|---|
|Description|PR targets "master" with changes on the backend|
|Event|(●) Pull Request (GitHub App only)|
|**Source**|
|Base branch|`^master$`|
|Comment control|(●) Required except for owners and collaborators|
|Included files filter (glob)|`packages/backend/**`, `package.json`, `tools/**`|
|Ignored files filter (glob)|`*.md`, `.images/*`|
|**Configuration**|
|Type|(●) Cloud Build configuration file (yaml or json)|
|Location|(●) Repository: `ci/cloudbuild.master-pr.backend.yaml`|

>Hint: It makes sense to keep the name of the CI entry and the respective `yaml` file the same.

Below is a screenshot of the actual dialog (UI things may change):

>![](.images/edit-trigger.png)

||**`master-pr-app`**|
|---|---|
|Description|PR that affects `packages/app`|
|Event|(●) Pull Request (GitHub App only)|
|**Source**|
|Base branch|`^master$`|
|Comment control|(●) Required except for owners and collaborators|
|Included files filter (glob)|`packages/app/**`, `package.json`, `tools/**`|
|Ignored files filter (glob)|`*.md`, `.images/*`|
|**Configuration**|
|Type|(●) Cloud Build configuration file (yaml or json)|
|Location|(●) Repository: `ci/cloudbuild.master-pr.app.yaml`|

These two CI steps should allow seeing the 🟢🟠🔴 status of pull requests, targeting `master`.

**Test it!**

Make a Pull Request in GitHub

You should see these:

<font color=red>...tbd...</font>


### Deploy

For each GCP (also Firebase) project responsible of deployments.

||**`master-merged`**|
|---|---|
|Description|Merge to `master`|
|Event|(●) Push to a branch|
|**Source**|
|Base branch|`^master$`|
|Included files filter (glob)|*empty*|
|Ignored files filter (glob)|`*.md`, `.images/*`|
|**Configuration**|
|Type|(●) Cloud Build configuration file (yaml or json)|
|Location|(●) Repository: `ci/cloudbuild.merged.yaml`|

The same CI step takes care of deploying both backend and app. 

>*tbd. We might revisit this later, but it's important that if both change, backend is updated first.*


## Run CI jobs manually

>You are supposed to be able to use `cloud-build-local` to package files, and run locally like Cloud Build, but it does not seem to work.
>
>```
>$ cloud-build-local  --config=cloudbuild.merged.yaml ..
>```

```
$ gcloud builds submit --config=cloudbuild.master-pr.app.yaml ..
```

This command packs the source files, runs the CI in the cloud. It saves you from `git commit` and awkward PRs just for testing.


## More details..

See [APPROACH.md](APPROACH.md) for details on why certain decisions were taken.


## References

- [Cloud Build](https://cloud.google.com/build/) (GCP)
- [Creating GitHub App triggers](https://cloud.google.com/build/docs/automating-builds/create-github-app-triggers) (Cloud Build docs)
- [Deploying to Firebase](https://cloud.google.com/build/docs/deploying-builds/deploy-firebase) (Cloud Build docs)
- [Building and debugging locally](https://cloud.google.com/build/docs/build-debug-locally) (Cloud Build docs)
- `gcloud builds submit --help`

