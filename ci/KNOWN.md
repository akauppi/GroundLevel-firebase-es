# Known issues

## Stuck at "there are left over .."

```
$ cloud-build-local --dryrun=false --config=cloudbuild.pr.yaml ..
2021/03/24 16:03:52 Warning: there are left over step containers from a previous build, cleaning them.
```

If this happens to you (and nothing more is output).

Restart Docker. Retry.

After the restart, the cleanup logic seems to pass, reliably.

<!-- this was needed, before:

```
$ docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                    PORTS               NAMES
bcbc08b57442        busybox             "sh"                     4 hours ago         Exited (0) 4 hours ago                        cloudbuild_vol_59342577-7885-416e-b3aa-a310d84af208-helper
...
```

Pick the container id with `cloudbuild_` in its name.

Restart Docker.

```
$ docker container stop bcbc08b57442
$ docker container rm bcbc08b57442
```
-->


## Error 1

```
$ cloud-build-local -dryrun=false --config=ci/cloudbuild.pr.yaml .
2021/05/24 08:26:18 Warning: there are left over step volumes from a previous build, cleaning it.
2021/05/24 08:26:19 Warning: The server docker version installed (20.10.6) is different from the one used in GCB (19.03.8)
2021/05/24 08:26:19 Warning: The client docker version installed (20.10.6) is different from the one used in GCB (19.03.8)
2021/05/24 08:26:38 Error copying source to docker volume: exit status 1
```

No solution to this.

`cloud-build-local` has no verbose flag. How to know what could be wrong??

Docker Desktop doesn't allow using certain Docker version.

For the moment, cannot use `cloud-build-local`.


