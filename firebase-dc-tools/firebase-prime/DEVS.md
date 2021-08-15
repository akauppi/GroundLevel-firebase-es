# Developer notes

## `docker compose up build`

If you change the code, do `docker compose up build` to force the using end to update its toolkit.

(This should likely be something we instruct *there*, since otherwise `git pull` with changes in the `firebase-dc-tools` will not detect them..)
