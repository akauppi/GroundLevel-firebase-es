/*
* src/utils/reactiveObj.js
*
* This module provides a *custom* reactive queue interface for objects, *built* on Vue.js 3 'reactive' (or 'shallowReactive'),
* but not exposing its interface to the caller. This allow us to keep internal logic "free" of Vue.js influences
* (seeing it foremost as a UI framework), yet benefit from having implementations ready, without bringing in extra
* libraries (such as RxJS -> https://www.learnrxjs.io).
*
* Alternatives considered:
*   - Vue.js 3 'ref'
*   - Vue.js 3 'reactive' directly
*   - Async generators (but don't support multiple subscribers)
*   - RxJS (added dependency)
*/

import { shadowReactive } from 'vue'

const reactiveObj = undefined

export {
  reactiveObj
}

