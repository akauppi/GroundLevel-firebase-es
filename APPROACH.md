# Approach

>This repo has similar `APPROACH.md` files in some subdirectories, as well. This one discusses overarching approaches.

## Managing complexity at folder level

This repo contains multiple subprojects under one umbrella. They have to do with each other, but also provide a "playground" where one can focus on a certain part of the app / its lifespan, and not worry about the rest.

This separation of concerns is essential in software engineering, to counter overwhelming complexity. It's the anti-spagetti code recipe. 🥬🥒🌶

|||dev|testing|deploy|monitoring|
|---|---|---|---|---|---|
|`packages/app`|Application front-end|&check;|&check;|-|-|
|`packages/backend`|Application backend|&check;|&check;|-|-|
|`first`||-|-|&check;|-|
|`ci`||-|-|&check;|-|
|`ops`||-|-|-|&check;|

>The `packages/{app|backend}` folders are intended to grow into Git submodules.


### Common dependencies

Packages used by multiple subpackages (currently, only ESLint) can be installed at the *root*. `npm` seems to pick up packages installed in parent folders.

- same version used by all subpackages
- one update suffices


## IDE freedom

The author uses [WebStorm](https://www.jetbrains.com/webstorm/) and it's really, really good.

However, IDEs are a personal thing so the repo tries to be agnostic of one's choice. This is why formatting guidance are in `.editorconfig` files.


## CI/CD

Chose to place almost all the CI/CD specific files in the `ci/` subfolder.

This is conscious, to avoid complexity creep if such files were spread around the repo. In cases where there are CI-specific files within `packages`, those are fully separate from development commands. If one works on CI, one won't accidentially break development experience - and vice versa.


## Why we use Docker Compose so heavily

The repo needs some way of managing concurrency, and Docker Compose (DC) turned out to be better than the alternative.

- helps keep `package.json` simpler<sup>[1]</sup>
- is suitable for both development and CI use
- is a standard tool good to gain experience with
- helps make execution environments more alike between different users, machines and OSes
- does not require extra terminals to be kept open, yet allows UI access to service logs
- makes it easy to close down started processes

   This applies to shutting them in the Docker Dashboard. Since we started using multiple DC files per folder, shutting down services in the command line has become unnecessarily difficult.
   
   *tbd. Thinking of making it easier with `Makefile`s; `make flat`*

>Before DC, we used `concurrently`, an `npm` package, and custom scripts for waiting on a port to get opened. This worked, but was a constant stream of problems, and didn't help in the above goals.

<small>`[1]`: If going towards Makefiles, `package.json`s will get yet a lot simpler.</small>

### Some downsides

- dependency on Docker Desktop being installed
- performance issues to be kept an eye on (nothing major)

   Development of one's application normally involves having services running in the background. Once launched, performance (e.g. in Hot Module Reload) is not noticably different from native.

### File sharing

This repo has placed `:ro`, `:cached` and `:delegated` annotations to the volumes and files shared, and shares only minimum necessary files/folders.

This started off as a way to optimize Docker Desktop for Mac (VirtioFS) performance, but turned out beneficial to control the side effects of containerization. It looks more complex, but actually reduces it!!
