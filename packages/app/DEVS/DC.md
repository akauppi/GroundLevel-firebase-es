# Developer notes (DC = Docker Compose)


## Building the Docker image, after it's changed

`docker compose` doesn't track changes to the Dockerfile defined with `build:`, by purpose.

We compensate for this in the `Makefile`, forcing rebuilds.


## Env.vars with Docker Compose

There are two levels to tweak Docker Compose runs, by using environment variables.

### 1. From the OS level

```
$ PORT=123 docker compose ...
```

Now `${PORT}` is replaced by `123`. This is handy.

**Note:** These substitutions are rendered for the whole of the DC file(s) you use, *not* restricted to the service you launch. This may cause errors about not having declared them.

>WARN[0000] The "PORT" variable is not set. Defaulting to a blank string. 

To counter these, consider splitting the DC file, providing defaults: `${PORT:-}` or defining dummies when using the Docker Compose YAML.


### 2. `environment` section within the DC file

```
service:
  xyz:
    environment:
    - MODE=abc
```

These values are NOT used in the browsing of the DC file. Instead, they affect the *execution* of commands once within the DC.

This means, to use the values one needs to escape the dollars: 

```
    command: echo $$MODE
```

>Note: Applying `-e` in the DC command line is the same as listing the values here.


## What are random `name:` fields for?

```
name: 2d3b9083
```

It's a trick, for supressing such warnings from Docker Compose:

```
WARN[0000] Found orphan containers ([app-emul-for-app-1]) for this project.
```

Giving a nonsense name to a Docker Compose definition puts those contents into their own "icebox", and stops nagging about other services. We do this for independent commands, run with `docker compose run`.

This seems the least noisy way to mitigate the warnings. Other ways would be:

- using `docker compose run --name 2d3b9083` in the Makefile
- launching with `COMPOSE_IGNORE_ORPHANS=true` environment variable

Both of those clutter the `Makefile` slightly; the author decided it's better to have this in the container definition.

