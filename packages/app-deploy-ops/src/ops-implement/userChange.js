/*
* ops-implement/userChanged.js
*
* Binding between Firebase and adapters interested to know when a user changes.
*
*   1. Adapters call 'subscribe' to inform that they'd want to know when the user signs in/out.
*   2. Main provides the tickle, when Firebase has been initialized.
*/

// user-object: Reduced version of Firebase 'User':
//
// {
//    uid: string,
//    displayName: string,
//    email: string|undefined   // only there if verified
//    isAnonymous: boolean
// }

const subs = [];    // Array of (user-object|null) => ()

function subscribe(f) {   // ((user-object|null) => ()) => ()
  subs.push(f);
}

function tickle(user) {   // (user-object|null) => ()
  subs.forEach( f => {
    f(user);
  })
}

export {
  subscribe,
  tickle
}
