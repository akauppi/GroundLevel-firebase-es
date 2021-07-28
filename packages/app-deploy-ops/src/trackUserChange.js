/*
* src/trackUserChange.js
*
* Context:
*   Firebase has been initialized
*
* Pass information about user changes to the ops systems.
*/
import { onAuthStateChanged, getAuth } from '@firebase/auth'
const auth = getAuth();

import { userChanged } from '/@adapters/raygun/index'

//  {
//    displayName: "Joe Dalton"
//    email: "joe@dalton.com[ic]"
//    emailVerified: true,
//    isAnonymous: false,
//    metadata: { createdAt, ... }
//    ...
//    photoURL: string
//    providerId: "firebase"
//    uid: <string>
//  }
//
onAuthStateChanged( auth,user => {

  const conv = ({ displayName, email, emailVerified, isAnonymous, uid }) => ({
    uid,
    displayName,
    email: emailVerified ? email : undefined,   // don't provide the email if we cannot trust it
    isAnonymous
  });

  userChanged(user ? conv(user) : {});
});
