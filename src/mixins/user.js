/*
* src/mixins/user.js
*
* Read-only fields for user information
*/
// We expect the user to be signed in and not to change, during our lifespan.

import { userProm } from '../auth.js';

export default ({
  data: () => ({
    user: {
      displayName: '',
      isSignedIn: false
    }
  }),
  created() {
    userProm.then( (user) => {
      if (user) {
        this.displayName = user.displayName;
        this.isSignedIn = true;
      } else {
        this.displayName = null;
        this.isSignedIn = false;
      }
    })
  }
});

