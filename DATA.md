# Data

Schemas for the data stored in Firestore.

Collections are marked with `C <id-type>`.

```
/projects:C <project-id: automatic>
   /title: string
   /created: time-stamp
   /authors: [ <uid> [, ...] ]
   /collaborators: [ <uid> [, ...] ]		// includes people in 'authors'
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
   
/trashed-projects:C <project-id>
   # fields like with 'projects'; this is the grave yard but documents can be lifted back, if needed   
   # +:
   /deleted: time-stamp		// keep data resurrectable from the database console (also easy to flush such separate collection)
```	

(*) Having your user-id here doesn't mean access rights. They are provided by the `authors` and `collaborators` arrays.

The `collaborators` field is used for access control (ability to open the project, work on it, and invite collaborators). 

The `authors` are able to e.g. close the project.

>Note: Authors *must* be included also as collaborators! Wasn't able to do Firestore fetches for "project where <uid> is either in the `collaborators` array or in the `authors` array.

With this data schema, we should be able to:

- list project id's where a user is author, collaborator or either
- get the title and other meta data of a project
- draw the symbols in the project
- observe new symbols being created, re-colored or resized (by others)


*Note: Firebase notifications could be used to inform users if they've been invited to projects etc. - we shouldn't need extra information for that.*


Note: We don't store history. Eventually, we could.

- i.e. snapshots when people especially save; ability to revert back to earlier snapshots (this does get complex, unless we can merge between snapshots and present diffs...)

