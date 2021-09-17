# Living with Docker Compose

Docker Compose (DC for short) is used to launch background services (Firebase Emulators and Vite) throughout this repo.

There are a few things that you - as a developer - should know, and some hints to nudge your development workflow to be more productive.

- [Lesson 1](#Lesson_1)
- [Lesson 2](#Lesson_2)
- [Lesson 3](#Lesson_3)
- [Lesson 4](#Lesson_4)
- [Implications](#Implications)
- [Why we use it?](#Why_we_use_it_)
- [Troubleshooting](#Troubleshooting)
- [Docker Desktop for Mac](#Docker_Desktop_for_Mac)

---


## Lesson 1

When you do this:

```
$ npm run dev
...
[+] Running 3/3
 ⠿ Network app_default       Created          0.1s
 ⠿ Container app_vite-exp_1  Created          0.2s
 ⠿ Container app_emul_1      Created          0.1s
[+] Running 2/2
 ⠿ Container app_emul_1      Started          0.9s
 ⠿ Container app_vite-exp_1  Started          0.8s
wait-for-it: waiting 15 seconds for emul:6767
wait-for-it: emul:6767 is available after 4 seconds
wait-for-it: waiting 10 seconds for emul:9100
wait-for-it: emul:9100 is available after 5 seconds
wait-for-it: waiting 10 seconds for vite-exp:3000
wait-for-it: vite-exp:3000 is available after 0 seconds
```

... you return to the same command prompt.

The services are still running in the background, and take up the ports.

|||
|---|---|
|6767|Cloud Firestore|
|9100|Firebase authentication|
|3000|Serving the front-end files (Vite)|

If you now run the same command again, it is way faster, since the services were already running.

You can leave the services running this way - there is no real downside.

If the selected ports collide with something you use otherwise, feel free to change the port numbering in the `package.json`, `docker-compose.yml` and `firebase.json` files.

>Note: Changing port numbering should be easier than it currently (Sep 2021) is. It's currently spread across `package.json`, `docker-compose*.yml` and `firebase.json` files. Your best friend is to do something like `git grep 3000` to see where that port may be mentioned.
>
>Please send in ideas on how you'd prefer this to be configured/centralized. Maybe a `config.js` file, per each package?

Closing Docker is completely fine. So is removing container groups ("apps") withing Docker Desktop, or running Docker > Restart. Next time you run the commands needing containers, they will be recreated from scratch.


## Lesson 2

Since the services do not need another terminal to be opened, where can you see their output?

Docker > `Dashboard` > `Containers / Apps` > `app` > `app_emul_1`

![](.images/dd-dashboard.png)

Once you know this exists, Docker Desktop becomes your (upside-down) periscope to all things below the surface. 🐋🦈 Study it - use it!

Error messages here will help you debug eg.

- Firebase Security Rules issues
- Cloud Functions issues


## Lesson 3

Running all backend services under DC helps in cleanup.

To bring all background processes down, you can either:

- `docker compose down` from the terminal

   This needs to be done **separately in each folder** and separately for each Docker Compose file (e.g. `-f docker-compose.online.yml` needs to be specifically added).
   
   It works, but there are other ways that may be better.
   
- Docker > `Dashboard` > `Containers / Apps` > (pick) > `Delete` (trash bin icon)

   >Docker Desktop calls an "app" all the services launched within the same folder. For us, apps are the same as packages: `backend`, `app`, and `app-deploy-ops`. Underneath these are the individual containers.
   
   You can remove either full "apps" or individual containers.

- Docker > `Restart` 

   Works. Your containers remain, but they are no longer running. Thus, their ports are now available.

- Docker > `Quit Docker Desktop`

   Works.

You shouldn't be able to do any damage to the repo, no matter what you do in the Docker Desktop. Everything is re-creatable so try around and find a workflow that suits you best! Break things. 😊

   
## Implications

Apart from `npm run {start|dev|serve}`, also `npm test` launches services behind the scenes, using DC.

On a cold start, `npm test` takes somewhat longer (~30s .. 1min) since the Docker images need to be pulled, maybe built and the containers started. Later launches are way faster.

If you have run `npm test`, you should still run `npm run {start|dev}` for the interactive development support, as instructed in the package's `README`. These do things like priming the user data that may not be covered by `npm test`.


## Why we use it?

The repo needs some way of managing concurrency, and DC turned out to be better than the alternatives.[^1]

- helps keep `package.json` simpler
- is suitable for both development and CI use
- is a standard tool good to gain experience with
- helps make execution environments more alike between different users, machines and OSes
- does not require extra terminals to be kept open,<br /> yet allows centralized access to the service output, when needed
- makes it easy to close down started processes

[^1]: Before DC, the repo used `concurrently`, an `npm` package. This worked, but fell short of DC in most of the above cases.

### Some downsides

- dependency on Docker Desktop being installed
- **stability issues** (we're keeping an eye on this!)

   Stability issues are likely more of a bother developing the setup, than using it for app development. Anyhow, it's something we can take on, and create proper bug reports to Docker if there is a need.

   Current problems we face can be seen at the project's [GitHub Issues](https://github.com/akauppi/GroundLevel-firebase-es/issues?q=is%3Aissue+is%3Aopen).

## Troubleshooting

If you meet these, a Docker > `Restart` is often sufficient.

### Network error in bringing DC down

```
$ docker compose down
[+] Running 1/1
 ⠿ Container app_emul_1  Removed                                                                                                                                                                                                                 10.4s
 ⠿ Network app_default   Error                                                                                                                                                                                                                    0.0s
failed to remove network bf7b0a66db9138f6e9bf85c8d7dcb9643830e2c5f520d124d226e92e7232b7d8: Error response from daemon: error while removing network: network app_default id bf7b0a66db9138f6e9bf85c8d7dcb9643830e2c5f520d124d226e92e7232b7d8 has active endpoints
```

This is likely due to changes having been done to the DC YAML files. Docker > `Restart` and things can be fine, again.

Sometimes, one needs to remove the whole container group (Docker "app").

<!--
Seen on:

- Docker Desktop for Mac 4.0.0
-->

## Docker Desktop for Mac

### File sharing option

This one:

![](.images/docker-desktop-fs-checkbox.png)

..is a complex story.

The author keeps it disabled. The `osxfs` implementation works for most users, but its authors "left the company some years back" so Docker is thinking of replacing it with another implementation.

Both of these can be **slow**.

With the number of files we have, that likely does not matter. 

---

>For the daring, here's the link: https://github.com/docker/roadmap/issues/7 🥶

>TL;DR Docker is **determined** to move away from `osxfs` implementation, but only when it doesn't break anything, to anyone.

>🥇 if you read the whole issue!

---

This repo has placed `:cached` and `:delegated` annotations to the volumes shared, and shares only minimum necessary files/folders. This is anyhow good encapsulation, but also may help improve Docker Desktop for Mac performance.


