/*
* src/central/ship.js
*
* Creation of the worker for shipping logs and counters.
*/
import { getApp } from '@firebase/app'

let myWorker;

/*
* To be called _after_ Firebase app is initialized.
*/
function lazyInit() {   // () => Worker
  return myWorker = myWorker || (_ => {
    // Pick Firebase app information, to be passed to the Worker.
    //
    // Note: The values may be available as 'meta.import.env.VITE_...' as well, but reading it like this keeps us
    //    a bit detached from the way the app is built.
    //
    const fah = getApp();
    const {
      apiKey,
      projectId,
      locationId    // available if 'main.js' has placed it at initialization
    } = fah.options;

    const worker = new Worker(new URL('./ship.worker.js', import.meta.url), {
      type: 'module'    // fails 'npm run build' if this is here
    });

    worker.postMessage({ "":"init",
      apiKey,
      projectId,
      locationId
    });

    return worker;
  })();
}

function queue(o) {   // ({ "": "log"|"inc", ... }) => ()
  const worker = lazyInit();

  worker.postMessage(o);
}

export {
  queue
}
