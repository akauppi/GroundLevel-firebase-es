# Debugging

## WebStorm

In IntelliJ WebStorm, create a Run configuration by `Run` > `Edit Configurations...`:

![](.images/webstorm-jest-config.png)

<!-- disabled. no longer using that?
Add the `FIRESTORE_EMULATION_HOST` environment variable, as it is in `package.json`.
-->

You can <!--now--> set breakpoints in the UI or use the `debugger` statement to bring up the IDE. 

Start a debugging run of the tests from the `Debug > Run All tests` icon


## Seeing relevant `firestore.rules` line

When a test fails, there's a "L15" or similar mention:

>![](.images/rules-line-number.png)

Use this to pinpoint the rule that caused the unexpected behaviour.


<!-- bygones?
## Run just one test file

Jest treats each test file separately, so writing `describe.only` in one does not prevent the other files from being executed. To limit the tests to just one file, use:

```
$ npm run test-dev -- -f invitesC.test.js
...
```

This does not even compile the other test files.
-->
