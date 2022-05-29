# 3. Sentry

[Sentry](https://sentry.io/welcome/) is a fun, high quality and affordable way to track how your app (and its users) are doing.

Let's let it present itself:

>![](.images/sentry-welcome.png)

We use Sentry for front-end monitoring only, but - as the description says - it can be used for backend tracking, as well.


## Creating a project

Name the project as you like[^1]. Collect events from multiple stages (`dev`, `dev:online`, `staging`, ...) under the same Sentry project - you can filter among them in the Sentry dashboard.

**Pick up a DSN**

A Data Source Name (DSN) is a unique identifier that the Sentry client uses to pass your monitoring information to the right project (so you can search and observe it in the dashboard).

It looks like a URL:

```
https://66b7...127@o39..58.ingest.sentry.io/52...04
```

Once you have the project, visit `Settings` > `Projects` > (project) > `Client Keys (DSN)` and pick up your DSN. <sub>[more details](https://docs.sentry.io/product/sentry-basics/dsn-explainer/)</sub>

The DSN might not be forever. You can generate more DSN's if needed, and circulate them. There may be more than one pointing to your Sentry project, at any one time.

But one is all we need to get started.

[^1]: The author prefers attaching a creation date to such id's, eg. `groundlevel-110522`.


## Using Sentry at production

The DSN is not *really* a secret, but it's not a good idea to save them in version controlled source code, either.

We'll treat it as a secret, and make the Cloud Build deployment script pick it up from Secrets Manager.

### Create the secret

- Go to [GCP console](https://console.cloud.google.com)
   -  Pick the right project
   - (search bar) > `Secrets Manager`
      - `+ CREATE SECRET`
      - Provide name `SENTRY_DSN` the value, leave all other fields as-is
      - `CREATE SECRET`

![](.images/gcp-secret-created.png)

<!-- #doc #bug
Correction: In the screenshot, the name is wrong. Should be `SENTRY_DSN`.
-->

You now have a "secret" created, but Cloud Build does not yet reach it. Let's change that.


### Provide access to the builder to the secret

1. Go to [GCP console](https://console.cloud.google.com)
2. Pick the right project
3. `≡` > `IAM & Admin`

   ![](.images/gcp-iam-secrets-manager.png)

4. Click `edit` (pencil icon) on the `...@cloudbuild.gserviceaccount.com` line.

   > `+ ADD ANOTHER ROLE`
   
   Start typing "secret" to the filter field and pick `Secret Manager Secret Accessor` role.

>For more information: [https://cloud.google.com/secret-manager/docs/configuring-secret-manager](https://cloud.google.com/secret-manager/docs/configuring-secret-manager)

That should be it!

If you have multiple Firebase projects (eg. `staging`, `prod`), repeat these steps for each of them.

### Check that Sentry gets used

Run the front-end -deploying CI script, either manually of from the GCP console.

```
$ ci {project-dir}/ci
$ gcloud builds submit --config=cloudbuild.app.merged.yaml ..
...
Step #4: Hosting URL: https://groundlevel-160221.web.app
Finished Step #4
```

>Details: Within `cloudbuild.app.merged.yaml`, there's a reference to the secret we created. The build script sees it as `SENTRY_DSN` env.var. and bakes into the browser's code as `import.meta.env.VITE_SENTRY_DSN` - which is used to initialize the Sentry client.

After deploying, open your app and development tools (browser console). You should see:

```
...   tbd. Sentry initialized 
```
<!-- tbd. Provide actual message -->

You can also check the Sentry dashboard for your Sentry project. Does it have a drop-down with your stage name on it?

...tbd. ... <!-- stage names - not done, yet!!! -->



## Using Sentry at development

You can use Sentry also when developing the app. Just define `SENTRY_DSN` with the right value to the launch commands:

```
$ SENTRY_DSN=... npm run dev
```

and/or:

```
$ SENTRY_DSN=... npm run dev:online
```

This may help you in optimizing performance, or you might want to see that changes to new Sentry instrumentation are being appropriately picked up.


## What we collect

<!-- tbd.

-->

---

<div class="wrapper" style="display: grid; grid-template-columns: 1fr 1fr;">
  <div>≪ <a href="README.2-perf.md">Performance monitoring</a></div>
  <div align=right><a href="README.4-some.md">Some</a> ≫</div>
</div>
