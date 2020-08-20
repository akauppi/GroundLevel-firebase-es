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
