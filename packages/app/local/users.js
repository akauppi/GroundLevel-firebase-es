/*
* local/users.js
*
* Users for 'npm run dev[:local]'.
*/

// Emojies from -> https://icons.getbootstrap.com

// Emoji asterisk
//const urlAsterisk ="data:image/svg+xml,%3Csvg width='1em' height='1em' viewBox='0 0 16 16' class='bi bi-asterisk' fill='currentColor' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' d='M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1z'/%3E%3C/svg%3E";

// Unfortunately, Firebase auth dislikes data URLs (though they are valid URLs). Using one:
//  <<
//    FirebaseAuthError: The photoURL field must be a valid URL.
//  <<
//
// firebase-tools 8.13.0
// firebase       7.24.0
//
// - [ ] #help Report to Firebase? A data URL is a valid URL (at the very least, the error message could be revised).
//
// Work-around:
//    We could host the files, as .svg, but it easily messes with the logging (port 5050) or packaging for delivery.
//    Not worth it.
//
//    We could find a stable URL online that hosts a suitable icon.

const users = {
  dev: {
    displayName: 'Just Me',
    //photoURL: urlAsterisk

    // Note: due to our (own) back-end data model rules, we must provide some photo URL
    photoURL: "https://no.such.domain"
  }
};

export { users }
