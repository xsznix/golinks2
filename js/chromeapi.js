'use strict';

const AsyncChrome = (() => {
  const AsyncChrome = {};

  AsyncChrome.Storage = {
    get: asyncify(chrome.storage.sync.get),
    set: asyncify(chrome.storage.sync.set),
  };

  AsyncChrome.Bookmarks = {
    create: asyncify(chrome.bookmarks.create),
    get: asyncify(chrome.bookmarks.get),
    getChildren: asyncify(chrome.bookmarks.getChildren),
    move: asyncify(chrome.bookmarks.move),
    search: asyncify(chrome.bookmarks.search),
    update: asyncify(chrome.bookmarks.update),
  };

  AsyncChrome.Tabs = {
    create: asyncify(chrome.tabs.create),
    query: asyncify(chrome.tabs.query),
    update: asyncify(chrome.tabs.update),
  };

  return AsyncChrome;
})();
