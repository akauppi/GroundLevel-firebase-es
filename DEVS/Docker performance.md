# Docker performance! 

Some notes about the Docker parameter's effects on test excution times, so you can tune your settings to be meaningful.

Docker configuration matters for Firebase emulator startup times (for Cloud Functions; not so for Firestore). 

>NOTE: This *only* matters when the Docker image is freshly started. If you leave it running in the background, having less resources may be completely fine.

*Measurements on Mac Mini 2018 (i3, 16GB, 4 cores).*

## Docker cold (first run)

| RAM | longest test (2 cores) | (1 core) |
|-----|---------------|-------------------|
| 1GB | 5838, 5135 ms | > 8000 ms (timeout), 7179 ms |
| 2GB | 7089, 7876 ms | 6429, 6317 ms |
| 2.5GB | **4211, 4666 ms** | 6295, 6198 ms |
| 3GB | 4488, 4483, 4865, 4667 ms | 6399, 6431 ms |
| 4GB | 4560, 4779 ms |

2.5GB, 2 cores seems optimal

Native (no Docker):

| longest test |
|---|
| 1381, 1211 ms |

## Docker warm (subsequent runs)

| RAM | longest test (2 cores) | (1 core) |
|-----|---------------|-------------------|
| 1GB | 361, 295 ms |
| 2GB | 311, 294 ms | 330, 356 ms |
| 3GB | 320, 325 ms | 351, 315 ms |

Native:

| longest test |
|---|
| 295, 375 ms |
