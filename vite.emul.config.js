import base from './vite.config.js'

module.exports = { ...base,

  // Run towards the local emulators
  env: {
    DEV_FUNCTIONS_URL: "http://localhost:5001",
    DEV_FIRESTORE_HOST: "localhost:8080"
  }
}
