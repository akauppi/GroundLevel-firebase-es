# Developer notes (Cypress)

## Clean up disk space from Cypress

Cypress cache gathers easily some weight.

```
$ du -d 1 -h ~/Library/Caches/Cypress/
783M	/Users/x/Library/Caches/Cypress//7.1.0
750M	/Users/x/Library/Caches/Cypress//7.5.0
777M	/Users/x/Library/Caches/Cypress//7.2.0
  0B	/Users/x/Library/Caches/Cypress//cy
761M	/Users/x/Library/Caches/Cypress//7.6.0
3,0G	/Users/x/Library/Caches/Cypress/
```

>That's the macOS directory. For Windows and Linux, see [here](https://docs.cypress.io/guides/getting-started/installing-cypress#Binary-cache) (Cypress docs).

When new versions come available, they pile up here.

To reclaim disk space, just remove the unneeded folders.

>Note: Moving to trash bin does not clear the space. `rm -rf` does.

You can also use:

```
$ npx cypress cache prune

Deleted all binary caches except for the 7.6.0 binary cache.
```

<!-- disabled
**More depth:**

- [Cleaning Up Space on Development Machine](https://glebbahmutov.com/blog/cleaning-up-space/#cleaning-old-cypress-binaries) (blog, Apr 2020)
-->
