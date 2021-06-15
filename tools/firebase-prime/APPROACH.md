# Approach

We use the REST API with token "owner". This allows us not to need the Admin SDK (and well, not the JS client either).

For some reason, token == "owner" didn't work with JS client (9.0.0-beta.2; firebase-tools 9.12.1). That's fine. It does mean we need to craft the payload from the `*Value` objects, though.

On the other hand, it releases us from any client, whatsoever! ☀️
