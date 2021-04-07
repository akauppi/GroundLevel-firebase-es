# Setting up a Firebase project

This page shows how to create a Firebase project that you'll need for being able to deploy to the cloud.

This project includes:

- authentication
- Cloud Firestore (a database)
- Cloud Functions (background logic)

## Choose Blaze plan

For Cloud Functions to work, you need a "Blaze" account. This involves giving credit card information, but it does not necessarily incur costs. The free quotas of Firebase are generous. See [Firebase pricing plans](https://firebase.google.com/pricing).

## Set up a Firebase project

<!-- tbd. pictures, one day -->

- Create a project in the [Firebase console](https://console.firebase.google.com/)
	- Disable Google Analytics - you don't need it and can activate it later
   - Register an app (needed for authentication)
     - enable hosting

>Hint: You can use a date postfix for the project name, eg. `test-060421`. This way you'll always see when something was created and it makes it easier to recycle projects.

While Google Analytics sounds tempting:

>Google Analytics is a free and unlimited analytics solution that enables targeting, reporting, and more in Firebase Crashlytics, Cloud Messaging, In-App Messaging, Remote Config, A/B Testing, Predictions, and Cloud Functions.

..we don't need it in this project. Most of the products mentioned are more useful (or only available) for mobile clients; eg. Crashlytics is not available for web apps (as of Apr 2021). It adds to complexity and the author steers clear of things where "Google" and "analytics" occur in the same sentence.


### Authentication

Choose Google and anonymous as the authentication providers[^1]

[^1]: The authentication UI library we use does not currently support all authentication providers that Firebase does.

### Cloud Firestore

For security rules, pick "Start in production mode" (default). We have security rules already set up. 

For location, pick one near to you (your users). Prefer "regional" over "multi-region": you don't need the additional robustness just yet. 😉

>You can see what the locations mean [here](https://firebase.google.com/docs/firestore/locations). Eg. `europe-west6` is Zürich.

<p align=right><a href="./README.md#back">Back to README</a></p>
