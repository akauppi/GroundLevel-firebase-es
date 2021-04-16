Prev: [README](./README.md)

*This second half of the `README` discusses tests and co-developing with the back-end.*


## Introducing Cypress

We use [Cypress](http://cypress.io) for testing the front-end.

It is a heavy install, and that's why we skipped it at first. Now we'll take it into use:

```
$ npm install
```

Cypress is a full desktop application. It carries its own browser (Electron), but can also be used with Chrome, Chromium and Firebase.

Why do we want to install it via `npm`?

- Cypress [recommends](https://docs.cypress.io/guides/getting-started/installing-cypress.html) doing so.
- It is a versioned tool: this way we can hopefully steer clear of version incompatibilities (no surprises)
- It does cache the binary parts, and they are reused across projects.

Learning Cypress is a worthy thing. Please have a look at their [documentation](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell) to "learn the ropes".

## Testing

### Approach

Some Cypress features like "stubs" and "proxies" we don't need, at all. Those are intended as scaffolding when running things locally, but we have the whole Firebase emulators behaving like the Real Thing.


### Run them all (CI style)

There are two ways to run the tests. `npm test` launches everything needed by the tests, then runs them. This is suitable for when you expect tests to pass.

Try it now.

```
$ npm test
```

`npm test` launches the same local server as `npm run dev`. If you already have that running, please close it first. `npm test` is intended for things like CI systems where no prior processes are running.


### Test based development

The other way is to keep `npm run dev` running, and edit both one's code and tests (and Security Rules) while keeping an eye on the test results.

Have `npm run dev` running in the background. Then:

```
$ npx cypress open		# in a new terminal (note: we do this only for the first time)
```

You should see:

![](.images/cypress-launch.png)

Try to run the tests.

![](.images/cypress-run.png)

><font color=red>tbd. change image once tests pass</font>


Now edit some test in the IDE (they are under `cypress/integration/`).

Cypress will automatically re-run tests while you make changes to the source - or the tests. A big display may become useful, here!

In short, you can:

- *time travel* to see what the UI looked, at the time the tests were executed.

The Cypress approach changes the way we do software. The more time you spend with it, the more time it likely will save you.

>Hint: It's practical to launch Cypress from an OS icon. To do this in macOS, first launch like above. Then make the icon permanent (right click > `Options` > `Keep in Dock`). Other OS'es have similar mechanisms.
>
>Next time, launch Cypress from the icon instead of the `npx cypress open`.

---

<p align=right>Next: <a href="README.3-forward.md">Feedback and FWD</a></p>
