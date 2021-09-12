# Track


## CSS standard support for nesting

https://drafts.csswg.org/css-nesting/

Once implemented in browsers, we don't need the `lang="scss"` any more.

Note: The ideology of the repo is to work close to what plain browsers offer. Thus, no SASS once we can get nesting without it.


## Firebase Crashlytics -> Web

- [https://github.com/firebase/firebase-js-sdk/issues/710](https://github.com/firebase/firebase-js-sdk/issues/710)

>Then again, Firebase storage (database), back-end functions and auth together makes sense, since those all rely on auth. 
>
>The rest can be "picked" from various vendors: hosting, performance monitoring, A/B testing. The only benefit Firebase would provide is having the tools under one umbrella.
>
>[ ] Going to handle ops side, once the repo is otherwise done! 🐤

## WebStorm: exclude `node_modules` from searches - but keep them for symbol lookup

This is a small but annoying part of WebStorm.

Likely the author has managed to mess up its configuration?=

- [How to exclude node_modules and .meteor from all searches and code inspections](https://intellij-support.jetbrains.com/hc/en-us/community/posts/207696445-How-to-exclude-node-modules-and-meteor-from-all-searches-and-code-inspections)


## Firebase Performance Monitoring: "near real time" is coming "soon"...?

- [Near real time data processing and display](https://firebase.google.com/docs/perf-mon/troubleshooting?authuser=0&platform=web#faq-real-time-data) (Firebase docs)

>Although the listed SDK versions enable Performance Monitoring to process your collected data in near real time, the Firebase console does not yet display your data in near real time.

- [x] Did come
- [ ] gather experience


## ES Lint: Top-level-await support

Finally, ES Lint 8.0 will have it:

- [Add Support to Top-level await](https://github.com/eslint/eslint/issues/14632)

Remove this when we can upgrade all of these:

- [x] `8.0.0-beta.0` is available: [releases](https://github.com/eslint/eslint/releases)
   - [ ] [eslint-plugin-node](https://github.com/mysticatea/eslint-plugin-node/releases) is not using it, yet (Aug-21)
   - [x] `eslint-plugin-vue`
   - [ ] `eslint-plugin-cypress`


## Docker Desktop for Mac - file change events not seen in the container

This issue has been open since 2017/18, in different variations.

||status|comments|
|---|---|---|
|[File system change events broke after upgrade](https://github.com/docker/for-mac/issues/1802) (since Jun 2017)|open|Looks like the best issue to follow.|
|[Unable to get inotify events inside container using kubernetes](https://github.com/docker/for-mac/issues/2375) (Jan 2018)|closed|Ours is not K8s, but some of the descriptions in this issue match ours spot on.|

Highlighting [comment](https://github.com/docker/for-mac/issues/2375#issuecomment-653179768) from `azoff`:

>+1 would like to understand how to better debug filesystem events over the osxfs bridge.
>
>for a case I'm working with:
>
>fsevents API appears to work on the host MacOS installation (i.e. tested via fswatch)
>inotify API appears to work on the containerized Ubuntu installation (i.e. tested via inotifytools)
>osxfs does not appear to bridge the fsevent over to inotify upon file change (i.e. tested using touch on MacOS)
>To workaround this, I wrote a script that binds to fsevents on the host machine, and delegates changes manually using docker exec [container_id] touch [file_path] in the target container. Not my favorite solution, but it beats having to restart docker or the host machine itself.
>
>As I understand it, this is still considered the only known workaround to the issue in question here.

<!-- 
|[File-system event CLOSE_WRITE not propagating from host to container](https://github.com/docker/for-mac/issues/896)|open|Related, but not really our itch (we don't get *any* notifications)... In fact, this should be closed(?) since the `CLOSE_WRITE` seem to be arriving, when things are dandy.|
-->

Factory Reset helped **ONLY FOR A MOMENT** with Docker Desktop 4.0.0.


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

On Mac, you might be fine. Depends on OS version, maybe...  We don't know!

### What didn't work

- In `packages/backend`, changes to `functions/**` or `firestore.rules` require the emulators to be restarted.

   Normally, the emulators would print information on their output about changed files, and adjust accordingly.
   
- In `packages/app`, Hot Module Reloading is lost if Vite runs under Docker.

	This is 💔 since we really need HMR to work. Cannot use DC for Vite until this is solved, one way or another.
