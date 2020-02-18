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
import { onAuthStateChanged } from '@/auth.js';

const userMixin = ({
  data: () => ({
    user: null     // before authentication is checked
      //
      // null: auth not established, yet
      // false: signed out
      // { displayName: string, ... }: signed in
  }),
  created() {   // Note: no 'vm' parameter; forced to use 'this' #help
    const vm = this;

    /*
    * Firebase User object documentation: https://firebase.google.com/docs/reference/js/firebase.User.html
    *
    *
     */
    onAuthStateChanged(o => {   // (firebase user object) => ()
      if (o !== null) {
        if (true) {   // expose *all* of the Firebase user object to the application (may be initially good, bad later
                      // since we don't know which fields the caller really is using?)
          vm.user = Object.assign({}, o);
        } else {      // expose a controlled subset (minimalistic)
          vm.user = { displayName: o.displayName }
        }
      } else {
        vm.user = false
      }

      // Seems Firebase user object can have "circular references" so... maybe we don't want to use it. tbd.
      console.log('user mixin updated: ', JSON.stringify( { displayName: vm.user.displayName } ));
    });
  }
});

export { userMixin }
