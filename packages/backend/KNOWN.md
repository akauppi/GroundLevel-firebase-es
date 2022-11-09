# Known Issues


## Firebase Emulator warnings in Docker console

```
⚠  hub: Error when trying to check port 4400 on ::1: Error: listen EADDRNOTAVAIL: address not available ::1:4400
⚠  hub: Port 4400 is available on 127.0.0.1 but not ::1. This may cause issues with some clients.
⚠  hub: If you encounter connectivity issues, consider switching to a different port or explicitly specifying "host": "<ip address>" instead of hostname in firebase.json
⚠  logging: Error when trying to check port 4500 on ::1: Error: listen EADDRNOTAVAIL: address not available ::1:4500
⚠  logging: Port 4500 is available on 127.0.0.1 but not ::1. This may cause issues with some clients.
⚠  logging: If you encounter connectivity issues, consider switching to a different port or explicitly specifying "host": "<ip address>" instead of hostname in firebase.json
⚠  eventarc: Error when trying to check port 9299 on ::1: Error: listen EADDRNOTAVAIL: address not available ::1:9299
⚠  eventarc: Port 9299 is available on 127.0.0.1 but not ::1. This may cause issues with some clients.
```

These starting happening once Firebase moved to supporting IPv6.
