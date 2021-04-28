# Testing

Description on how the UI tests are implemented.


## Introducing Cypress

We use [Cypress](http://cypress.io) for testing the front-end.

It is a heavy install, and that's why we skipped it at first. Now we'll take it into use:

```
$ npm install
```

Cypress is a full desktop application. It carries its own browser (Electron), but can also be used with Chrome, Chromium and Firebase.

...snipped...

Learning Cypress is a worthy thing. Please have a look at their [documentation](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell) to "learn the ropes".

## Testing

...snipped...
...The rest might be better in Wiki...

Now edit some test in the IDE (they are under `cypress/integration/`).

Cypress will automatically re-run tests while you make changes to the source - or the tests. A big display may become useful, here!

In short, you can:

- *time travel* to see what the UI looked, at the time the tests were executed.

The Cypress approach changes the way we do software. The more time you spend with it, the more time it likely will save you.

>Hint: It's practical to launch Cypress from an OS icon. To do this in macOS, first launch like above. Then make the icon permanent (right click > `Options` > `Keep in Dock`). Other OS'es have similar mechanisms.
>
>Next time, launch Cypress from the icon instead of the `npx cypress open`.

