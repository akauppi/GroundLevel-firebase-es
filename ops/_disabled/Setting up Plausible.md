# Setting up Plausible

Plausible is easy to set up.

- [https://plausible.io](https://plausible.io) > `Start free trial`
   - fill in the form > `Start my free trial` <sub>[detailed instructions](https://plausible.io/docs/register-account)</sub>
   - Add the domain of the URL you'd like to keep an eye on

## Using Plausible in production

Add every stage (URL) you want to track separately to Plausible.

Add this to the `.env.{stage}` file (create such file if necessary):

```
VITE_PLAUSIBLE_ENABLED=true
```

That's it. Unlike Firebase and Sentry, Plausible does not use any API key to confirm the validity of information it receives.

### Test it

- With the above `.env.{stage}` contents, deploy the front-end (using CI, see `/ci/`).
- Open Plausible dashboard and confirm that a visit is counted.


## Using Plausible in development

For `dev:online`, you can enable Plausible by adding a fake domain, e.g. `dev-online.{hash}`. The name of the site does not matter, as long as it's unique and not already used by some other Plausible user.

- Create the "site" in Plausible
- Add into `.env.dev_online` e.g.:

   ```
   VITE_PLAUSIBLE_DEV_DOMAIN=dev-online.04c7ab18
   ```

	<sub>The author used `md5 $(which md5)` to come up with that hash. ;)</sub>

The domain is just a tie-in between the Plausible client and its online service, to collect information - and present it - in the right place.

Why would you use Plausible in development?

To test Plausible integration itself, e.g. if you have added a new Goal.

Other than that, there's not much purpose of tracking your own, local page views.

>For `dev:local`, Plausible is not used. It makes no sense when everything's local.

---

⩓ [Ops](README.md)
