# Design & approaches

In every project, there are decisions and compromises taken. There's no one single route to the end result. In this section, we discuss these decisions briefly since it is good to be aware of them.

You don't have to follow all of these. The more you know, the more prepared you are to swim against the flow and do your own choices. But it's good to know why you take a different stand and what's in it for your team.


## Split into three repos

There are three repos:

- [web]() for production build & operations (B&O)
- [app]() for front end
- [backend]() for back-end (data models and back-end functions) 

Is this strictly necessary? No.

**Pros**

Each of the repos becomes simpler. Especially the `package.json` are considerably simpler when only the dependencies of a certain repo are in each (e.g. back-end uses Jest; app uses Cypress; web uses Rollup).

Generally one tries to aim at modularity and locality in software development.

Another benefit is that you can keep receiving updates to the B&O repo, while working individually on your application. This may be a crucial thing e.g. in a company with multiple products: you can unify deployment and operations principles, bringing them from a master template.

**Cons**

It makes things more burecratic. There's a "gate" at e.g. front-end development: development and testing happens within that repo and a ready, tested product is introduced to `web` for deployment. What if you still need to do changes, at that level? Back to the other repo.

You can tie the repos together a bit with `npm link` or Git subrepositories (not presented; on your own), but generally splitting to three repos also adds complexity.

**Other way**

You *can* keep all the pieces in one jar. Just create a folder called `backend` (or anything) and place back-end features there. Same for app (`app`, maybe?).

You'd have to merge the `package.json`s and documentation, but maybe you'd keep also those within the subdirectories.


## Rollup

We use Rollup directly for production builds.

Also Vite (which we use in development builds) uses Rollup under the hoods. So why bother and not just do `vite build`?

**Pros**

Using Rollup directly allows better control on how our production code is bundled. 

Also, we wanted to experiment between the two approaches, to see the efficiency of their builds.

**Cons**

Needing to maintain the Rollup configuration.

**Legacy**

We used to have a single repo, and a single `index.html` for both development and production (with the filtering in `tools/prod-index-filter.js` producing the Rollup version).

Now that the repos are split, there's less need for this, but e.g. deciding how Rollup writes chunks to deployable `.js` files is still up to us, and we cannot completely get away from the filtering.

**Other way**

Use Vite all the way to production. Can be done; no sample is provided for this.

**Packaging efficiency comparison**

Vite has gotten better during its development. Here are the figures 6-Oct-2020:

||Rollup|vite 1.0.0-rc4|
|---|---|---|
|deployment size|720 kB|852 kB|

>Measured by: `du -hk -I "*.map" [public/]dist`, i.e. includes everything but sourcemaps.


<!-- cut
Vite used to say in its docs:

>because native ES module imports result in waterfall network requests that are simply too punishing for page load time in production.

This is not necessarily true. With HTTP/2 hosting, meaningful number of `.js` files (< ~100) and "modulepreload", such import cascades can be kept in check.

Philip Walton has pioneered this approach, see ["Using Native JavaScript Modules in Production Today"](https://philipwalton.com/articles/using-native-javascript-modules-in-production-today/) (blog, Aug 2019)
-->


<!--
...more design approaches here
-->


---

Next: [Credits and References](./README.6-credits.md)

