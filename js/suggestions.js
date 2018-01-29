'use strict';

const Suggestions = (() => {
  const Suggestions = {};
  const MAX_SUGGESTIONS = 10;

  /**
   * Fetches suggestions for the given `query`, with the exact match first if found.
   */
  Suggestions.forGolink = function forGolink(query) {
    const matches = Store.findPrefix(query);
    const exactMatch = Store.findExact(query);
    if (exactMatch) {
      if (matches.length === MAX_SUGGESTIONS) {
        matches.pop();
      }
      matches.unshift(exactMatch);
    }
    return matches;
  }

  /**
   * Fetches up to one suggestion for a golink exactly matching `query`.
   */
  Suggestions.forExactGolink = async function forExactGolink(query) {
    const match = await Store.findExact(query);
    if (match) {
      return [match];
    } else {
      return [];
    }
  }

  Suggestions.forDuplicateCheck = async function forDuplicateCheck(query) {
    const match = await Store.findExact(query);
    if (match) {
      return [Object.assign({specialType: 'duplicate'}, match)];
    } else {
      return [];
    }
  }

  /**
   * Fetches Chrome bookmarks that match the given `query` using Chrome's builtin search
   * functionality.
   */
  Suggestions.forChromeBookmarks = async function forChromeBookmarks(query) {
    let [bookmarks] = await AsyncChrome.Bookmarks.search({query});
    return bookmarks.filter(mark => mark.url).slice(0, 10);
  }

  Suggestions.forCommands = function forCommands(query) {
    if (query.length === 1) return Commands.COMMAND_LIST;
    return Commands.COMMAND_LIST.filter(cmd => cmd.short === query[1]);
  }

  /**
   * Gets an appropriate set of suggestions based on context.
   */
  Suggestions.run = async function(command, query) {
    // Command autocompletion
    if (!command.length && query[0] === '/') {
      return Suggestions.forCommands(query);
    }

    // Regular golink search
    if (!command.length || command === 'edit' || command === 'delete' || command === 'copy') {
      let slashIndex = query.indexOf('/');
      if (slashIndex !== -1) {
        return Suggestions.forExactGolink(query.substring(0, slashIndex));
      } else {
        return Suggestions.forGolink(query);
      }
    }

    // Chrome bookmark search
    if (command === 'search') {
      return await Suggestions.forChromeBookmarks(query);
    }

    // Duplicate checking for mark command
    if (command === 'mark') {
      return await Suggestions.forDuplicateCheck(query);
    }

    if (command === 'tab') {
      return await Tabs.query(query);
    }

    if (command === 'history') {
      return await History.query(query);
    }

    return [];
  }

  return Suggestions;
})();
