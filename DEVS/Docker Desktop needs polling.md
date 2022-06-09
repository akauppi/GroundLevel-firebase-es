# Track


## Docker Desktop for Mac - host side file changes not seen in the container

- [ ] Try removing `CHOKIDAR_USEPOLLING=true` at some point. `#later`
- [ ] If works, comment that (and suggest closing) issue 1802, below.

---

>This is more of a "documented" and "works as intended" issue. Chokidar needs `CHOKIDAR_USEPOLLING=true` under "non-standard" networking conditions which Docker Desktop file sharing seems to be.
>
>So: nothing to see, but listing the issues anyhow, 'cause they are interesting..
>
>Note: If polling becomes a problem, there are ways to work around it, but for now this is "closed".

---

This issue has been open since 2017/18, in different variations.

||status|comments|
|---|---|---|
|[File system change events broke after upgrade](https://github.com/docker/for-mac/issues/1802) (since Jun 2017)|open|Looks like the best issue to follow.|
|[Unable to get inotify events inside container using kubernetes](https://github.com/docker/for-mac/issues/2375) (Jan 2018)|closed|Ours is not K8s, but some of the descriptions in this issue match ours spot on.|
|[File-Event propagation stopping (worse in current stable/edge)](https://github.com/docker/for-mac/issues/2417) (Jan 2018)|closed|One more.|

<!-- disabled

### Our check (Alpine)

Make a folder (e.g. `Temp/def`).

```
$ cd Temp/def
$ docker run -it --rm -v $(pwd):/work -w /work node:16-alpine sh

# apk add inotify-tools

# inotifywait -rme modify,attrib,move,close_write,create,delete,delete_self /work
...
Watches established.
```

Create or change files in the folder - on the (Mac) host.

**Expected**

- Some output within Docker, reflecting on the changes

**Actual**

- (empty)


### Our check (Debian)

Just so it wouldn't be Alpine specific, let's see:

You can use the same folder (e.g. `Temp/def`).

```
$ cd Temp/def
$ docker run -it --rm -v $(pwd):/work -w /work debian:latest bash

# apt-get update
# apt-get install inotify-tools

# inotifywait -rme modify,attrib,move,close_write,create,delete,delete_self /work
...
Watches established.
```

**Behaviour**

Same as above (Alpine), so seems not Linux flavour specific.


### What works

- Docker Desktop on Windows doesn't seem to be affected
- not tested on native Linux; assuming things work

### What didn't work

- In `packages/backend`, changes to `functions/**` or `firestore.rules` require the emulators to be restarted.

   Normally, the emulators would print information on their output about changed files, and adjust accordingly.
   
- In `packages/app`, Hot Module Reloading is lost if Vite runs under Docker.

	This is 💔 since we really need HMR to work. Cannot use DC for Vite until this is solved, one way or another.
-->
