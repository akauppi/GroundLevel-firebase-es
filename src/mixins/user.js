/*
* src/mixins/user.js
*
* Read-only fields for reflecting user status in the UI.
*
* Usage:
*   <<
*     v-if(user)    <-- if user is signed in
*     {{ user.displayName }}
*   <<
*/
import { onAuthStateChanged } from '/src/util/auth.js';

const userMixin = ({
  data: () => ({
    user: null     // before authentication is checked
      // auth not established, yet: null
      // signed out:  false
      // signed in:   { displayName: string, uid: string, ... }
  }),
  created() {   // Note: no 'vm' parameter; forced to use 'this' #help
    const vm = this;

    /*
    * References:
    *   - Firebase User object documentation
    *     -> https://firebase.google.com/docs/reference/js/firebase.User.html
    */
    onAuthStateChanged(o => {   // (firebase user object) => ()
      if (o !== null) {
        if (true) {   // expose *all* of the Firebase user object to the application (may be initially good, bad later
                      // since we don't know which fields the caller really is using?)
          console.log(o);   // DEBUG

          vm.user = Object.assign({}, o);
        } else {      // expose a controlled subset (minimalistic)
          vm.user = {
            displayName: o.displayName,
            uid: o.uid
          };
        }
      } else {
        vm.user = false
      }

      // Output just some fields
      const report = (({ displayName, uid }) => ({ displayName, uid }))(vm.user);   // pick
      console.log('user mixin updated: ', report);
    });
  }
});

export { userMixin }
