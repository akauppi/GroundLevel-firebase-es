# Living with Docker Compose

Docker Compose (DC for short) is used to launch Firebase emulators in both `packages/backend` and `packages/app`. This is intended to happen behind the scenes, but there are a few things you - as a developer - should know. 


## It keeps running..

Commands like `npm test` launch the emulators behind the scenes. On the first run, this takes somewhat longer (~30s) to get everything running. After that, running `npm test` is swift.

This is because the **emulators keep running in the background**, until you explicitly turn them off.

This can be done in multiple ways:

- `docker compose down` (given in the particular directory)
- Docker > `Restart`

### Why this matters?

While running, the emulators take up some ports (4000, 5002, 6767, 9100, but this depends on your `firebase.json`).

Taking these ports may cause other software on your system to not be able to run, so it's good to know what's causing it.

Also, front-end and back-end folders use the same ports, so when switching between the two you should:

```
$ docker compose down
```

..in the folder you don't actively develop in.


## Tips

Some `docker compose` commands that may be useful:

||what it does|
|---|---|
|`ps`|Lists the services currently running|
|`down`|Pulls down the services|

*(yeah, we already mentioned that)*

### Service logs in Docker Desktop

Docker > `Dashboard` > `Containers / Apps` > `app` > `app_emul_1` 

![](.images/dd-dashboard.png)

You can see all the console output of the background processes here. Nice debugging tool if there are problems launching the emulators.


## Why we use it?

We need some way of managing the Firebase emulators, and DC turned out to be better than the alternatives.

- helps keep `package.json` simpler
- is suitable for both development and CI use
- is a standard tool good to gain experience with
- helps make execution environments more alike between different users, machines and OSes 

>Before DC, the repo used `concurrently`, an `npm` package. This worked, but caused complexity in the `package.json` space that we rather live without.

The main downsides of using DC are:

- one needs to remember to `docker compose down`, to release the ports
- some stability issues (we're keeping an eye on this!)

For learning more about Docker Compose:

- [Overview of Docker Compose](https://docs.docker.com/compose/)
