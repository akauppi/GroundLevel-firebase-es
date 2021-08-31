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

- macOS 11.5
- Docker Desktop on Mac 3.6.0

<!-- (whisper) Tried also (does not work):
```
$ docker compose run test --force-recreate
```

- Docker Restart: no help
-->

**To resolve**

- Docker > Dashboard > Containers > `backend` > Delete

This seems to be the only thing around it.

