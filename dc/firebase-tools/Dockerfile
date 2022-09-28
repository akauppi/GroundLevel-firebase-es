#
# Dockerfile for Firebase CLI
#
# Used by:
#   - first/ (manual deployments)
#
# Provides:
#   - 'firebase' CLI
#
# Note:
#   Cloud Build requires that the builder image has 'root' rights; not a dedicated user.
#   Otherwise, one gets all kinds of access right errors with '/builders/home/.npm' and related files.
#
#   This is fine. There is no damage or risk, leaving the builder image with root. Some lines are left permanently
#   disabled, marked as '#|'.
#
# References:
#   - Best practices for writing Dockerfiles
#       -> https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
#
FROM node:16-alpine AS firebase-cli

# Different users override this with a version they prefer.
ARG FIREBASE_TOOLS_VERSION=999.9.9

# Suppress npm update announcements
RUN npm config set update-notifier false

RUN apk --no-cache add openjdk11-jre-headless

# Install 'firebase-tools' in the way that allows us to declare the version.
#
# '--ignore-optional' eliminates warnings on 'gyp'
#
RUN yarn global add --ignore-optional firebase-tools@${FIREBASE_TOOLS_VERSION} \
  && yarn cache clean
  #
  # Note: The installation approach from Firebase docs does not allow stating the version:
  #   'curl -sL https://firebase.tools | bash'

# Don't define an 'ENTRYPOINT' since the caller runs a shell command.

#--- Emulators ---
#
# Spice in by preloading certain emulators.
#
#   - Realtime database
#   - Firestore
#   - Storage
#   - Pub/Sub
#   - Emulator UI   (not needed in CI; include this for Docker-based development)
#
# NOTE: Even if you don't cache the simulator, you can use the image for those products. They'll just download a
#   necessary binary, on each run.
#
# NOTE: The caching goes to '/root/.cache/firebase/emulators', under the home of this image.
#   Cloud Build (as of 27-Mar-21) does NOT respect the image's home, but places one in '/builder/home', instead.
#   More importantly, it seems to overwrite existing '/builder/home' contents, not allowing us to prepopulate.
#
FROM firebase-cli AS firebase-emulators

# Note: Adding as separate layers, with least changing first.
#
RUN firebase setup:emulators:database
RUN firebase setup:emulators:firestore
#RUN firebase setup:emulators:storage
#RUN firebase setup:emulators:pubsub \
#  && rm /root/.cache/firebase/emulators/pubsub-emulator*.zip

# Bring in also the emulator UI, though it's not needed in CI. Helps in using the same image also in dev.
#
RUN firebase setup:emulators:ui \
  && rm -rf /root/.cache/firebase/emulators/ui-v*.zip

  # $ ls /root/.cache/firebase/emulators/
  #   cloud-firestore-emulator-v1.14.4.jar    (58.2 MB)
  #   cloud-storage-rules-runtime-v1.0.2.jar  (34.1 MB)   <-- old version
  #   firebase-database-emulator-v4.9.0.jar   (32.6 MB)
  #   pubsub-emulator-0.1.0                   (37.9 MB)   <-- old version
  #   ui-v1.9.0                               (12.4 MB)

# Setting the env.var so 'firebase-tools' finds the images.
#
# Without this, the using CI script would first need to do a 'mv /root/.cache ~/' command. It's weird; the other approaches
# considered were:
#   - use our user and home                   (Cloud Build doesn't resepect them)
#   - place the files under '/builder/home'   (Cloud Build wipes that folder, before announcing it the new home)
#   - have an 'ONBUILD' step handle the move  (Cloud Build doesn't call the triggers)
#
# Note: 'FIREBASE_EMULATORS_PATH' looks legit (from the sources), but is not mentioned in Firebase documentation (May 2021)
#   so it might seize to work, one day... #good-enough
#
ENV FIREBASE_EMULATORS_PATH '/root/.cache/firebase/emulators'

# Allows emulators to see changes to (host side, volume mapped) Security Rules, Cloud Functions
#ENV CHOKIDAR_USEPOLLING true
