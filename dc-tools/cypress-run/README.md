# cypress-run

Environment for running `cypress run`.

Used via Docker Compose (which points to here).

## Approach

Cloud Build did not allow us to pull in the `.sh` directly with `ADD <url>`.

Thus, tying the GitHub repo as a GitHub submodule.

### Also considered

- Just downloading the file (and `LICENSE`), placing as local copies.
- Pulling by `npm install` of the managing repo.
- Using `apt-get` in the `Dockerfile` instead of adding the file.

We use submodules elsewhere, so it should be a way to "just have it done". Also allows us tight control on the version of the file (which we like, since it's a small and hardly updating file).
