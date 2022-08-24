# Policy 🚨🚨

## Branching

Releases are prepared in separate branches, starting from `next.jun22`.

Once a release gets ready, it is merged to `master` and another `next.{monYY}` branch.

There may be two `next.{monYY}` branches under work, at one time (e.g. at the time of writing, `next.jun22` and `next.sep22`).

Naturally, one can also have feature branches (`fea.{...}`) that get merged to the `next` branches, for testing and release

This all depends on how many people are developing the repo. These policies are for adjusting, but should help newcomers fit in.

The aim is:

- `master` always is healthy, and presents a stable release

Bugfixes can be backported also to the former `next` branch (and through there, to `master`), if this seems feasible.

<!-- tbd. a picture of this (so much faster to understand!)
-->