# Using Docker Compose V2


We are not going to details of DC here, but giving practical notes that aren't necessarily obvious from reading the manuals.

## 2.7.0 or 1.29.2? 🤔

Docker Compose 2 means that you can use Docker Compose commands as `docker compose` (before it was `docker-compose`). Docker Compose is now integrated with Docker itself, and comes bundled in the Docker Desktop applications.

However.

If you run this command:

```
$ docker compose version
Docker Compose version v2.7.0
```

..but if you look at Docker Desktop > `About Docker Desktop`:

>![](.images/dd-about.png) 

That says 1.29.2.

The author doesn't understand, why there are these two version numbers.

References: 

- [Compose V2 and the new docker compose command]() (Docker Compose docs)


## `docker compose up`

`up` launches a service, and its dependencies. It shows the service's output in the terminal and if you press Ctrl-C, the service is terminated.

Use this for e.g. debugging terminal output of starting emulators.


## `docker compose run`

`run` runs a certain task, making sure services such a task may require are also running.

Be aware that dependent services **remain running even after the task has finished**. This means two things:

- your subsequent runs are faster, since the background systems are already up and running
- the ports taken up by those services (and mapped to the Docker host, i.e. your `localhost`) **remain taken** until you close the composed stack.

To close the composed stack, you would normally do:

```
$ docker compose down
```

However, with this repo we have split Docker Compose definitions in multiple files, and the above command would usually leave services still running.

You can either visit each of the DC files (`-f docker-compose.some.yml`), but that's tedious. Open Docker Desktop > `Containers`, tick all services, `Delete 🗑`.


## Console output per container

You can *always* see any container's console output in the Docker Dashboard > `Containers` > `backend` > `emul-1`

![](.images/dd-containers.png)

Click the container's name to see its log:

![](.images/dd-container-log.png)


## Building after changes to base DC file

Docker Compose allows definition files to be based on others, making a cascade. This is awesome. Unfortunately, it does not detect if we change something upstream, e.g. pumping up the version of Vite we'd like to use.

This would confuse the development experience. We've counteracted it by using Makefiles and time stamps, so that changes to base files automatically cause the necessary rebuilds.

This works, but is error-prone since it duplicates a dependency chain between DC files.


## Handling concurrency `depends:on: ... condition:`

- Don't use the `version` entry in your Docker Compose files!

   If you do, you say farewell to `depends_on: ... condition:` feature that allows one container to wait for another, before launching.

This may be the most unintentionally buried feature in the Docker Compose ecosystem. It just works.

The Internet offers discussions where Docker authors seem to argue that depending on a health checked container is not a good idea.

<b>Ignore them!!</b>

The outcome seems to have been that the `version` field is not a good idea, and the modern Docker Compose is no longer requiring it.

What this allows you to do (see the sources for more details):

```
  emul:
    healthcheck:
      test: "nc -z localhost 6767 && nc -z localhost 5002"
      interval: 0.9s
      start_period: 25s
```

```
  emul-abc:
    depends_on:
      emul:
        condition: service_healthy  
```

Now, you can `docker compose run --rm emul-abc` and it will automatically wait until `emul` is not only launched, but also fulfills its `healthcheck`.

   
### Implications

Apart from `npm run {start|dev}`, also `npm test` launches services behind the scenes, using DC.

On a cold start, `npm test` takes somewhat longer (~30s .. 1min) since the Docker images need to be pulled, maybe built and the containers started. Later launches are way faster.


## Troubleshooting

If you have problems, a Docker > `Restart` is often sufficient. 

Also check that no unrelated process (browsers?) is hogging your CPUs.

>The author has sometimes experienced Safari taking >50% of CPUs. Restart of Safari brought it back to normal.


## Mapping individual files

Docker's `volumes:` mapping is designed for folders.

It can be used for files as well, but such files **must pre-exist before the container is launched**. Otherwise, Docker creates a host-side folder and maps it!

There is no `:f` modifier or similar that would allow us to enforce we're mapping a file.

**Work-around**

We make sure, using Makefiles, that each file-mapping exists.
