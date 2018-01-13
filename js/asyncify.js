'use strict';

// Used to make Chrome APIs that accept a callback into awaitable APIs.
function asyncify(api) {
  return function() {
    const args = [].slice.call(arguments);
    return new Promise((resolve, reject) => {
      args.push(parseResult);
      api.apply(null, args);

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
