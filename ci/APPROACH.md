# Approach


## Separating CI from normal development chain

One of the main learnings from setting up this CI was to *keep it apart* from development toolchain.

Why?

When a project's complexity rises above certain level, maintaining such merged toolchains (say, dev and CI that derives from it) becomes burdensome. Making changes to dev breaks CI - and vice versa.

So. The solution is that:

- most CI stuff is in this `/ci` folder
- some stuff is in the project folders:
   - `/packages/app/docker-compose{...}.ci.yml`
   - `/packages/app/package.json`
   - `/packages/backend/docker-compose{...}.ci.yml`
   - `/packages/backend/package.json`
   - `/packages/backend/firebase.ci.js`

This works well. When working on the CI side, one can make changes without being concerned about breaking the development experience.

This means that *we do not test developer experience and tooling in CI*, just that the *code itself* builds and works. The author believes this is good. For healthy deliveries, some developer tooling being broken does not matter. Also, developers will likely find it out sooner or later - the point of CI is to find out stuff that broke that no-one would have noticed.


## Ideally, ... never merge broken stuff

<!-- tbd. review once GitHub Actions are in -->

It would be nice to be able to *disallow merges to `master`* if they didn't pass tests.

This cannot be done using the [GitHub Google Cloud Build app](https://github.com/marketplace/google-cloud-build), since it only gets informed about merges after they've already happened.

---

>**tbd.** Based on [#102](https://github.com/akauppi/GroundLevel-firebase-es/issues/102), we'd mark successful test runs (their git SHA's) in a persistent store. Such information could be used by GitHub's own CI, to check, whether route is clear for merging or not. Maybe it can completely disallow a merge from happening.

---
