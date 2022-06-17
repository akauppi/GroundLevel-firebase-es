# Developer notes

## Clean up disk space from Cypress

Cypress cache gathers easily some weight.

```
$ du -d 1 -h ~/Library/Caches/Cypress/
783M	/Users/x/Library/Caches/Cypress//7.1.0
750M	/Users/x/Library/Caches/Cypress//7.5.0
777M	/Users/x/Library/Caches/Cypress//7.2.0
  0B	/Users/x/Library/Caches/Cypress//cy
761M	/Users/x/Library/Caches/Cypress//7.6.0
3,0G	/Users/x/Library/Caches/Cypress/
```

>That's the macOS directory. For Windows and Linux, see [here](https://docs.cypress.io/guides/getting-started/installing-cypress#Binary-cache) (Cypress docs).

When new versions come available, they pile up here.

To reclaim disk space, just remove the unneeded folders.

>Note: Moving to trash bin does not clear the space. `rm -rf` does.

You can also use:

```
$ npx cypress cache prune

Deleted all binary caches except for the 7.6.0 binary cache.
```

<!-- disabled
**More depth:**

- [Cleaning Up Space on Development Machine](https://glebbahmutov.com/blog/cleaning-up-space/#cleaning-old-cypress-binaries) (blog, Apr 2020)
-->

## Building the Docker image, after it's changed

`docker compose` doesn't track changes to the Dockerfile defined with `build:`, by purpose.

To reflect changes, use:

```
$ docker compose build
```

>If you change a service’s Dockerfile or the contents of its build directory, run `docker-compose build` to rebuild it. <sub>source: [Docker Compose CLI reference](https://docs.docker.com/compose/reference/build/)</sub>


## Env.vars with Docker Compose

There are two levels to tweak Docker Compose runs, by using environment variables.

### 1. From the OS level

```
$ PORT=123 docker compose ...
```

Now `${PORT}` is replaced by `123`. This is handy.

**Note:** These substitutions are rendered for the whole of the DC file(s) you use, *not* restricted to the service you launch. This may cause errors about not having declared them.

>WARN[0000] The "PORT" variable is not set. Defaulting to a blank string. 

To counter these, consider splitting the DC file, or providing defaults: `${PORT:-}`.


### 2. `environment` section within the DC file

```
    environment:
      - SENTRY_DSN
      - MODE=abc
```

These values are NOT used in the browsing of the DC file. Instead, they affect the *execution* of commands once within the DC.

This means, to use the values one needs to escape the dollars: 

```
      npm run dc:launch:$$MODE
```

>Note: Applying `-e` in the DC command line is the same as listing the values here.


# Updates to `tools/*.dc/**`

E.g. updating the Vite version in `tools/vite.dc/Dockerfile` is not immediately in effect.

```
$ npm run dev
...

  vite v2.9.9 dev server running at:

  > Local:    http://localhost:3001/
  > Network:  http://192.168.32.3:3001/
```

This was when the `Dockerfile` had already been pumped to `3.0.0-alpha.2`.

>There are instructions for `docker compose -f ... build` and `--build up <service>` that should do the trick. The author didn't get these to successfully work (DD 4.8.2).

What works is removing the underlying Docker images.

```
$ docker images "app_*"
REPOSITORY          TAG       IMAGE ID       CREATED          SIZE
app_vite-dev        latest    9435cbb37de3   11 minutes ago   145MB
app_build           latest    05558b651323   7 days ago       145MB
app_prime           latest    03dcaf20ddab   8 days ago       268MB
app_vite-for-test   latest    18a33f4f4613   8 days ago       145MB
app_emul-primed     latest    7688969941ed   2 months ago     171MB
```

```
$ docker image rm app_vite-dev
```

>Hint: `npm run _flush` might be there.
