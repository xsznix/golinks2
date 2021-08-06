'use strict';

const AsyncChrome = (() => {
  const AsyncChrome = {};

  AsyncChrome.Storage = {
    get: asyncify(chrome.storage.sync, 'get'),
    set: asyncify(chrome.storage.sync, 'set'),
  };

  AsyncChrome.Bookmarks = {
    create: asyncify(chrome.bookmarks, 'create'),
    get: asyncify(chrome.bookmarks, 'get'),
    getChildren: asyncify(chrome.bookmarks, 'getChildren'),
    move: asyncify(chrome.bookmarks, 'move'),
    remove: asyncify(chrome.bookmarks, 'remove'),
    search: asyncify(chrome.bookmarks, 'search'),
    update: asyncify(chrome.bookmarks, 'update'),
  };

  AsyncChrome.History = {
    search: asyncify(chrome.history, 'search'),
  };

  AsyncChrome.Tabs = {
    create: asyncify(chrome.tabs, 'create'),
    query: asyncify(chrome.tabs, 'query'),
    update: asyncify(chrome.tabs, 'update'),
  };

  AsyncChrome.Windows = {
    create: asyncify(chrome.windows, 'create'),
    update: asyncify(chrome.windows, 'update'),
  };

  return AsyncChrome;
})();
