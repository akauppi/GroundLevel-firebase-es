# Track

## Deploying v2 scheduled functions

Created a separate [repo](https://github.com/akauppi/cfv2-deploy-311022) to study and report the deployment problems.

- `firebase-functions` issues:
   - [ ] ["CPU control of httpsCallable's doesn't seem to work (CPU < 1)"](https://github.com/firebase/firebase-functions/issues/1288)

      >[...] only reproduces if "concurrency" isn't explicitly set. To unblock yourself for now, set concurrency to 1. For the future we're looking at making this automatic instead of erroring out.

      I read that as: We're not really interested... (since he also closed the issue). Keep an eye on it, reopen in ~2024 if still happens.

<!--      
   - [ ] ["[Beta] Unable to deploy CF v2 scheduled function to `europe-north1`, `europe-west4` regions"](https://github.com/firebase/firebase-functions/issues/1293)
-->

- Firebase CLI (`firebase-tools`):
   - [ ] ["Deployment under Docker fails if firebase-debug.log is mapped to host"](https://github.com/firebase/firebase-tools/issues/5177)
