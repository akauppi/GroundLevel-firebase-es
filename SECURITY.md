# Security

## Development security

By using CI/CD for production deployments, and a Docker container for manual ones (staging), you don't need to log in to Firebase cloud services, from your general use (development) account.

If you think of how many `npm` packages there are, or other software, that could run the `firebase` command without your knowing... why would you leave yourself logged into there. But most developers likely do - it's convenient.

Also, unlike eg. `npm publish` which asks for a "OTP" (one time password, from eg. Google Authenticator) for *each* deployment, for some reason Firebase CLI doesn't. You need to manually log out - which we don't?

### What about `gcloud`?

`gcloud` still remains in use (in the `ci` portion). The author hasn't felt the need to dockerize it away, though this could be done. 

Then again, he uses it exclusively for communicating with the `ci-builder` GCP project, and that project does not have deployment rights. Thus, this should be ok.

### Why the paranoia?

Why not? 

By thinking about these things pro-actively, we reduce the chance of *bad things* happening to the product that the developers use dear hours to build and operate. The solution tries to be such that it *does not introduce friction* to your development processes (i.e. slow you down).

This helps bigger companies. Ability to push changes via GitHub (where they can be peer reviewed) is better than needing to provide each developer (or some of them?) deployment rights.

---

**Please suggest changes to this text in the GitHub Issues / Discussions if you feel it could be shorter / stronger / better...**