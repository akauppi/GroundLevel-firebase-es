# `firebase-dc-tools`

Docker image for using the `firebase-ci-builder`.

Provides:

- Node 16; npm >= 7.7
- `wait-for-it` CLI
- `firebase-prime` CLI

Gets automatically pulled and built, by `docker compose`.

>## Why is this here?
> 
> Even if it were used only by the `packages/app`, this is just a tool and doesn't change per the app contents.
> Therefore it feels right to have it outside of the `app` packaging; it's pullable like a Docker image or `npm`
> package, only local to the repo.
