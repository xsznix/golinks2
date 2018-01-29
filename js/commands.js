'use strict';

const Commands = (() => {
  const Commands = {};

  Commands.COMMANDS = {
    mark: {
      desc: 'bookmark this page',
      info: 'a memorable keyword',
    },
    copy: {
      desc: 'copy a golink',
      info: 'golink url to clipboard',
    },
    edit: {
      desc: 'edit a golink',
      info: 'golink',
    },
    delete: {
      desc: 'delete a golink',
      info: 'golink',
    },
    list: {
      desc: 'view and manage golinks',
      info: 'press enter',
    },
    search: {
      desc: 'search chrome bookmarks',
      info: 'chrome bookmarks',
    },
    tab: {
      desc: 'switch to another tab',
      info: 'title or url',
    },
    help: {
      desc: 'learn how to use Golinks',
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
    t: 'tab',
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
