<!--
- src/pages/Project.vue
-
- The project page. Most of the time will be spent here.
-->
<template>
  <section>
    <div>
      PROJECT PAGE
    </div>

    <h2>Project <tt>{{ project.title }}</tt></h2>

    <h2>Members:</h2>
    <ul>
      <!-- Note: Does the 'userInfo[uid].name' work reactively, even when 'userInfo' doesn't yet have the info but will? #vuejs? #vuejs
      -->
      <li v-for="uid in [...project.authors, ...project.collaborators]" :key="uid">{{ uid in userInfo ? userInfo[uid].name : "💫" }} {{ uid in project.authors ? "is author" : "" }}</li>
    </ul>
  </section>
</template>

<style scoped>
  section {
    text-align: center;
  }
</style>

<script>
  import { userMixin } from '@/mixins/user';   // ignore IDE warning
  import { assert } from "@/util/assert";
  import { watchProject, watchUserInfo } from "@/firebase/queries.js";

  export default {
    name: 'Project',      // Vue note: names help in debugging
    mixins: [userMixin],
    props: {
      id: { type: String, required: true }
    },
    data: () => {
      return {
        // Vue 2 note: need to use object ('{}'), not an ES6 map to get reactivity going. With Vue 3, it'll be different.
        project: {},        // { projectC-doc }
        //symbols: {},        //

        userInfo: {},    // { uid: userInfoC-doc for the users in -or who have been in- the project }

        _unsubs: []    // array of () => ()
      }
    },
    computed: {
      projectId: vm => vm.id    // alias
    },
    created: function () {
      const vm = this;
      assert(vm);

      // We get a snapshot of all the matching documents, when something changes. Update 'projects' accordingly.
      //
      const unsubscribeProject = watchProject( vm.id, data => {   // (projectDoc | null) =>
        if (!data) {
          alert("Hey, we lost the project!!!");   // tbd. plus inform this to monitoring
          $this.router.go(-1);
          return;
        }
        console.debug( `CHANGES TO PROJECT ${vm.id}:`, data );

        // If there's a new user, add tracking their name etc.
        //
        // Note: This may be "expensive" since each user starts to track N others, separately. Solution would be
        //    to shadow the current users (in a project) as a project field.
        //
        [...data.authors, ...data.collaborators].forEach( uid => {
          if (! (uid in userInfo)) {
            const unsub = watchUserInfo(uid, data => {
              console.debug( `CHANGES TO USER ${uid}:`, data );

              vm.userInfo[uid] = data;
            });

            vm._unsubs.push(unsub)
          }
        });

        vm.project = data;   // replace all fields (Vue.js should optimize only changed fields to get reported; if not, re-engineer this) #vuejs
      });

      vm._unsubs.push( unsubscribeProject );
    },
    beforeDestroy: function () {
      const vm = this;
      vm._unsubs.forEach( f => f() );
    }
  }
</script>
