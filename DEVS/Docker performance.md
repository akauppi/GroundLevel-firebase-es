# Docker performance

Ideally, running the backend under Docker would give the same performance as running it natively. 

This is not the case. Both launching the Firebase Emulators is slower (13..16s vs. 5..6s) as well as running the tests. With Docker, things time out more often.

*Why are we still doing this?*

The idea that build systems can be defined in code is great. Less or no "but it works on my device/OS".. More repeatable. Also safer.

We *hope* that the difference would be around 10% - that seems acceptable.

This file has some experiences to help you tune your Docker parameters - and maybe help troubleshoot if you get Docker stuck.

We *continue* to use Docker as the main tool development.


## Author's system

Mac Mini i3 2018, 16 GB, macOS 11.4

|| Cores | GB |`npm run start` (until ports open)|`npm run test:rules:all`|`npm run test:fns:all`|
|---|---|---|---|---|---|
|Docker|1|1.5|14.3, 12.6 s|7.498, 5.999, 5.657 s|<font color=red>timeout (> 2000ms)</font>, 2.086, 2.064 s|
|native|4|16|10.4, 9.3 s|7.137, 4.672, 4.774 s|3.517, 2.027, 2.019 s|

*Test times are the ones reported by Jest.
Service startup times measured manually.*

Lenovo ThinkPad Core i7-3520M, 12 GB, Windows 10 + WSL2

|| Cores | GB |`npm run start` (until ports open)|`npm run test:rules:all`|`npm run test:fns:all`|
|---|---|---|---|---|---|
|Docker|(2)|(12)|11.3, 10.6 s|7.411, 6.37, 5.772 s|timeout (> 2000ms), timeout (> 2000ms)|
|native(**)|2|12|5.9, 5.9 s|7.921, 6.888, 6.311 s|1.065, 1.431, 1.431 s|

>NOTE: It's important you have the git clone in WSL2 filesystem, not on `/mnt/c/` or something. Having the files on Windows file system side drops performance to a crawl (x3 worse, with Docker Desktop 3.3.x).

*(\*): The results were taken with a similar project (`firebase-jest-testing`). For some reason, the author wasn't able to launch the emulators natively, but Docker worked. This in itself shows the benefit of dockerizing the toolchain - independence of local weather conditions. ⛈*

*Changing cpu count and allocated memory is under WSL2 settings, in Docker Desktop for Windows. Didn't tweak with those - using all the power of the machine.*


<!-- hidden (stated it above)
>**Windows users:**
>
>If you have dismal performance, check that the source code folder is not on (or linked to) `/mnt/c`. Use a real WSL2 folder instead, as adviced in Docker Desktop WSL2 backend > [Best practices](https://docs.docker.com/docker-for-windows/wsl/#best-practices):
>
> *To get the best out of the file system performance when bind-mounting files, we recommend storing source code and other data ... in the Linux file system, rather than the Windows file system.*
-->

## If you cannot use Docker

Only the Docker guidance is in the docs, but you can use the CI-targeted commands for development as well (consider this stable but "undocumented" - we might change it).

Requirements:

- Java JRE
- `firebase-tools` globally installed

||instead of|use this|
|---|---|---|
|backend|`npm run start`|`npm run ci:start`|
||`npm test`|`npm run ci`|
|app|`npm run dev`|`npm run ci:dev`|

Other commands (like `npm run test:rules:all` and `cypress run`/`npm test` for the app) are unchanged (both open the same ports).

You might find it more appropriate to develop in this CI fashion, but we're working on making the Docker experience *almost* equally good (10% margin).
