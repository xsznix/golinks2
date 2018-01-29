'use strict';

const History = (() => {
  const History = {};

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

  History.load = async function load() {
    if (fuse) return;
    const [hist] = await AsyncChrome.History.search({
      text: '',
      startTime: 0,
      maxResults: 1000,
    });
    hist.forEach(tab => {
      Object.assign(tab, {
        specialType: 'history',
      });
    });
    cache = hist;
    fuse = new Fuse(hist, FUSE_OPTIONS);
  }

  History.query = async function query(query) {
    await History.load();
    if (query.length)
      return fuse.search(query).slice(0, 10);
    else
      return cache.slice(0, 10);
  }

  return History;
})();
