# Setting up a Firebase project

This page shows how to create a Firebase project that you'll need for being able to deploy to the cloud.

This project includes:

- authentication
- Cloud Firestore (a database)
- Cloud Functions (background logic)

## Choose Blaze plan

For Cloud Functions to work, you need a "Blaze" account. This involves giving credit card information, but it does not necessarily incur costs. The free quotas of Firebase are generous. See [Firebase pricing plans](https://firebase.google.com/pricing).

## Set up a Firebase project

>Note: We'll come back with more pictures, one day.

- Create a project in the [Firebase console](https://console.firebase.google.com/)
	- leave Google Analytics unchecked (you can activate it later) 
   - register an app (needed for authentication)
   - enable hosting, authentication, Cloud Firestore and Cloud Functions

### Authentication

Choose Google and anonymous as the authentication providers[^1]

[^1]: The authentication UI library we use does not currently support all authentication providers that Firebase does.

### Cloud Firestore

For security rules, pick "Start in production mode" (default). We have security rules already set up. 

For location, pick one near to you (your users). Prefer "regional" over "multi-region": you don't need the additional robustness just yet. 😉

>You can see what the locations mean [here](https://firebase.google.com/docs/firestore/locations). Eg. `europe-west6` is Zürich.

<p align=right><a href="./README.md#back">Back to README</a></p>
