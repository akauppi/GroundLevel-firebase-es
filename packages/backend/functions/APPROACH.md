# Approach

Decided to keep each sub-functionality separate, but responsible for their initialization (i.e. `regionalFunctions.httpsCallable` calls).

This makes for some duplication (compared to having that in `index.js`) but makes each "module" fully readable, from head to top.

