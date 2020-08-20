/*
* Study on creating Firestore Security Rules as a Scala DSL.
*
* There are projects out there for specific languages since the Firestore Security Rules language remains unnecessarily
* verbose and cryptic, at places. Well, it doesn't even have a name..
*
* This is a try to look if it would be easy to create one, in Scala (which is well capable of implementing DSLs).
*/

// some way to state:
//rules_version = '2';

// A rule for a match -> evaluates to an 'allow' condition
//
class If {
  def apply(): String = ???
}

Rules {
  match("/databases/{database}/documents") {
    match ("/projects/{projectId}") {

      override
      def allowsRead( isAuthor() || isCollaborator() && !isRemoved() )

      override
      def allowsCreate(
        isSignedIn() &&
        validProject() &&
        after.created == serverTime &&
        !isRemovedAfter() &&
        after.auth.uid in after.authors    // creator added as an author (we could go soft on this..)
      )

      override
      def allowsUpdate(
        sAuthor()
        && validProject()
        && (after.created == before.created)
        && ((
          onlyRemovedAdded() && after.removed == serverTime
        ) || (
          onlyRemovedRemoved() && true
        ) || (
          removedUnaffected() && true
        ))
      )
    }
  }

service cloud.firestore {
  match /databases/{database}/documents {

    match /projects/{projectId} {

      function onlyRemovedAdded() {
        return _onlyRemovedAffected() && isRemovedAfter()
      }
      function onlyRemovedRemoved() {
        return _onlyRemovedAffected() && !isRemovedAfter()
      }
      function _onlyRemovedAffected() {
        return request.resource.data.diff(resource.data).affectedKeys() == ["removed"].toSet()
      }

      function removedUnaffected() {
        // Implementation note: if not using '.diff', you must consider the case when there is no '.removed' (it's optional).
        return !("removed" in request.resource.data.diff(resource.data).affectedKeys())
      }

      allow delete: if false        // no deletion via web app

      // Project consistency:
      //  - title (string) may not be empty
      //  - created (timestamp) must exist
      //  - removed (timestamp) is optional; if exists, must be a server time stamp now or in the past
      //  - at least one author must exist
      //  - collaborators can be empty
      //  - users are either in 'authors' or in 'collaborators' (but not in both)
      //
      // Note: To allow reads to use the consistency, it is important to mark server time stamp fields as '<='
      //        instead of '='.
      //
      function validProject() {
        let possibleKeys = ["title", "created", "removed", "authors", "collaborators"].toSet();

        return true
          && request.resource.data.title is string && request.resource.data.title != ''
          && request.resource.data.created is timestamp
          && (!isRemovedAfter() || (request.resource.data.removed <= request.time))
          && request.resource.data.authors is list && request.resource.data.authors.size() > 0
          && request.resource.data.collaborators is list
          && request.resource.data.authors.toSet().intersection( request.resource.data.collaborators.toSet() ).size() == 0
            // no common entries (could also omit this; logic would work even if a user is listed in both)

          && possibleKeys.hasAll( request.resource.data.keys() )        // no unexpected keys
      }

      function isAuthor() {
        return isSignedIn() &&
          request.auth.uid in resource.data.authors
      }

      function isCollaborator() {
        return isSignedIn() &&
          request.auth.uid in resource.data.collaborators
      }

      function isRemoved() {
        return "removed" in resource.data
      }

      function isRemovedAfter() {
        return "removed" in request.resource.data
      }

//--- Visited ---

      // Access cost:
      //    read: 2
      //    write: 2
      //
      match /visited/{userId} {
        // Read:
        //	- all project members can read each other's last visit time
        //
        allow read: if EXT_isCollaboratorOrAuthor()

        // Write:
        //	- only the user themselves can reset their value
        //
        // Note: requiring the 'after' value to be the server time stamp essentially disallows deletes.
        //
        allow write: if EXT_isCollaboratorOrAuthor()   // Q: can this reach the parent document, even without 'get'?
          && validVisited()
          && userId == request.auth.uid
          && request.resource.data.at == request.time

        // Visited consistency:
        //  - 'at' must be a timestamp
        //  - no other fields
        //
        function validVisited() {
          return true
            && (request.resource.data.at is timestamp && request.resource.data.at <= request.time)
            && request.resource.data.keys() == ['at']     // no other fields
        }
      }

//--- Symbols ---

      // Access cost:
      //    read: 2
      //    write: 2
      //
      match /symbols/{symbolId} {
        // Read:
        //  - all members of the project can read
        //
        allow read: if EXT_isCollaboratorOrAuthor()        // anyone (within the project) can read

          // DISABLED since cannot be used with the Online Simulator (see 'git grep Wishes')
          //&& validSymbol()      // guards against bad data in test setup, manual Firestore edits or from earlier schemas

        // Creation:
        //	- the creator needs to claim the symbol to themselves, at creation (we can relax this, if needed)
        //
        allow create: if EXT_isCollaboratorOrAuthor()
          && validSymbol()
          && isClaimedByMeAfter()
          && request.resource.data.claimed.at == request.time

        // Updates:
        //  - can claim a non-claimed symbol
        //  - can do changes to an already claimed symbol
        //  - can revoke the claim
        //  - claim itself cannot be changed; only revoked
        //
        allow update: if EXT_isCollaboratorOrAuthor()
          && validSymbol()
          && ((     // case A: claiming an unclaimed symbol
            !isClaimed() && (
              request.resource.data.claimed.by == request.auth.uid &&		// I make the claim
              request.resource.data.claimed.at == request.time
            )
          ) || (    // case B: changing while claimed
            isClaimedByMe() && (
                request.resource.data.claimed == resource.data.claimed   // unchanged
            )
          ) || (    // case C: revoking the claim
            isClaimedByMe() && (
              !("claimed" in request.resource.data) &&     // claim removed
              onlyClaimedAffected()
            )
          ))

        // Delete:
        //	- can delete a symbol claimed to themselves
        //
        allow delete: if EXT_isCollaboratorOrAuthor()
          && isClaimedByMe()

        function validSymbol() {
          let requiredKeys = ['layer','shape','size','fillColor','center'].toSet();
          let possibleKeys = requiredKeys.union( ['claimed'].toSet() );

          return true
            && (request.resource.data.keys().toSet().hasAll(requiredKeys) &&
                possibleKeys.hasAll(request.resource.data.keys()))
            && request.resource.data.layer is int
            && request.resource.data.shape in ['star']      // enum
            && request.resource.data['size'] > 0
            && request.resource.data.fillColor is string
            && (sameKeys( request.resource.data.center.keys(), ["x","y"] ) &&
               request.resource.data.center.x is number &&
               request.resource.data.center.y is number
            )
            && (!("claimed" in request.resource.data) || (
              sameKeys( request.resource.data.claimed.keys(), ["by","at"] ) &&
              request.resource.data.claimed.by is string &&
              request.resource.data.claimed.at is timestamp     // and <= request.time
            ))
        }

        function isClaimedByMe() {
          return isClaimed() && resource.data.claimed.by == request.auth.uid
        }

        function isClaimed() {
          // Note: 'resource != null' required in the online Rules Playground
          return resource != null && "claimed" in resource.data
        }

        /* not used; REMOVE
        function isClaimedAfter() {
          return "claimed" in request.resource.data
        }*/

        function isClaimedByMeAfter() {
          return request.resource.data.claimed.by == request.auth.uid
        }

        function onlyClaimedAffected() {
          return request.resource.data.diff(resource.data).affectedKeys() == ["claimed"].toSet()
        }
      } // symbols

      // Functions for sub-collections
      //
      // While the 'project' documents can address their 'authors' and 'collaborators' fields directly, sub-collection
      // documents must use 'get'. This also implies an added billing cost for processing those security rules!

      function EXT_isCollaboratorOrAuthor() {
        return isSignedIn() &&
          (request.auth.uid in get( /databases/$(database)/documents/projects/$(projectId) ).data.collaborators ||
           request.auth.uid in get( /databases/$(database)/documents/projects/$(projectId) ).data.authors
          )
      }
    }   // project

//--- Invites ---
//
// Writable by authors and collaborators, to invite new members to a project. From there, Cloud Functions should do all.

    // Access cost:
    //    read: 2
    //    write: 2
    //
    match /invites/{inviteId} {   // inviteId: '<email>:<projectId>'
      // Read:
      //  - only Cloud Functions read invites
      allow read: if false

      // Create:
      //  - any collaborator or author of a project may invite more people
      //  - a previous invite may be overwritten (= extended)
      //
      allow create: if true
      /* REMOVE
        && ((      // if (inviting as author) invitor must be an author (this gets checked again, once the guest turns up)
          request.resource.data.asAuthor && (
            GLOBAL_isAuthor(request.resource.data.project)
          )
        ) || (      // else anyone in the project can invite
          !request.resource.data.asAuthor && (
            GLOBAL_isCollaboratorOrAuthor(request.resource.data.project)
          )
        ))
        */      // if (inviting as author) invitor must be an author (this gets checked again, once the guest turns up)
        && request.resource.data.asAuthor
            ? GLOBAL_isAuthor(request.resource.data.project)
            : GLOBAL_isCollaboratorOrAuthor(request.resource.data.project)      // else anyone in the project can invite
        && validInvite()

      // tbd. if we want to allow extending existing invite, the 'update' rule needs to be opened (a 'set' for an
      //        existing entry observes it).
      allow update: if false

      allow delete: if false
    }

    function validInvite() {
      let requiredKeys = ['email','project','asAuthor','by','at'].toSet();

      return true
        && request.resource.data.keys().toSet() == requiredKeys
        && request.resource.id == request.resource.data.email +":"+ request.resource.data.project	// validate the id schema
        && request.resource.data.email is string
        && request.resource.data.project is string
        && request.resource.data.asAuthor is bool
        && request.resource.data.by == request.auth.uid
        && request.resource.data.at == request.time
    }

//--- User info ---
//
// Fully handled via Cloud Functions

    match /userInfo/{userId} {
      allow read, write: if false
    }

//--- Helpers (just functions) ---

    // Test two lists for having the same set of keys.
    //
    // Note: We cannot simply '==' the lists, it seems. Maybe the order matters in that comparison.
    //
    function sameKeys(a,b) {        // (List, List) => Boolean
      return a.toSet() == b.toSet()
    }

    function isSignedIn() {
      return request.auth != null && request.auth.uid != null;
    }

    // Checking membership in a project from other collections.
    //
    // This variant is to be used for collections outside of the 'projectsC'.
    //
    function GLOBAL_isCollaboratorOrAuthor(projectId) {
      return isSignedIn() && (
        request.auth.uid in get( /databases/$(database)/documents/projects/$(projectId) ).data.collaborators ||
        GLOBAL_isAuthor(projectId)
      )
    }

    function GLOBAL_isAuthor(projectId) {
      return isSignedIn() &&
        request.auth.uid in get( /databases/$(database)/documents/projects/$(projectId) ).data.authors
    }
  } // database
}
