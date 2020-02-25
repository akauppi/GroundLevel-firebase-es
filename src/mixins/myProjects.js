/*
* src/mixins/myProjects.js
*
* Follow the projects that the current user has access to, and provide (also write) access to them.
* This is a bridge between Firestore state and the application.
*/
import { userMixin } from "@/mixins/user";

const myProjectsMixin = ({
  mixins: [userMixin],    // tbd. ideally, we'd just privately have access to 'user'; not exposing it as our API
  data: () => ({
    projects: [ { title: "AAA" }, { title: "BBB" } ]
  }),
  created() {   // Note: no 'vm' parameter; forced to use 'this' #help
    const vm = this;
  },
  watch: {
    user: function (o) {    // 'function' needed so that we can reach 'this'
      const vm = this;
      userChanged(vm, o !== null ? o.uid : null );
    }
  },
});

/*
* Called when the authenticated user changes.
*/
function userChanged(vm, uid) {    // (view-model, string | null) => ()
  console.log( "User changed to (myProjects):", uid);

  // Remove the earlier projects and (if logged in), repopulate.
  //
  vm.projects = [];

  if (uid !== null) {

    vm.projects = [{ title: "CCC" }];   // TEMP
    //...
  }
}

export {
  myProjectsMixin
}
