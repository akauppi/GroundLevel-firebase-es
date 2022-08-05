# Policy

Releases are prepared in separate branches, starting from `next.jun22`.

Once a release get ready, it is merged to `master` and another `next.{monYY}` branch is opened.

Naturally, one can also:

- have two target branches open, at the same time
- have feature branches (`fea.{...}`) that get merged to the `next` branches, for testing and release

This all depends on how many people are developing the repo. These policies are for adjusting, but should help newcomers fit in.

The aim is:

- `master` always is healthy, and presents a stable release

Bugfixes can be backported also to the former `next` branch (and through there, to `master`), if this seems feasible.

