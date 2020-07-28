# Data

## Schemas

Schemas for the data stored in Firestore.

<!-- tbd. Once the Wiki page is up

Data modeling in Firestore is a balancing act between competing concerns: billing, transmission bandwidth, ability to create security rules (at least). 

There's a [wiki write](wiki write) about these concerns, regarding this data design. Check it out. :)
-->

Collections are marked with `C <id-type>`.

### Projects

```
/projects:C <project-id: automatic>
   /title: string
   /created: time-stamp
   [/removed: time-stamp] 	// keep data resurrectable from the database console for a while; who removed is in the logs

   /authors: array of <uid> (>=1)
   /collaborators: array of <uid> (>=0)

   /visited:C <uid>
      /at: timestamp 

   /symbols:C <symbol-id: automatic> 
      /layer: int
      /shape: "star"      // potentially more shapes
      /size: int
      /fillColor: <color-string>
      /center: { x: <number>, y: <number> }
      [/claimed: { by: uid, at: timestamp }]

   /userInfo:C <uid>   // shadow from main /userInfo:C
      /name: string
      /photoURL: string
```

The design of the above data model has been tedious. There are so many ways one can model such data, but only few that match the way Firebase works. Let's discuss the design, briefly.

- `/project:C` has the main "meta" fields for the project. These don't change very often.

- `/visited:C` is placed as a subcollection since it can change rather frequently (each time someone opens the particular project). If we had it at the main collection, such a change would cause unnessary updates to all other current viewers.

   Of course.. if you *want* to be informed when someone joins the project online, that's another issue, but we'll likely do it via Firebase messaging, not the database tables.

- `/authors` and `/collaborators` are in the main document. This is mainly because they are crucial for the access rights of the project and having them in the same document reduces the cost of Security Rules checks. This may change, though (there may be reasons to place them in subcollections). 

- `/symbols:C` is a subcollection and each symbol on the infinite canvas is its own document. 

   This is because there may be a lot of symbols (1000's) and updating an array could turn out difficult.
   
   `/claimed` is a field of the particular symbol, not a collection. This helps keep the access right rules of a symbol document easy, since the necessary data is right there with the symbol.
   
   The idea is to ban simultaneous editing (moving, resizing) of a symbol by multiple people. There needs to be a Cloud Function that makes such claims expire, if the editor does not release them.
   
I wrote these **before** actually implementing the data model.  Had tossed different points of view for ages, and of course also started to craft queries, and security rules.

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
   /name: string
   /photoURL: string
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

>Note: If you only have application-wide admin roles, using "custom user claims" (data carried within the authentication token) may be the better approach. See [here](https://medium.com/@gaute.meek/firestore-and-security-1d77812715c1) (blog, Nov 2018)

The rest of the access roles can be seen in the `firestore.rules` implementation; they should be obvious.


## Use cases

The use cases can be seen in the `src/queries.js` file, in source code. :)


