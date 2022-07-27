# Working with GCP Secrets

<!-- tbd. Not sure if this is needed here?  
Should be covered in main text.
-->

*Based on: [Using secrets from Secret Manager](https://cloud.google.com/build/docs/securing-builds/use-secrets) (Cloud Build docs)*

The Sentry API KEY we use as an example is not quite a secret, since we need to embed it in the client web app. However, it allows us to show how Cloud Build treats secrets.


## Requirements

The *project number* of the GCP project running the Cloud Build.

- GCP Console > (deployment project) > Home

   ![](.images/project-info.png)
   


## Secrets Manager

1. GCP Console > (deployment project) > `Security` > `Secret Manager`

	- `Enable` > `Create Secret`:

   >![](.images/secret-create.png)

2. `Permissions` (tab) > `+ Add` > `<project-number>@cloudbuild.gserviceaccount.com`:

   >![](.images/secret-add-member.png)

	- `Roles` > `Secret Manager` > `Secret Manager Secret Accessor`


## Using the secret

In the `cloudbuild.app.merged.yaml`:

```
availableSecrets:
  secretManager:
    - versionName: projects/$PROJECT_ID/secrets/SENTRY_DSN/versions/latest
      env: 'SENTRY_DSN'
```
