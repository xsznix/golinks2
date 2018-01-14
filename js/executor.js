'use strict';

const Executor = (() => {
  const Executor = {};

  Executor.execGolink = async function execGolink(node, query, disposition) {
    await Store.markAccessed(node);
    const url = parseUrlWithAppend(node.url, query);
    await navigate(url, disposition);
    close();
  }

  Executor.execChromeBookmark = async function execChromeBookmark(node, disposition) {
    await navigate(node.url, disposition);
    close();
  }

  Executor.execMark = async function execMark(query) {
    const [tabs] = await AsyncChrome.Tabs.query({currentWindow: true, active: true});
    if (tabs) {
      await Store.create(query, tabs[0].url);
      close();
    }
  }

  Executor.execCopy = function execCopy(selectedNode, query) {
    const input = document.getElementById('input');
    input.value = parseUrlWithAppend(selectedNode.url, query);
    input.select();
    document.execCommand('Copy');
    close();
  }

  Executor.execList = async function execList() {
    await AsyncChrome.Tabs.create({url: `chrome://bookmarks/?id=${Store.getFolderId()}`});
  }

  function parseUrlWithAppend(base, query) {
    let slashIndex = query.indexOf('/');
    if (slashIndex !== -1) {
      if (base.endsWith('/')) {
        return base + query.substring(slashIndex + 1);
      } else {
        return base + query.substring(slashIndex);
      }
    } else {
      return base;
    }
  }

  async function navigate(url, disposition) {
    switch (disposition) {
      case 'sametab':
      const [tabs] = await AsyncChrome.Tabs.query({currentWindow: true, active: true});
      if (tabs) {
        await AsyncChrome.Tabs.update(tabs[0].id, {url});
      }
      break;

      case 'newtab':
      await AsyncChrome.Tabs.create({url});
      break;

      case 'newtab_hidden':
      await AsyncChrome.Tabs.create({url, active: false});
      break;

      case 'newwin':
      await AsyncChrome.Windows.create({url});
    }
  }

  return Executor;
})();
