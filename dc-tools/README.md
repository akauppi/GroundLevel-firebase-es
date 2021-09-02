# `dc-tools`

Docker images for use by Docker Compose.

|name|provides|comments|
|---|---|---|
|`n16-user`|Node 16; npm >= 7.7; [`wait-for-it`](https://github.com/vishnubob/wait-for-it) CLI|
|`firebase-prime`|Like `n16-user` but adding a `firebase-prime` CLI command|

Gets automatically pulled and built, by `docker compose`.

>## Why is this here?
> 
> It's nice to lift up environment creation (eg. installation of `wait-for-it` from the Docker Compose files. Slows things slightly and creates some pitfalls (like needing to explicitly `docker compose build` if these recipes change, but otherwise, the author likes it.

**Benefits of `build:`**

- Separation of step set-up from actual commands

**Down sides of `build:`**

- Slows down CI if used there (since builds aren't cached)
- Needs explicit rebuild if definitions change (authors **JUST NEED TO KNOW THIS!**)

