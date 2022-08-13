# Wishes for Docker Compose

<!-- bygone? I don't understand this need any more (12-Aug-22)

## Ability to set `--abort-on-container-exit` in the YAML

It would be nice to provide a developer experience where `docker compose up` just launches the "right things".

To do this, and not give up robustness, I would need to be able to defined *in the YAML file* that the CLI option `--abort-on-container-exit` should be applied, if `docker compose up` is launched, without any parameters.
-->


## Docker Desktop for Mac vs. Windows (user handling on mapped volume writes)

>*This is slightly old. Not sure if the situation remains.*

With macOS, the experience is seamless.

One can share local files with `volumes:` and changes made to them within the container's code are seen as if a local user did it.

This is *not* the case with Windows 10 + WSL2.

There:

- writing to shared files fails, since the local user isn't the WSL2 host user. 
- if running as root (*? within the container, one presumes?*), writes need `sudo` on the host side

**Ideally..**

Behaviour of Docker Compose volume sharing would not be system specific (the macOS behaviour would be always there). This is the "least surprises" way.

**Quick fix:**

Add `user: '1000'` to the service description. This makes the containerized code run with the same UID as the WSL2 host user has.

This *does not* meddle with the macOS behavior.

How it works with Linux native Docker hasn't been tried, yet.

Problem with the quick fix is that it adds unnecessary "magic" to the `docker-compose.yml` file. We just "know" that 1000 is the WSL2 user id - and that it doesn't harm macOS. Fragile.

>In practise, the author didn't resort to this. Instead, Docker images run as `root`, not having users within them.

*Applies to Docker v. 20.10.7 on both the platforms.*

- [ ] Find an issue to **TRACK** / is this reported somewhere? 


## Explicit mounting of a file 🌹

Mounting of files in DC `volumes` is possible, but demands the file system entry to exist, as a file, before the `docker compose` call.

This is the same for both normal (`volume`) mounts and `bind` mounts<sup>DC 2.6.1; Docker Desktop for Mac 4.10.1</sup>. The difference is:

- `volume` mounts quietly create a folder, unless a file exists host-side
- `bind` mounts print out an error and fail:

   ```
   invalid mount config for type "bind": bind source path does not exist: ...
   ```

This causes us to have these preventive measures in `package.json` - or `Makefile`:

```
    "postinstall": "npm run -s _touchEm",
    "_touchEm": "touch firebase-debug.log firestore-debug.log ui-debug.log",
```

These are output files, normally created by Firebase Emulator. Now we must make sure they exist, so they won't be mapped as folders, instead.

**Suggestion**

Add a `:f` as a postfix, concatenable with others (in our case, we'd use `:delegated,f`).<sup>[1]</sup>

<small>`[1]`: DC already allows concatenating postfixes by `,`.</small>

**Reference**

- ["How to mount a single file in a volume"](https://stackoverflow.com/questions/42248198/how-to-mount-a-single-file-in-a-volume) (SO; Feb 2017)


## Automatically rebuild if the definition cascade has changed

Docker Compose declarations allow referring to other declarations by:

- `extends: file: [service:]`   between Docker Compose definitions
- `build: context: [target:]`   uses a Dockerfile

**Problem**

If one uses the above linkages, then starts a task with `docker compose run`, further changes to the declarations are not taken into effect.

One needs to manually `docker compose build` the topmost service the `run` uses.

This causes confusion for the developer.

**Example**

I wanted to update the version of Vite defined in `packages/app/tools/vite.dc/Dockerfile`.

Editing it, and restarting the DC `run` left some earlier version in effect. Luckily, this is obvious in the particular tool's console output.

Dependency tree:

```
npm run dev
  --> uses `docker-compose.local.yml` with:
      extends:
        file: dc.base.yml
        service: vite-base
     --> `dc.base.yml`:
        build:
          context: tools/vite.dc
          target: vite_plain
         -->
            ARG VITE_VER=3.0.2    # the line that changes
```

**Suggested solution**

When doing `docker compose up` or `docker compose run`, Docker should consider *direct* extension chain, all the way to Dockerfiles. If it *knows* that something in the definitions has changed, it would:

- automatically rebuild what's needed
- or: warn that something has needed, and suggest using a flag to rebuild

>Note: This suggestion should be simple to implement (and cause no breaking changes) since no *interim* (and maybe running) image definitions are involved. Just the target the user explicitly states. 

- [ ] *Shorten this to an issue. File such.* `#contribute`
