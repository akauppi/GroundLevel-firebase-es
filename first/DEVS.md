# Developer notes

## `docker compose run` and ports

From [docker-compose run](https://docs.docker.com/compose/reference/run/) (Docker docs):

>The second difference is that the `docker-compose run` command does not create any of the ports specified in the service configuration. 
>
>[...] If you do want the service’s ports to be created and mapped to the host, specify the `--service-ports` flag:

No big thing. We can use either `--service-ports` or manually name the port mapping (as the doc goes on explaining).


