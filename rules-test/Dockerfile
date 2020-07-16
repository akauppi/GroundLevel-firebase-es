#
# Dockerfile
#
# Required:
#   - Java runtime (for Firebase tools)
#   - npm >= 13.2
#
# tbd. The output image with this is 1.4GB!  'node:14' base is 943MB.
#       - Try with a light Java base image, installing 'npm' on top of that
#
FROM node:14

# Install Firebase tools
#
RUN apt-get update && \
  apt-get install -y openjdk-8-jre-headless && \
  rm -rf /var/lib/apt/lists/* && \
  java -version

RUN npm install -g firebase-tools && \
  firebase --version

# Force the emulator to be downloaded
#
RUN firebase emulators:exec --only firestore true

WORKDIR /app

# Note: We intentionally don't use 'package-lock.json' (maybe we should?)
COPY package.json .
COPY babel.config.cjs .
COPY jest.config.cjs .
COPY setup.jest.js .
COPY tools ./tools/
COPY firebase.json .

RUN echo package-lock=false > .npmrc

# Install npm packages
RUN npm install

# From the host:
#
#data.js
#dut.rules
#firebase.json
#invitesC.test.js
#projectsC.test.js
#symbolsC.test.js
#visitedC.test.js

CMD [ "npm", "test" ]
