/*
* local/users.js
*/
const users = {
  "dev": {
    displayName: 'Just Me',
    //photoURL: "data:image/svg+xml,%3Csvg width='1em' height='1em' viewBox='0 0 16 16' class='bi bi-asterisk' fill='currentColor' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' d='M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1z'/%3E%3C/svg%3E";
    // Won't work - Firebase doesn't like data URLs

    // Note: due to our own back-end data model rules, provide some photo URL
    photoURL: "https://no.such.domain"
  }
};

export { users }
