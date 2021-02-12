# Approach

*This doc is to collect a bit more about the approaches taken.*

## Avoid Cloud Function Callables

In the earlier times of the repo, Cloud Function Callables were used for a couple of things. However, they have one huge drawback: they are not available offline.

FireStore is (it caches data), so the approach is to use Cloud Functions only in the background and do all cloud-client data exchange via Firestore.

When, later, we need to do some more real time dataflow, it's either Firebase Realtime Database or a message bus like PubSub. In such a case, we might need to prepare offline awareness ourselves, into the app. `#speculative`

## No data store

Data is stored distributed, in the `Ref`s and `Reactive`s around the code. There did not seem to be a need for a centralized data store, à la Vuex.

## Component naming convention

Vue.js normally uses `like-this` naming for its components.

We reserve that for externally imported web components, and have our own Vue components `LikeThis`.

Externally imported *Vue* components must be white listed.
