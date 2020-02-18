# Firebase tips


## Use creation date in the project id

Firebase automatically appends a uniqueness id to your project id (e.g. `mysome-5342`). You can edit this to your liking, and using `DDMMYY` format may provide extra benefit to a random number:

- you know when you created it (how stale it is)
- if you end up creating multiple projects for the same thing, it helps keep log

While you *can* likely get this info from elsewhere, why not just make randomness work for you. :)

