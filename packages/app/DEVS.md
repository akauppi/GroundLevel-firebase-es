# Developer notes

## Peer problems when updating Vue

```
$ npm install
...
Found: @vue/compiler-sfc@3.0.5
npm ERR! node_modules/@vue/compiler-sfc
npm ERR!   peer @vue/compiler-sfc@"^3.0.4" from @vitejs/plugin-vue@1.1.4
npm ERR!   node_modules/@vitejs/plugin-vue
npm ERR!     dev @vitejs/plugin-vue@"^1.1.4" from the root project
npm ERR!   dev @vue/compiler-sfc@"^3.0.6" from the root project
...
```

If you run into such problems, remove the existing installation by:

```
$ rm -rf node_modules/@vue node_modules/vue
```

Try again.


## Cypress naming conventions

We're taking liberties naming the folders differently.

||us|Cypress default|
|---|---|---|
|tests|`cypress/<story>`|`cypress/integration`|
|commands|`cypress/commands`|`cypress/support`|

The `integration` just felt uncomfortable, since all our tests are integration tests. It doesn't add value.

Similarly, anything non-test is "support" but what the folder really carries are custom `cy.` commands.

Sorry about this. It's normally a good deed to follow a tool's conventions. It makes moving between projects easier, for one.

Let the author know if you feel strongly about this - or have a suggestion for a better naming convention!
