/*
* vite-and-roll/rollupConfig.js
*
* Common Rollup configuration for pure Rollup and Vite builds (Rollup underneath).
*/
import {readdirSync} from "fs";

// NOTE: Might not be needed any more (Firebase 9.0.0-beta.7)
/*
* List the '@firebase/auth', '@firebase/app', ... subpackages, so that access to *any* of those is deduplicated
* (cannot give a regex to dedupe).
*/
const dedupe = [
  ...readdirSync("./node_modules/@firebase").map( x => `@firebase/${x}` )
];

export {
  dedupe
}
