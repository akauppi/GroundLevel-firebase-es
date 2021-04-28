/*
* cypress/users/index.js
*
* Users used in tests (cypress/integration).
*/
const users = [
  {
    uid: "joe",
    displayName: "Joe D.",
    photoURL: "https://i.pinimg.com/originals/2b/59/6d/2b596d481a2296297d8098e09bfd44e5.jpg"
  },
  {
    uid: "william",
    displayName: "William Dalton",
    photoURL: "https://pbs.twimg.com/profile_images/508788470479720449/GagopTx-_400x400.png"
  }
]

const joe = users.find( x => x.uid === 'joe' );

export { users, joe }
