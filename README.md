#

## This is a chrome extension that will track a users time on individual websites and communicate that time back to the user.

## Features
- local storage

## TODOs:
- [ ] find a way to use imports form src/utils.js
    - [ ] `background.js` sends error: imports are only allowed in module
    - [ ] save to and from local storage are duplicated.... (background.js, popup/index.js)
- [ ] add a way to flag URLs to remind people that they don't want to spend more time on that site
- [ ] create a usr object in local storage to store users settings

## file layout
- pkg/      -- The final code to run the extension
- src/      -- The tests and vanilla .js code, seperated from the chrome API code]
- test.sh   -- This will run all the test files / scripts
- build.sh  -- This will parse all my src files into the production script files
- watch.sh  --  TODO: this is similar to nodemon, it will watch the src files and rebuild production on change
- todo.sh   -- a script that will print all TODO: to the console from ./src/*

## Resources:
- [Basics of Chrome Extensions](https://www.youtube.com/watch?v=Zt_6UXvoKHM)
- [Basics of Chrome Extensions Strange](https://www.youtube.com/watch?v=Is_ZA4yxliE)
- [Chrome API docs](https://developer.chrome.com/docs/extensions/reference/api/storage#local)
