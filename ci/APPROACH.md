# Approach

## Deployment automation

Ideally, we'd like to:

- if `packages/backend/**` (or root `package.json` or `tools`) has changed, redeploy the backend
- if `packages/app/**` or `packages/app-deploy-ops/**` has changed, build and deploy the front-end
- deploy the front-end *only after a related backend is deployed* (if both changed in the same merge)
- avoid unnecessary deployments (if nothing changed)

Cloud Build (Jun 2021) doesn't seem to be up to this.

The problem is, we cannot know *within* the Cloud Build run, which files caused the change. If we did, this can be described as a single script, with optional steps (eg. deploy backend only if it changed; test and deploy front-end only if it did).


Alternatives considered:

### A. All-in-one YAML

**Con**: Both the backend and the front-end would end up being deployed, each time.

>Might select this, because it is simple. It's a start!


### B. Separate YAMLs (in parallel)

The deployments (if a merge affects both back-end and front-end) would happen unrelated, in parallel.

**Pro**: Avoids unnecessary deployments.

**Con**: A front-end can get deployed *before* its supporting back-end is available. If there are problems with the back-end deployment, this can lead to more than momentary problems.


### C. Separate YAMLs (serialized)

Cloud Build does not support this, but let's imagine we set up a PubSub trail to make it happen.

1. Changes in either backend or front-end
2. Backend would get tested, and deployed
3. Sends a message to PubSub, asking to deploy the (latest) front-end
4. Front-end gets tested and deployed

**Cons**: 

- Leads to unnecessary deployments of the backend (since it's done, even if the changes were in the front-end code)
- Leads to unnecessary deployments of the front-end (since it's done, even if the changes were in the back-end code)

Doesn't look enticing.


## CI 💔 Docker Compose

The idea was that `packages/{backend|app}` describe their Firebase Emulator setup as a Docker Compose (DC) config. That config can then be used for both development and CI runs.

For a while, the author had also the test execution in the DC file, because it was easy to get going. But this essentially outsources what the Cloud Build YAML should do, to a large DC YAML, in the development directory. Did not feel right.

So..

It seems that some people have managed to use `docker-compose up -d` to run servers, and use them from later Cloud Build steps.

Let's go for that!

Did not work.

The current pseudo-solution is to wrap the test steps in Docker. Whatever it takes to keep the definition within CI YAML, and not bleed it to the development folder, too much (having a `ci:test` target is fine).

This feels half baked - there needs to be a way to use the `cloudbuild` network, as stated in the docs.

`#help` me.