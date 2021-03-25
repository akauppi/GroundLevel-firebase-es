# Wishes for Cloud Build

## `<<: &npmStep` - YAML anchors et.al.?

The YAML anchors and references don't seem to be supported by `gcloud beta builds submit`.

They would be useful in keeping build definitions DRY:


```
# - when push or PR targeting 'master'
#   - if changes in 'packages/backend' (other than '.md' or '.images'):
#     - cd packages/backend
#     - npm install
#     - npm test
#     - npm run deploy

_:
  <<: &npmStep
    name: eu.gcr.io/groundlevel-160221/firebase-custom-builder
    entrypoint: npm

steps:
  - <<: *npmStep
    args: ['install']
    dir: packages/backend
  - <<: *npmStep
    args: ['test']
    dir: packages/backend
  - <<: *npmStep
    args: ['run deployyyy']
    dir: packages/backend
```

Instead of repeating the long, custom image name, we could define a step from it.

Tried:

```
ERROR: (gcloud.beta.builds.submit) interpreting cloudbuild.yaml as build config: ._: unused
```

Tried other ways as well. To me, it seems the YAML parser is not capable of expanding the `&npmStep` (anchor) and `*npmStep` (reference). Maybe it is a matter of just configuring it, so it can? 

Beta v. 2021.03.19