# Need for Staging

>*"... the Cloud Functions emulator does not support background functions triggered by Auth or Cloud Storage for Firebase"* <sub>[source](https://firebase.google.com/docs/emulator-suite)</sub>

If applying auth triggers to your application, this means one cannot test it in the emulator.

That's fair. There are likely other reasons why you'd prefer to run a staging deployment as well.
