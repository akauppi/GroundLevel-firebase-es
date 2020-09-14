#!/bin/bash

firebase emulators:exec --only hosting "curl http://localhost:5000/__/firebase/init.json"

