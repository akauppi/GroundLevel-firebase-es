# Approach


## Managing a monorepo

>The author tried `npm@7` workspaces. They did not provide anything new. See -> [Wishes for npm.md](DEVS/Wishes%20for%20npm.md).

This is a monorepo. That means that there are multiple subprojects under the one umbrella. These have to do with each other, but could also be kept in separate repos.

|||dev|testing|deploy|monitoring|
|---|---|---|---|---|---|
|`packages/app`|Front-end application|&check;|&check;|-|
|`packages/app-deploy-ops`|Front-end application|-|-|&check;|
|`packages/backend`|Back-end|&check;|&check;|&check;|
|`ops`|Whole app|-|-|-|&check;|

This splitting is an important thing. It allows you - as a lone developer - to focus on a certain subdomain of your application instead of the overwhelming feeling when there are simply too many things "up in the air". It facilitates *interfaces*, and interfaces are good for *testability*.

Most repos the author has seen are not like this. Either one has separate (teams?) for back end and front end; at least separate repos. Or one pours too much into the same directory, living on hope, but exhausting it.

The three repos are connected, of course. They have `file:...` links which means you don't have to publish any of the repos anywhere. They are simply build-walled separations of concern.

<!--
>Suggestions on how dependency management (`npm install`) could be centralized are welcome!
-->

### Common dependencies

Packages used by multiple subpackages are installed at the *root* and accessed by the subpackages via `"file:../../node_modules/*package*" links. 

This has the following benefits:

- uses less disk space on traditional `npm` (eg. Firebase JS SDK is installed only once, saving over 150MB)
- same version used by all subpackages
- one update per package


## IDE freedom

The author uses [WebStorm](https://www.jetbrains.com/webstorm/) and it's really, really good.

However, IDEs are a personal thing so the repo tries to be agnostic of one's choice. This is why formatting guidance are in `.editorconfig` files.


## Supporting actors

In the process of creating the repo, the author ended up creating these `npm` libraries to help:

- [firebase-jest-testing](https://github.com/akauppi/firebase-jest-testing) for helping test Firebase back-ends
- [aside-keys](https://github.com/akauppi/aside-keys/tree/master/packages/aside-keys) for authentication UI side

Such libraries are intentionally outside of the repo, just like existing help components (or ones that you create for your application) might be.

The Docker image created for Cloud Build also deserves a mention: 🏅

- [firebase-custom-builder](https://github.com/akauppi/firebase-custom-builder) for testing with Firebase emulators, in CI/CD


## CI/CD

Chose to place *all* the CI/CD specific files in the `builds/` subfolder.

This is conscious, to avoid complexity creep if such files were spread around the repo. Also, it's about roles. The backend sub-package knows how it can be tested. It does not *care* who does it, in which cloud, under which circumstances.

This also makes it easier to switch the CI/CD provider. In a way, CI/CD is yet another *orthogonal* choice, in addition to **development** ("which web app framework should we use"), and **ops** ("which logging/alerting infrastructure").

<!-- tbd. picture of three axis -->


## Why we use Docker Compose so heavily

The repo needs some way of managing concurrency, and DC turned out to be better than the alternative.

- helps keep `package.json` simpler<sup>[1]</sup>
- is suitable for both development and CI use (and helps keep them apart!)
- is a standard tool good to gain experience with
- helps make execution environments more alike between different users, machines and OSes
- does not require extra terminals to be kept open, yet allows centralized access to the service outputs
- makes it easy to close down started processes

>Before DC, we used `concurrently`, an `npm` package, and custom scripts for waiting on a port to get opened. This worked, but was a constant stream of problems, and didn't help in the above goals.

<small>`[1]`: If going towards Makefiles, `package.json`s will get yet a lot simpler.</small>

### Some downsides

- dependency on Docker Desktop being installed
- performance issues to be kept an eye on (nothing major)

   Development of one's application normally involves having services running in the background. Once launched, performance (e.g. in Hot Module Reload) is not noticably different from native.

### File sharing

This repo has placed `:ro`, `:cached` and `:delegated` annotations to the volumes and files shared, and shares only minimum necessary files/folders.

This started off as a way to optimize Docker Desktop for Mac (VirtioFS) performance, but turned out beneficial to control the side effects of containerization. It looks more complex, but actually reduces it!!
