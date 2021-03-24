# Troubles(hooting)

## Stuck at "there are left over .."

```
$ cloud-build-local --dryrun=false ..
2021/03/24 16:03:52 Warning: there are left over step containers from a previous build, cleaning them.


```

If this happens to you, and nothing more.

```
$ docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                    PORTS               NAMES
bcbc08b57442        busybox             "sh"                     4 hours ago         Exited (0) 4 hours ago                        cloudbuild_vol_59342577-7885-416e-b3aa-a310d84af208-helper
...
```

Pick the container with `cloudbuild_` in its name.

>*Possibly close and restart Docker.*

```
$ docker container stop cloudbuild_vol_59342577-7885-416e-b3aa-a310d84af208-helper
cloudbuild_vol_59342577-7885-416e-b3aa-a310d84af208-helper
asko@Asko-Macmini builds (master) $ docker container rm cloudbuild_vol_59342577-7885-416e-b3aa-a310d84af208-helper
cloudbuild_vol_59342577-7885-416e-b3aa-a310d84af208-helper
```

