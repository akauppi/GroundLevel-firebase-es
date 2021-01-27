# Data

## Schemas

Schemas for the data stored in Firestore.

Collections are marked with `C <id-type>`.

### Terminology  

- collaborator: a member who is not an admin

### Projects

```
/projects:C <project-id: automatic>
   /title: string
   /created: time-stamp
   [/removed: time-stamp] 	// keep data resurrectable from the database console for a while; who removed is in the logs

   /authors: array of <uid> (>=1)
   /members: array of <uid> (>=1); includes all authors

   /symbols:C <symbol-id: automatic> 
      /layer: int
      /shape: "star"      // potentially more shapes
      /size: int
      /fillColor: <color-string>
      /center: { x: <number>, y: <number> }
      [/claimed: { by: uid, at: timestamp }]

   /userInfo:C <uid>   // shadow from main /userInfo:C
      /displayName: string
      /photoURL: string
      /lastActive: time-stamp
      /name: string		// DEPRECATED: data may contain this; use 'displayName' for new writes
```

There are so many ways one can model such data, but only few that match the way Firebase works. Let's discuss the design, briefly.

- `/project:C` is the root collection. It has the main "meta" fields for the project. These don't change very often.

  - `/authors` and `/members` are in the main document. This is mainly because they are crucial for the access rights of the project and having them in the same document reduces the cost of Security Rules checks. This may change, though (there may be reasons to place them in subcollections). 

- `/symbols:C` is a subcollection and each symbol on the infinite canvas is its own document. 

   This is because there may be a lot of symbols (1000's) and updating an array could turn out difficult.
   
   `/claimed` is a field of the particular symbol, not a collection. This helps keep the access right rules of a symbol document easy, since the necessary data is right there with the symbol.
   
   The idea is to ban simultaneous editing (moving, resizing) of a symbol by multiple people. There needs to be a Cloud Function that makes such claims expire, if the editor does not release them.

- `/userInfo:C` provides information on other members in a project. It's partly filled (`displayName`, `photoURL`) by Cloud Functions, duplicating from the main `userInfo` collection, which clients write to. Partly it's filled directly (`lastActive`), by clients.

Seems getting to good data modeling in Firebase needs experience. Hopefully this description helps you speed up that learning curve. It might be a very instinctive process, in the end... Good luck!! 🍀


### Invites

Some collections were completely cut off from the above.

```
/invites:C <email>_<project-id>
   /email: string
   /project: project-id
   /asAuthor: boolean
   /by: uid
   /at: timestamp
```

This is intended to keep track of invited people - who might not even have a Firebase user id at the time of the invite. An active invite allows access to a project.

The id is formed from the email and the project id, together. This makes sure that for each person-project combination, there is at most one invite.

A Cloud Function should be made, to occasionally clean away expired invites (there's no benefit in cleaning away an invite after use, or even marking it as used - it can wait for such expiry cycle).


### User info

```
/userInfo:C <uid>
   /displayName: string
   /photoURL: string
   /name: string		// DEPRECATED in favor of 'displayName'; earlier data may have this.
```

Users have write access to update their user information. This can be made e.g. adjacent each login.

This info is then shadowed to all projects where the user is an active member, and other users (of the same project) get access to the info via these shadow tables (name and photo).

The idea is that user information changes get propagated to all projects.


<!-- not yet
### Settings

```
/settings:C <uid>
```

User-specific settings that span all projects are to be stored in this collection.

- colors assigned to other users (same color would identify them in all projects)
-->


## Access roles

The authors are able to (and collaborators are not):

- change the title of a project
- invite new people to the project (as collaborators or authors)
- close the project

If the project is closed, its `removed` field is set to the closing date. Such project can be resurrected manually, from the Firestore console, or completely removed once a certain grace period has passed by.

>Note: If you have application-wide admin roles (not project specific), using "custom user claims" (data carried within the authentication token) may be the better approach. See [here](https://medium.com/@gaute.meek/firestore-and-security-1d77812715c1) (blog, Nov 2018)

The rest of the access roles can be seen in the `firestore.rules` implementation; they should be obvious.


