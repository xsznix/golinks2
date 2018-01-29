'use strict';

const Tabs = (() => {
  const Tabs = {};

  const FUSE_OPTIONS = {
    shouldSort: true,
    threshold: 0.25,
    keys: [
      'title',
      'url',
    ],
  };

  let cache;
  let fuse;

  Tabs.load = async function load() {
    if (fuse) return;
    const [tabs] = await AsyncChrome.Tabs.query({});
    tabs.forEach(tab => {
      Object.assign(tab, {
        specialType: 'tab',
      });
    });
    cache = tabs;
    fuse = new Fuse(tabs, FUSE_OPTIONS);
  }

  Tabs.query = async function query(query) {
    await Tabs.load();
    if (query.length)
      return fuse.search(query);
    else
      return cache;
  }

  return Tabs;
})();
