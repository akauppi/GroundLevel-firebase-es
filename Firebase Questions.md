# Firebase questions

## Can I use document field `.authors` in security rules?

Likely not.

The original data schema would have:

```
/projects:C <project-id>
   /authors: [<uid> [, ...]]
   ...
```

Think so: We cannot check (for writing to other fields of a project document), whether `request.auth.uid` is included in `{project}.authors`.

But making the `authors` a collection - or just users a collection, we can.


