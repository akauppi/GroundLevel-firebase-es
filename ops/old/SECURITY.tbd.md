<!--
This belongs in the "ops" category that can have a section on hardening app security..

- App check etc.
-->

### Security note

Firebase web apps use certain access keys to identify themselves to the backend. Firebase hosting provides them at `/__/firebase/init.js[on]`. Those values (API key and App id) are not exactly secret. This repo has been created in a way that you don't need to store them in the version control, but they are visible for anyone having access to your web app.

The guidance on how to deal with these values varies between Firebase and Google Identity Platform (superset of Firebase Auth):

- [Learn about using and managing API keys for Firebase](https://firebase.google.com/docs/projects/api-keys) (Firebase docs)
- Google Identity Platform: [Using API keys](https://cloud.google.com/docs/authentication/api-keys) (Google Cloud docs)

   The author restricted their API key by:
   1. Google Cloud console > `APIs & Services` > `Credentials` > `API Keys` > `Browser key (auto created by Firebase)` (click)
   3. `API Restrictions` > `Restrict key` > `[x] Identity Toolkit API`

   >![](.images/gip-api-restriction.png)


