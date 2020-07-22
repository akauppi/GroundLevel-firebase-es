/*
* src/refs/projectMembers.js
*
* Watch members of a certain project, and provide UI information about them.
*  - reflect new/left members
*  - fetch more information about the members (changes to this info are not real time, since they change seldom and are not critical)
*  - some added fields ('.isAuthor'), adapting the database model (UI does not need to know of the '.authors', '.collaborators').
*
* Used by:
*   - Project page
*/

import {computed, shallowReactive, watch} from "vue";
import {userUIinfoProm} from "../firebase/calls";

// Note: Seems Vue.js (3.0.0-beta.20) doesn't work with async 'computed'. We'll use watch and imperative setting, instead.

/*
* Sets 'members', with a potential delay (if fetching UI info is needed), when 'project.authors' or 'project.collaborators' change
*
* The returned 'reactive' contains information of the members of the current project, and may contain info of people
* who have recently (while the web page is open) been in the project (if people leave, their info is not cleared, other
* parts of the app just won't need it).
*/
function membersGen(projectId, project) {   // (string, reactive of { ...projectC-fields }) => shallowReactive of Map({ <uid>: { ..userInfoC-fields, isAuthor: boolean } }

  /***
   //WHAT IF: computed async
   const membersProm = computed(async () => {  // () => Array of { _id: string, isAuthor: boolean, ..userInfoC-fields }

        const arr = [...project.authors.map(uid => ({_id: uid, isAuthor: true})),
                     ...project.collaborators.map(uid => ({_id: uid, isAuthor: false}))
        ];

        console.debug("Arr:", arr);

        // Complete with information from the 'userInfo' collection (cached).
        //
        const proms= arr.map( async o => {
          const o2 = await userUIinfo(projectId, o._id);   // { ..userInfoC-fields }
          return {...o2, ...o};
        });

        return await Promise.all(proms).then( x => { console.log(`User info of ${x._id}:`, x); return x; });
      });
   ***/

  //***WHAT IF: reactive + watch
  const members = shallowReactive( new Map() );    // { <uid>: { ..userInfoC-fields, isAuthor: boolean } }

  watch( async () => {  // () => Promise of ()
    if (Object.keys(project).length == 0) {   // no active project
      members.clear();
      return;
    }

    const uids = [...project.authors, ...project.collaborators];
    console.debug("Members update uids:", uids);

    const newUids = [];
    for (const uid of uids) {
      if (members[uid]) {
        members[uid].isAuthor = uid in project.authors;   // maintain author/collaborator status of existing entries
      } else {
        newUids.push(uid);    // will fetch this
      }
    }

    // Fetch the username, picture of new entries.
    //
    // Note: This is an effort to keep using Firestore function calls low, but if we make one call pass multiple
    //    users' info, we could refresh everyone. Maybe it's simplest not to do that though (refresh updates).
    //
    if (newUids.length > 0) {
      const info = await fnUserInfo(projectId, newUids);  // { <uid>: { ..userInfoC-fields }

      for (const uid of newUids) {
        ...
      }
    }


    const proms = uids.map( async uid => {    // Array of Promise of [<uid>, {..userInfoC-fields, isAuthor: boolean}]

      const tmp = was.hasOwnProperty(uid) ? was[uid] : await userUIinfoProm(projectId, uid);
      return [uid, {...tmp, isAuthor: !! project.authors[uid]}];
    });

    const all = await Promise.all(proms);
    const o = Object.fromEntries(all);

    console.debug("Setting members:", o);
    Object.assign(members, o);    // replace earlier values

    console.debug("MEMBERS after setting:", members);
  });
  //***/

  watch( () => {  // DEBUG
    console.log("MEMBERS changed:", members);
  });

  return members;
}

export {
  membersGen
}

