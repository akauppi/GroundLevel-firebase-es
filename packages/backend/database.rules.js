/*
* database.rules.js
*
* Security Rules for Firebase Realtime Database access
*
* Note:
*   Doing these as '.js' allows for comments, and some DRY-ness.
*   However, we currently lose watch mode: if you make changes to the rules, you need to restart the emulators.
*     <<
*       $ docker compose down; npm run start
*     <<
*
* Validating rules:
*   Use the Rules Playground [1] to interactively check, whether your rules make sense.
*
*     1. $ npm run _genDatabaseRulesJson    # generates tmp/database.rules.json
*     2. Copy-paste 'tmp/database.rules.json' to Firebase Console > 'Realtime Database' > 'Rules'
*     3. Fix the Red parts! :)
*
*   [1]: https://firebase.google.com/docs/rules/simulator
*
* Note:
*   Realtime Database doesn't seem to support lists as values (values are number|string|boolean). One can use
*   sub-objects. It's like JSON-without-arrays.
*
* References:
*   - Security Rules Language [Realtime Database] (Firebase docs)
*     -> https://firebase.google.com/docs/rules/rules-language#database
*   - "10 Firebase Realtime Database Rule Templates" (blog, Jan 2019)
*     -> https://medium.com/@juliomacr/10-firebase-realtime-database-rule-templates-d4894a118a98
*/

// Cheats:
//    term          sample / what-is
//    ----          ---
//    .contains()   "$room_id.contains('public')"
//    now           current time in ms (server time)
//    root          root node, "as it exists before ..."
//    data          data before
//    newData       data after (if the operation were to succeed)
//    auth          "authenticated user's token payload"
//
//    .val()        'newData.val()', 'data.val()'
//    .child()      'root.child("...").val()'
//    .parent()
//    .exists()     on 'data', 'newData', '.child()' nodes; "newData.child('foo').exists()"
//
//    String:
//      .beginsWith()
//      .endsWith()
//      .replace()
//      .toLowerCase()
//      .toUpperCase()
//      .matches()

// Intention:
//
//  - only authenticated users can write logs
//  - there are two destinations for each Firebase project:
//    '/logging_v0'     - production logs
//    '/logging_v0:dev' - development logs ('ENV=... npm run dev:online'; UI running on development machine)
//  - users cannot read logs

const validate = s => ({ ".validate": s });

const validate_string = validate("newData.isString()")
const validate_number = validate("newData.isNumber()")
const validate_map = validate("newData.hasChildren()")    // non-empty JSON object

function validate_hasChildren(...args) {
  return {
    ".validate": `newData.hasChildren(${ JSON.stringify(args).replaceAll('"', '\'' ) })`
  }
}

// Note: "The unique key generated by 'push()' is based on a timestamp, so list items are automatically ordered
//      chronologically." [1]
//
//  [1]: https://firebase.google.com/docs/database/web/lists-of-data#reading_and_writing_lists

const loggingRules = {
  ".write": "auth != null",   // only authenticated users may write

  "$pushKey": {
    ".write": "newData.child('uid').val() == auth.uid"    // check user doesn't cheat on the reported uid
            +" && !data.exists()",    // ban delete and updates (just create)

    ...validate_hasChildren("at", "uid", "id", "msg"),    // optional: "args"

    "at": validate_number,    // client's time stamp
    "uid": validate_string,

    "id": validate_string,
    "msg": validate_string,
    "args": validate_map,    // or null

    //"context": "object"   // .browser etc. tbd.

    "$other": validate(false)   // other keys not tolerated
  }
}

/*
* Counters, with optional tags.
*
*   - must be authenticated (as with logging)
*   - write only
*
* /counters[:dev]/{name}/{timeslot-by-N-min}/[_|{tag=val}]
*
*   'timeslot-by-N-min' is a ms-since-epoch time stamp, as provided by: Math.floor( Date.now() / (N*60*1000) ) * N*60*1000
*   It shows the beginning of a time slot, collecting the counters.
*
*   The slot is needed, because _all_ users increment the _same_ counters. Alternatively, we could sum up the
*   written increments in Cloud Functions. This would not need the writer to provide a time slot (but Cloud Functions
*   would). A third alternative would not increment values; just "log" the increments and the viewing party would
*   add them together.
*
*   All of these are possible. Let's see what turns out to be the best way forward.
*/
const counterRules = {
  ".write": "auth != null",   // only authenticated users may write

  "$name": {
    "$tag": {
      ...validate_number,
      ".write": "!data.exists() || newData.val() >= data.val()",
    }
  }
}

const rules = {
  ".read": false,             // no read access to any of the logs or counters
  ".write": false,            // writes to random paths not allowed

  "logging_v0": loggingRules,
  "logging_v0:dev": loggingRules,

  "counters_v0": counterRules,
  "counters_v0:dev": counterRules
}

export default {
  rules
};
