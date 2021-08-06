'use strict';

const Store = (() => {
  const Store = {};
  const BOOKMARK_NAME = 'Golinks';
  let folderId, loaded = false, cache;

  Store.setup = async function setup() {
    let [results] = await AsyncChrome.Bookmarks.search({title: BOOKMARK_NAME});
    results = results
      // folders only
      .filter(r => !r.url)
      // get most recently modified; this is most likely to be our folder
      .sort((a, b) => b.dateGroupModified - a.dateGroupModified);
    if (!results.length) {
      const [folder] = await AsyncChrome.Bookmarks.create({title: BOOKMARK_NAME});
      folderId = folder.id;
    } else {
      folderId = results[0].id;
    }
  };

  /**
   * The store needs to be loaded before any operations can be performed on it.
   */
  Store.load = async function load() {
    if (loaded) return;
    if (!folderId) await Store.setup();

    const [golinks] = await AsyncChrome.Bookmarks.getChildren(folderId);
    loaded = true;
    cache = golinks;
  }

  /**
   * Create a golink, putting it in Chrome's backing store as well as our session cache.
   * title: string, url: string -> chrome.bookmarks.BookmarkTreeNode
   */
  Store.create = async function create(title, url) {
    const newNode = await AsyncChrome.Bookmarks.create({
      title,
      url,
      parentId: folderId,
      index: 0,
    });
    cache.unshift(newNode);
    return newNode;
  }

  /**
   * Finds up to `limit` golinks, most recently used first, where the title starts with `query`. If
   * `allowExact` is set to `false`, a golink whose title matches `query` exactly will be skipped.
   *
   * query: string, options: {limit: number, allowExact: boolean}
   *   -> Array<chrome.bookmarks.BookmarkTreeNode>
   */
  Store.findPrefix = function findPrefix(query, options = {}) {
    options = Object.assign({}, options, {
      limit: 10,
      allowExact: false,
    });
    const results = [];
    for (let i = 0; i < cache.length; i++) {
      const link = cache[i];
      if (link.url && link.title.startsWith(query) && (options.allowExact || link.title !== query)) {
        results.push(cache[i]);
        if (results.length >= options.limit) {
          return results;
        }
      }
    }
    return results;
  }

  /**
   * Finds a golink whose title matches `query`.
   *
   * query: string -> ?chrome.bookmarks.BookmarkTreeNode
   */
  Store.findExact = function findExact(query) {
    for (let i = 0; i < cache.length; i++) {
      if (cache[i].url && cache[i].title === query) {
        return cache[i];
      }
    }
    return null;
  }

  /**
   * Mark `node` as having just been accessed if it is in the Golinks folder.
   * node: chrome.bookmarks.BookmarkTreeNode
   */
  Store.markAccessed = async function markAccessed(node) {
    if (node.parentId !== folderId) return;
    await AsyncChrome.Bookmarks.move(node.id, {index: 0});
  }

  /**
   * Updates a golink with new properties. Leaves the cache stale.
   */
  Store.update = async function update(node, newProps) {
    await AsyncChrome.Bookmarks.update(node.id, newProps);
    await AsyncChrome.Bookmarks.move(node.id, {index: 0});
    // const oldIndex = cache.findIndex(n => node.id = n.id);
    // cache.splice(oldIndex, 1);
    // const newNode = Object.assign({}, node, {title, url});
    // cache.unshift(newNode);
  }

  /**
   * Deletes a golink. Leaves the cache stale.
   */
  Store.remove = async function remove(node) {
    await AsyncChrome.Bookmarks.remove(node.id);
    // const oldIndex = cache.findIndex(n => node.id == n.id);
    // cache.splice(oldIndex, 1);
  }

  /**
   * Gets the ID of the folder that golikns are stored in.
   */
  Store.getFolderId = function getFolderId() {
    return folderId;
  }

  return Store;
})();
