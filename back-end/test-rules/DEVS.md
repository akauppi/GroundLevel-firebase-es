# Developer notes

### WebStorm shared run configurations

If you are using the WebStorm IDE, you should have a shared run configurations (`../.idea/runConfigurations`). This allows you to run the tests from the IDE, and/or debug them.

![](.images/webstorm-run-config.png)

Launch the Firebase emulator on the background, as mentioned earlier.


### WARNING: Use of dates in `data.js`

Firebase Web client can take JavaScript `Date` objects and convert them to its `Timestamp` automatically.

HOWEVER, `Date.now()` and `Date.parse` do <u>not</u> produce Date objects but Unix epoch numbers, so be warned.

||Use|<font color=red>Don't use!</font>|
|---|---|---|
|Current time|`new Date()`|<strike>`Date.now()`</strike>|
|Specific time|`new Date('27 Mar 2020 14:17:00 EET')`|<strike>`Date.parse('27 Mar 2020 14:17:00 EET')`</strike>|

*Note: We could detect these automatically by applying the access rules also to the admin setup. That would catch the discrepancies. Now we don't do it, and we don't test validity of reads, either, so these go through.*


<!-- experimental, disabled...
## Using with Dockerfile

The Dockerfile is there, to allow customer projects to check their rules, without needing to pull our `npm` dependencies.

Build the Docker image:

```
$ docker build .
...
Successfully built ca23750c9cb9
```

Use as: 

```
$ docker run -v $(pwd):/app $(pwd)/dut.rules:/app/dut.rules ca23750c9cb9
...
```

>Note: The `dut.rules` is separately mentioned, since it's a symbolic link in our case.
-->

<!-- disabled, those are not useful (8.6.0)
### Firebase coverage analysis

With the "against-a-standalone-emulator" approach, one can get [coverage reports](https://firebase.google.com/docs/firestore/security/test-rules-emulator#generate_test_reports) on the usage of Security Rules. This sounds great, but the author hasn't really found much use in them (the implementation is messy).
-->
