/*
* init/__.js
*
* Fetch Firebase config from Firebase hosting.
*/
const firebaseProm = (async _ => {    // Promise of { type: 'firebase', apiKey, appId, projectId, authDomain }

  // Note: Browsers don't dynamically 'import' a JSON (Chrome 85)
  //const json = await import('/__/firebase/init.json');    // NOPE

  return await fetch('/__/firebase/init.json').then(resp => {
    if (!resp.ok) {
      throw new Error(`Unable to fetch '/__/firebase/init.json':\n${{status: resp.status, message: resp.body}}`);
    } else {
      return resp.json();   // Promise of ... ('.then' merges it)
    }
  });
})();

export {
  firebaseProm
}
