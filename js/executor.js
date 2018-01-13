'use strict';

const Executor = (() => {
  const Executor = {};

  Executor.execGolink = async function execGolink(node, query) {
    await Store.markAccessed(node);
    let url, slashIndex = query.indexOf('/');
    if (slashIndex !== -1) {
      if (node.url.endsWith('/')) {
        url = node.url + query.substring(slashIndex + 1);
      } else {
        url = node.url + query.substring(slashIndex);
      }
    } else {
      url = node.url;
    }
    await navigate(url);
    close();
  }

  Executor.execChromeBookmark = async function execChromeBookmark(node) {
    await navigate(node.url);
    close();
  }

  Executor.execMark = async function execMark(query) {
    const [tabs] = await AsyncChrome.Tabs.query({currentWindow: true, active: true});
    if (tabs) {
      await Store.create(query, tabs[0].url);
      close();
    }
  }

  Executor.execCopy = function execCopy(selectedNode) {
    const input = document.getElementById('input');
    input.value = selectedNode.url;
    input.select();
    document.execCommand('Copy');
    close();
  }

  async function navigate(url) {
    const [tabs] = await AsyncChrome.Tabs.query({currentWindow: true, active: true});
    if (tabs) {
      await AsyncChrome.Tabs.update(tabs[0].id, {url});
    }
  }

  return Executor;
})();
