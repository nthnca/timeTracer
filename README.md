#

## This is a chrome extension that will track a users time on individual websites and communicate that time back to the user.

## Features
- local storage

## TODOs:
- [ ] find a way to use imports form src/utils.js
    - [ ] `background.js` sends error: imports are only allowed in module
    - [ ] save to and from local storage are duplicated.... (background.js, popup/index.js)
- [ ] add a way to flag URLs to remind people that they don't want to spend more time on that site
- [ ] 

## file layout
- pkg/ [the final code to run the extension]
- src/ [the tests and vanilla .js code, seperated from the chrome API code]

## Resources:
- [Basics of Chrome Extensions](https://www.youtube.com/watch?v=Zt_6UXvoKHM)
- [Basics of Chrome Extensions Strange](https://www.youtube.com/watch?v=Is_ZA4yxliE)
- [Chrome API docs](https://developer.chrome.com/docs/extensions/reference/api/storage#local)
