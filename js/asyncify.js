'use strict';

// Used to make Chrome APIs that accept a callback into awaitable APIs.
function asyncify(obj, key) {
  return function() {
    const args = [].slice.call(arguments);
    return new Promise((resolve, reject) => {
      args.push(parseResult);
      obj[key].apply(obj, args);

      function parseResult() {
        const err = chrome.runtime.lastError;
        if (err) {
          reject(err);
        } else {
          resolve([].slice.call(arguments));
        }
      }
    });
  };
}
