# Approach

## Why place temporary files in the current directory?

1. Firestore was tried, earlier, but code needed to listen to it was unnecessarily complex (compared to file system). Also, it needed adding `firebase-admin` as a direct dependency.

2. `node_modules` isn't necessarily writable (in CI, depending on how the installation step was done)

3. `/tmp/` would be smooth, but not common between the DC containers.

