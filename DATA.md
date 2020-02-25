# Data

Schemas for the data stored in Firestore.

These follow the collection-document-collection-... way of FireStore. Collections are marked with `C <id-type>`.

```
/projects:C <project-id: automatic>
   /title: string
   /created: time-stamp		<-- unless Firebase has some built-in way
   [/deleted: time-stamp]		// keep data resurrectable from the database console
	/access: {
		<uid>: "author"|"collaborator"
	}	
	/last-used: {
		<uid>: time-stamp		// when a user last opened the project (*)
	}	
   /symbols:C <automatic-id>
      {
      		layer: int
			shape: "star"						// potentially more shapes
			size: int
			fill-color: <color-string>
			x: <number>		// coordinates of the star's center
			y: <number>
      }
   /layer-range: { min: int, max: int }

/users:C <uid>		// user id from Firebase auth
   /photo: bytes		<-- JPEG, PNG etc. (max. 1MB-89 bytes)
```	

(*) Having your user-id here doesn't mean access rights. They are provided by the `authors` and `collaborators` arrays.

With that, we should be able to:

- list project id's where a user is author, collaborator or either
- get the title and other meta data of a project
- draw the symbols in the project
- observe new symbols being created, re-colored or resized (by others)


*Note: Firebase notifications could be used to inform users if they've been invited to projects etc. - we shouldn't need extra information for that.*


Note: We don't store history. Eventually, we could.

- i.e. snapshots when people especially save; ability to revert back to earlier snapshots (this does get complex, unless we can merge between snapshots and present diffs...)

