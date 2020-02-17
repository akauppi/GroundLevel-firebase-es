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
  //computed: {
  //  isSignedIn: (vm) => vm.user && vm.user.displayName !== undefined    // derived but useful for the UI code
  //},
  created() {   // Note: no 'vm' parameter; forced to use 'this' #help
    const vm = this;

    onAuthStateChanged(o => {   // (firebase user object) => ()
      if (o !== null) {
        if (true) {   // expose *all* of the Firebase user object to the application (may be initially good, bad later?)
          vm.user = Object.assign({}, o);
        } else {      // expose a controlled subset
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
