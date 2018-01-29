'use strict';

const Changelog = (() => {
  const Changelog = {};
  const CHANGELOG_KEY = 'changelog';
  const CHANGELOG_CURR = '2.1.0';

  Changelog.shouldRun = async function shouldRun() {
    const [snapshot] = await AsyncChrome.Storage.get(CHANGELOG_KEY);
    return snapshot[CHANGELOG_KEY] !== CHANGELOG_CURR;
  }

  Changelog.markAsComplete = async function markAsComplete() {
    await AsyncChrome.Storage.set({[CHANGELOG_KEY]: CHANGELOG_CURR});
  }

  Changelog.show = async function show() {
    await AsyncChrome.Tabs.create({
      url: chrome.runtime.getURL('/changelog.html'),
    });
  }

  return Changelog;
})();
