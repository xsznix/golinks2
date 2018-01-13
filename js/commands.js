'use strict';

const Commands = (() => {
  const Commands = {};

  Commands.COMMANDS = {
    mark: {
      desc: 'Bookmark this page',
      info: 'a memorable keyword',
    },
    copy: {
      desc: 'Copy a golink',
      info: 'golink url to clipboard',
    },
    edit: {
      desc: 'Edit a golink',
      info: 'golink',
    },
    delete: {
      desc: 'Delete a golink',
      info: 'golink',
    },
    search: {
      desc: 'Search Chrome bookmarks',
      info: 'chrome bookmarks',
    },
    list: {
      desc: 'View and manage golinks',
      info: 'press enter',
    },
    help: {
      desc: 'Learn how to use Golinks',
      info: 'press enter',
    },
  };

  Commands.SHORT_COMMANDS = {
    m: 'mark',
    c: 'copy',
    e: 'edit',
    d: 'delete',
    s: 'search',
    l: 'list',
    h: 'help',
  };

  Commands.COMMAND_LIST = Object.keys(Commands.COMMANDS).map(key => ({
    specialType: 'command',
    title: key,
    short: key[0],
    description: Commands.COMMANDS[key].desc,
    info: Commands.COMMANDS[key].info,
  }));

  return Commands;
})();
