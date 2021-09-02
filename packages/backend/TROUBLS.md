# Troubls

## DC: "network [...] not found"

```
$ docker compose run test
[+] Running 2/0
 ⠿ Container backend_emul_1     Running                                                                                                                                                                                                                0.0s
 ⠿ Container backend_warm-up_1  Created                                                                                                                                                                                                                0.0s
[+] Running 0/1
 ⠋ Container backend_warm-up_1  Starting                                                                                                                                                                                                               0.1s
Error response from daemon: network 50951227962c795a9cce07e07ed100c13185f1eda7d152d400199fc4e5755455 not found
```

<!-- with
- macOS 11.5
- Docker Desktop on Mac 3.6.0
-->

- Docker > Dashboard > Containers > `backend` > Delete

This seems to be the only thing around it.


## Getting `nc: bad address 'warm-up'`?

This is an indication that the `warm-up` container didn't launch.

Run:

```
$ docker compose up warm-up
```

...and study the problem.


>DC does not give an error message, when a container that's depended on by `docker compose run` fails (completes with a non-zero code). This is perhaps because of lack of health checks - the dependence *only* means that the dependent container was started. Which it was.
