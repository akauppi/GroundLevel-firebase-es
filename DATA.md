# Data

Schemas for the data stored in Firestore.

These follow the collection-document-collection-... way of FireStore.

```
/projects
   /id: (unique string)			<-- identity
   /authors: [ uuid [, ...] ]
   /collaborators [ [uuid [, ...] ]

   /title: string
   /created: date-time		<-- unless Firebase has some built-in way
   /deleted: <date-time>|null		// keep data resurrectable from the database console

   # tbd! Need to read more, to know
   /symbols		<-- collection
      {			// just default doc
			id: (unique, growing integer) <-- identity
			shape: "star"						// potentially more shapes
			size: int
			fill-color: <color-string>
			x: <number>
			y: <number>
		} ]

/users
   /uuid: string		<-- from Firebase auth; identity
   /...

```	

With that, we should be able to:

- list project id's where a user is author, collaborator or either
- get the title and other meta data of a project
- draw the symbols in the project
- observe new symbols being created, re-colored or resized (by others)


*Note: Firebase notifications could be used to inform users if they've been invited to projects etc. - we shouldn't need extra information for that.*


Note: We don't store history. Eventually, we could.

	- i.e. snapshots when people especially save; ability to revert back to earlier snapshots (this does get complex, unless we can merge between snapshots and present diffs...)

