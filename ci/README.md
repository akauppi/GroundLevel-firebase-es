# CI setup

All command line commands are expected to be run in the `ci` folder.

## Aim 🎯

### For a PR targeting `master`

|Files changed in...|then...|
|---|---|
|`backend` (or root `package.json`, or `tools`)|test `backend`|
|`app`(or root `package.json`, or `tools`)|test `app`|

>Note: testing front-end requires Cypress, which is currently not easily packaged for Cloud Build use.

<!-- Author's note:
Cypress 8.0.0 with `headless` looks like a step forward. Let's see.
-->

### For changes already merged to `master`

|Files changed in...|then...|
|---|---|
|`backend` (or root `package.json`, or `tools`)|test and deploy `backend`|
|`app` or `app-deploy-ops` (or root `package.json`, or `tools`)|test and build `app`<br />build and deploy `app-deploy-ops`|

With Cloud Build integrated with GitHub, one **cannot** restrict merges to `master` - only be informed after the fact. We can live with this, but needs some discipline.

<!-- author's note:

We'd like to:
- restrict merges to `master` altogether (#help: how is that possible?)
- have two people approve PRs
  - [ ] check what options GitHub itself provides
-->

### Suggested GCP projects layout

The model recommended by the author is such:

```
         xxxxxx                     ┌─────────────────────┐      ┌────────────────────────┐
    x   x     xxxx         deploy   │                     │      │                        │
  xxxxxxx         xxxxxx  ┌─────────┤   Application       │      │   CI/CD project        │
 xx    xx         x     x │         │   projects          │      │                        │   PR changed    GitHub repos
x       x                xxx        │                     ├───┬──┤   - builder images     ◄────────────────
xx                         x        │   - deploy CI task  │   │  │   - PR CI tasks        │
 xx                     xxx         │                     │   │  │     "does it pass?"    ├───────────────►
  xxxxxxxxxxxxxxxxxxxxxxx           │                     │   │  │                        │   pass/fail
                                    └─────────────────────┘   │  └────────────────────────┘
                                    ┌─────────────────────┐   │
                                    │                     │   │              merged
                                    │   ...               │   │   ◄────────────────────────────────────────
                                    │                     ├───┤  
                                    └─────────────────────┘   │
                                    ┌─────────────────────┐   │
                                    │                     │   │
                                    │   ...               │   │
                                    │                     ├───┘
                                    └─────────────────────┘
```
<!-- drawing with Asciiflow -->

There is a single, CI/CD centric GCP project (e.g. `ci-builder`). It...

- runs any "does this pass the tests?" CI tests (that don't need access rights to deploy)
- holds the custom Docker images used in the organization 
  - grants the other projects access to its Container Registry

In addition, each GCP project (responsible for a certain product's certain tier, e.g. `abc-staging`) has a CI/CD aspect:

- runs deployments, if a certain branch changes.

This organization seems light enough, yet flexible, to recommend. In the following text we expect you have it in place.

>One benefit of the above model is that *deployment keys* don't need to be shared. Each project is in charge of deploying itself.


## Requirements

- `gcloud`

   <details><summary>Installation on macOS</summary>
   Follow [Installing Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
	
	After unpacking, move the folder to a permament location (author uses `~/bin/google-cloud-sdk`). The installation is on that directory only, and uninstalling means removing the directory.

   ```
   $ gcloud --version
	Google Cloud SDK 343.0.0
	...
   ```

   Update by: `gcloud components update`
	</details>

   <details><summary>Installation on Windows 10 + WSL2 `#contribute`</summary>
   tbd..
   </details>

- Docker

   Needed for building the builders.


### Create a "CI Builder" GCP project

Create a GCP project for the CI builder role, and make it the active project for `gcloud`. 

<!-- tbd. more details
- enabling Container Registry etc. (a link to the Wiki?)
-->

```
$ gcloud auth login
```

```
$ gcloud projects list
```

Pick the right one, then:

```
$ gcloud config set project <your-ci-builder-project>
```

>Query the current active project by:
>
>```
>$ gcloud config get-value project
>```

### Deployment GCP project(s)

These are already created, by Firebase.

When you create a Firebase project, a GCP project of the same name gets created as well. We use those projects for automating deployments, using Cloug Build.


### Push the builder images

The CI scripts require `ci-builder` Container Registry to have the following builder images:

- `firebase-emulators:9.16.0-node16-npm7`
- <font color=lightgray>`firebase-emulators-cypress:9.12.1-7.5.0-node14-npm7` (not ready yet)</font>

<details><summary>Instruction for building and pushing them..</summary>

1. Log into your "CI builder" GCloud project (see steps above).
2. Build and push the images

   ```
   $ pushd ../firebase-ci-builder.sub
   $ ./build
   $ ./push-to-gcr
   ...
   $ popd
   ```

   ```
   $ pushd firebase-ci-builder-cypress.sub   # TENTATIVE
   $ ./build
   $ ./push-to-gcr
   ...
   $ popd
   ```
</details>

<!-- tbd. update once/if we have a Cypress Alpine image 🏞
-->

Now we have the necessary Docker images in the Container Registry of the `ci-builder` GCP project. 

Next, let's introduce GitHub and Cloud Build to each other.


### Update the reference to `ci-builder` GCP project

The `cloudbuild.merged.{app|backend}.yaml` scripts have these lines at the end:

```
substitutions:
  _BUILDER_IMAGE: gcr.io/ci-builder/firebase-ci-builder:9.16.0-node16-npm7
```

This tells the deployment project, where it can fetch its builder images. My `ci-builder` project doesn't provide public pull access, so replace `/ci-builder/` with the GCP project where you just pushed the builder images.


## Cloud Build setup

### Enable APIs

- [GCP Console](https://console.cloud.google.com/home/dashboard) > `≡` > `APIs & Services`
- `+ Enable APIs and Services`

   ![](.images/enable-apis-and-services.png)

- `Cloud Build` > `Enable`

*Without this, you run into problems. Google's instructions did not mention this step, for some reason. (May 2021)*

Also check that the following are enabled:

  - Firebase Management API
  - Firebase Hosting API
  - Cloud Resource Manager API

<!-- from: https://cloud.google.com/build/docs/deploying-builds/deploy-firebase#before_you_begin
-->

### Steps for the deploying project

For the GCP project that handles deployment (the one matching a Firebase project's name), in addition to the above, do these steps:

<details><summary>Grant Firebase IAM roles to the Cloud Build service account</summary>

- Google Cloud console > `Cloud Build` > `Settings`
- Change `Firebase Admin` to `Enabled`

>![](.images/firebase-admin-enabled.png)

<!-- YEEAAH... 
There was one more role needed, not covered in the normal documentation. Deploying Cloud Functions needs this.

- Get the number from the "Service account email" (above screenshot).
- Using the Firebase project id:

   ```
   $ MEMBER=serviceAccount:337......369@cloudbuild.gserviceaccount.com
   $ PROJECT_ID=...
   $ gcloud iam service-accounts add-iam-policy-binding $PROJECT_ID@appspot.gserviceaccount.com --member=$MEMBER --role=roles/iam.serviceAccountUser
   Updated IAM policy for serviceAccount [...]
   ...
   ```

>tbd. If re-enabling this section, give the instructions using Cloud Shell (not needing to log into staging/production accounts ever, from one's development machine..) #help

```
$ gcloud auth logout
```

>Note: Would changing the `Service Account User` in the screenshot have done the same? Likely. (tbd. test) 

<!_-- whisper
Interestingly, the GUI does not change the state of `Service Account User` to `ENABLED` - maybe it contains more roles than the one we changed at the command line?
-->
</details>

<details><summary>Add "API Keys Admin" role to the Cloud Build service account</summary>

>*Note: [Deploying to Firebase](https://cloud.google.com/build/docs/deploying-builds/deploy-firebase) mentions this but the community Firebase builder `README` doesn't. Things might work without it, too?*

- Google Cloud console > `IAM & Admin`
- Spot `@cloudbuild.gserviceaccount.com` account on the list > <font size="+1.5">`✎`</font> (edit)
- Add the `API Keys Admin` role:

>![](.images/add-api-keys-admin.png)
</details>

<details><summary>Enable access to CI Builder Container Registry</summary>

1. You'll need the Cloud Build service account (and email adress) of the *deploying project*.

   - Google Cloud console > project *deploying* > Cloud Build > `Settings`
   - pick up the **Service account email:** `337...369@cloudbuild.gserviceaccount.com` value

From the [official guide](https://cloud.google.com/container-registry/docs/access-control#granting_users_and_other_projects_access_to_a_registry) (Container Registry docs):

> You control access to Container Registry hosts with Cloud Storage permissions.

We need to grant the `Storage Object Viewer` role to the needing service account.

&nbsp;2. 

   - (change to `ci-builder` project) > Cloud Storage > `artifacts.ci-builder.appspot.com`
   - `Permissions` > `+👤 Add` > *provide the service account*
      - Role: `Cloud Storage` > `Storage Object Viewer`

   >![](.images/cloud-storage-add-member.png)

Your deployment project Cloud Build runs should now be able to pull the builder images.
</details>


## Enable GitHub / Cloud Build integration

- GitHub Marketplace > Apps > [Google Cloud Build](https://github.com/marketplace/google-cloud-build) > `Enable`
- Add your GitHub repo to the Cloud Build app (covers all GCP projects where Cloud Build is enabled)

You need this, in order to create Cloud Build triggers on GitHub PRs.

>Note: The UI uses the term "purchase", but installing the application is completely free (Jun 2021). The costs - if any - are based on your agreements with GitHub and Cloud Build.


## Create the triggers

Finally, we can create the triggers we want to run in CI.

GCP Console > (project) > `Cloud Build` > `Triggers` > `+ Create Trigger`

>Note: These settings are *not* in the version control. The workflow relies on you to have set them up, appropriately. The suggested initial settings are below, to get you started.

### Run tests

For the GCP project responsible of running tests.

||`master-pr-backend`|
|---|---|
|Description|PR targets "master" with changes on the backend|
|Event|(●) Pull Request (GitHub App only)|
|**Source**|
|Repository|*pick (\*)*|
|Base branch|`^master$`|
|Comment control|(●) Required except for owners and collaborators|
|Included files filter (glob)|`packages/backend/**`, `package.json`, `tools/**`|
|Ignored files filter (glob)|`*.md`, `.images/*`|
|**Configuration**|
|Type|(●) Cloud Build configuration file (yaml or json)|
|Location|(●) Repository: `ci/cloudbuild.master-pr.backend.yaml`|

It makes sense to keep the name of the CI entry and the respective `yaml` file the same (but the name cannot have a `.`).

<p />

>![](.images/ci-connect.png)
>
>*(\*): The `Connect New Repository` uses a popup to connect GitHub Cloud Build Application and the Cloud Build project, to access a certain repo. THIS DOES NOT WORK ON SAFARI (unless popups are enabled). Follow setup below or use eg. Chrome for connecting a repo.*
>
><details><summary>Allow popups on Safari for `cloud.google.com`</summary>
>![](.images/safari-enable-popup.png)
><ul>
>  <li>`Preferences` > `Websites` > `Pop-up Windows` (lowest in left pane)</li>
>  <li>`cloud.google.com`: `Allow`</li>
></ul> 
></details>

Screenshot of the actual dialog (UI things may change):

>![](.images/edit-trigger.png)

||`master-pr-app`|
|---|---|
|Description|PR that affects `packages/app`|
|Event|(●) Pull Request (GitHub App only)|
|**Source**|
|Repository|*pick*|
|Base branch|`^master$`|
|Comment control|(●) Required except for owners and collaborators|
|Included files filter (glob)|`packages/app/**`|
|Ignored files filter (glob)|`*.md`, `.images/*`|
|**Configuration**|
|Type|(●) Cloud Build configuration file (yaml or json)|
|Location|(●) Repository: `ci/cloudbuild.master-pr.app.yaml`|

>Hint: The easiest way to do the secondary triggers is `⋮` > `Duplicate`.

<p />

>Note: We consciously have omitted changes to (only) `package.json` (in the root) and `tools/**` from running app tests. These *may* affect that such tests would break but it's relatively unlikely. **Tests do not need to be perfect**; it's enough that they are useful.

These two CI steps now allow seeing the 🟢🟠🔴 status of pull requests that target `master`.

**Test it!**

Make a Pull Request in GitHub.

You should see these (under `Checks`):

![](.images/github-pr-checks.png)


### Deploy

You may have 1..n deployment projects (eg. production and staging). Each such would listen to a different branch of the GitHub repo.

Create these triggers in the project that gets deployed, itself. This way, you don't need to spread deployment rights.

||**`merged-backend`**|
|---|---|
|Description|Merge to `master` (affects backend)|
|Event|(●) Push to a branch|
|**Source**|
|Base branch|`^master$`|
|Included files filter (glob)|`backend/**`, `*.*`, `tools/**`|
|Ignored files filter (glob)|`*.md`, `.images/*`|
|**Configuration**|
|Type|(●) Cloud Build configuration file (yaml or json)|
|Location|(●) Repository: `ci/cloudbuild.merged.backend.yaml`|

This takes care of deploying the backend.

For the front-end, create a similar trigger (you can use `duplicate` in the triggers list as a start):

||**`merged-app`**|
|---|---|
|Description|Merge to `master` (affects app)|
|Event|(●) Push to a branch|
|**Source**|
|Base branch|`^master$`|
|Included files filter (glob)|`app/**`, `app-deploy-ops/**`, `*.*`, `tools/**`|
|Ignored files filter (glob)|`*.md`, `.images/*`|
|**Configuration**|
|Type|(●) Cloud Build configuration file (yaml or json)|
|Location|(●) Repository: `ci/cloudbuild.merged.app.yaml`|

With these two jobs in place, your deployments will track the contents of the `master` branch.

To make multiple deployments, just dedicate a certain branch to the deployment, create a Firebase project for it and add these steps.

>**Note**: What if...
>
>my front-end and back-end deployments need to be aligned?
>
>The author is thinking of adding a version number to the back-end that the front-end deployment script can detect, and refuse to deploy if the version is not what is requested. If your front-end deployment fails for this reason, just manually restart it. *This is not implemented, yet.*


<!-- hidden; `cloud-build-local` doesn't get love
## Run CI jobs manually (`cloud-build-local`; doesn't work)

You are supposed to be able to use `cloud-build-local` to package files, and run locally like Cloud Build, but it does not seem to work.

```
$ cloud-build-local  --config=cloudbuild.master-pr.backend.yaml --dryrun=false ..
2021/06/06 20:01:31 Warning: The server docker version installed (20.10.6) is different from the one used in GCB (19.03.8)
2021/06/06 20:01:31 Warning: The client docker version installed (20.10.6) is different from the one used in GCB (19.03.8)
2021/06/06 20:02:34 Error copying source to docker volume: exit status 1
```

`cloud-build-local` seems to be pretty abandoned by Google, so the author looked further... 

>`#help`: Anyone know how to fix this?
-->

## Run CI jobs manually (`gcloud builds submit`)

The below commands pack your sources, send them to Cloud Build and let you see the build logs, in real time.

```
$ gcloud builds submit --config=cloudbuild.master-pr.{app|backend}.yaml ..
```

```
$ gcloud builds submit --config=cloudbuild.merged.yaml ..
```

When using these, make sure you are logged into the correct GCloud project.

The author finds the `gcloud builds` workflow great for developing one's CI scripts, since you don't need to commit the changes to version control! 🙂


### See what is going out

It makes sense to optimize the "tarball" going out. Not shipping unnecessary files speeds your debug cycles, and also saves storage space (Cloud Build keeps these around). 

```
$ gcloud meta list-files-for-upload ..
```

This set of files is controlled by `.gcloudignore` in the project root.


<!-- #later; not a big thing (see DEVS.md)
## Maintenance: clean up the tarballs

*tbd. Where are they; what do we need to do?*

`#contribute` by suggesting text, maybe?? ;M
-->

## References

- [Cloud Build](https://cloud.google.com/build/) (GCP)
- [Creating GitHub App triggers](https://cloud.google.com/build/docs/automating-builds/create-github-app-triggers) (Cloud Build docs)
- [Deploying to Firebase](https://cloud.google.com/build/docs/deploying-builds/deploy-firebase) (Cloud Build docs)
- [Building and debugging locally](https://cloud.google.com/build/docs/build-debug-locally) (Cloud Build docs)
- `gcloud builds submit --help`
