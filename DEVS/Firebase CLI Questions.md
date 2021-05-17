# Firebase CLI Questions

## Are the same Security Rules applied to all Firestore projects?

One can have multiple database instances, by using different project ids.

With this in `firebase.json` - does it apply equally to all of them?

```
{
  "firestore": {
    "rules": "path/firestore.rules"
  },
  ...
```
