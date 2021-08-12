# Wishes for Docker Compose

## Ability to set `--abort-on-container-exit` in the YAML

It would be nice to provide a developer experience where `docker compose up` just launches the "right things".

To do this, and not give up robustness, I would need to be able to defined *in the YAML file* that the CLI option `--abort-on-container-exit` should be applied, if `docker compose up` is launched, without any parameters.


## Unnecessary (and wrong) env.var warnings?

```
$ docker compose up
WARN[0000] The PROJECT_ID variable is not set. Defaulting to a blank string. 
WARN[0000] The PROJECT_ID variable is not set. Defaulting to a blank string. 
WARN[0000] The PROJECT_ID variable is not set. Defaulting to a blank string. 
...
```

This happens when `docker-compose.yml` has lines like this; no other kinds of reference to `PROJECT_ID`:

```
    command: bash -o pipefail -c
      'firebase emulators:start --project=${PROJECT_ID:-demo-abc}
        | grep -v -E "Detected demo project ID|You are not currently authenticated|You are not signed in"'
```

1. The default is `demo-abc`, not blank string. The warnings seems to be wrong?
2. The [documentation](https://docs.docker.com/compose/compose-file/compose-file-v3/#variable-substitution) states:

   >`${VARIABLE:-default}` evaluates to default if VARIABLE is unset or empty in the environment.
   
   The author expects no warning in the case that the default value is taken. The warning is noisy.
   
Docker v.20.10.7 (Docker Desktop for Mac)


## Docker Desktop for Mac vs. Windows differ in volume user handling

With macOS, the experience is seamless.

One can share local files with `volumes:` and changes made to them within the container's code are seen as if a local user did it.

This is *not* the case with Windows+WSL2.

Here:

- writing to shared files fails, since the local user isn't the WSL2 host user. 
- if running as root, writes need `sudo` on the host side

**Ideally..**

Behaviour of Docker Compose volume sharing would not be system specific (the macOS behaviour would be always there). This is the "least surprises" way.

**Quick fix:**

Add `user: '1000'` to the service description. This makes the containerized code run with the same UID as the WSL2 host user has.

This *does not* meddle with the macOS behavior.

How it works with Linux native Docker hasn't been tried, yet.

Problem with the quick fix is that it adds unnecessary "magic" to the `docker-compose.yml` file. We just "know" that 1000 is the WSL2 user id - and that it doesn't harm macOS. Fragile.

- [ ] Find an issue to **TRACK** / is this reported somewhere? 

*Applies to Docker v. 20.10.7 on both the platforms.*



