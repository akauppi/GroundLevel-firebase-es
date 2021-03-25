# Wishes for Browsers

## Help with Authentication

>Disclaimer: The author is not a security specialist. But he's fairly confident this is an issue...

What happens when we use eg. "popup" authentication in the browser, and press the "Google auth" button? 

A separate browser window opens. Presumably by Google (we could prove this by some developer tools, unless the URL is shown to us and not fake).

Presumably, the original site's code cannot eavesdrop once the user types in their pword. Or can they?

### Better way

Instead of popping up that separate browser window, have the browser provide the support for asking the password.

Apple already does this with the Apple sign-up.


### What about two-factor auth?

Sure. I prefer it, as a user, and it should be made as easy as possible to implement and use (both Google and Apple do a good work here, on the use side).

But - it still leaves it possible that a browser page has somehow managed to make me type the Google account's pw in a dialog where it shouldn't have been typed. 2FA simply reduces the damage that occurs if that pw leaks. I'd like to reduce the chances of such leak.

Setting up two-factor auth with Firebase authentication should be as simple as switching an option. But that's another story...

