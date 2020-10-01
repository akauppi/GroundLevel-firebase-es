/*
* /ops-config.js
*
* Operational configuration. Selects which services are used.
*/
const firebase = {
  type: 'firebase'
};

const ops = {
  perf: [firebase],
  logs: [],   // [airbrake],   // DISABLED: Airbrake not up to it
  crash: []   // [airbrake]    // DISABLED
};

export { ops }
