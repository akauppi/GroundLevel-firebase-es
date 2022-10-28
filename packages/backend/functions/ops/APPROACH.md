# Approach

## Keeping Prom and Loki bridges separate

They drive two different APIs. But this also allows us to separately determine the interval we want things to be shipped. Logs might benefit from more real-time schedule than metrics.

