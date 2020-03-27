# Firebase tips


## Use creation date in the project id

Firebase automatically appends a uniqueness id to your project id (e.g. `mysome-5342`). You can edit this to your liking, and using `DDMMYY` format may provide extra benefit to a random number:

- you know when you created it (how stale it is)
- if you end up creating multiple projects for the same thing, it helps keep log

While you *can* likely get this info from elsewhere, why not just make randomness work for you. :)


## Firestore: use array/object or a collection?

Firestore works on the document-collection-document-... pattern ([Cloud Firestore Data model](https://firebase.google.com/docs/firestore/data-model)).

One can express a dataset either within a document, or as a combination of documents and subcollections. Here are the pros/cons of both approaches:

### Within a document

Pros:

- Simple, traditional.
- May be cheaper: access is charged by documents read, and access to multiple fields of a single document counts as 1 read. This may be the strongest reason to avoid splitting data to sub-collections.

Cons:

- ...

### As sub-collections

Pros:
- ...

Cons:
- ...


### Quotes

>Don't add subcollections unless you need it. I only add them when there is a large amount of related data that does not need to be pulled Everytime I retrieve root data.<sub>[source](https://www.reddit.com/r/Firebase/comments/bi45dr/firestore_is_there_any_good_reason_to_use/)</sub>

>You can't currently [2019] query across subcollections, but this feature is planned for the future.  When it is launched, it should make subcollections significantly more useful.<sub>[source](https://www.reddit.com/r/Firebase/comments/bi45dr/firestore_is_there_any_good_reason_to_use/)</sub>


>I use them [sub-collections] when I have lists of notifications for users. So there will be a users collection, and a notifications subcollection for each user.<sub>[source](https://www.reddit.com/r/Firebase/comments/bi45dr/firestore_is_there_any_good_reason_to_use/)</sub>


## Syntax highlighting of Security Rules on IntelliJ IDEs (kind of...)

See [this answer](https://stackoverflow.com/questions/46600491/what-is-the-name-of-the-language-used-for-cloud-firestore-security-rules/60848863#60848863) (StackOverflow) about setting up "file type associations" in IntelliJ IDEA - may also work in WebStorm.

In addition, set to 2 spaces:


