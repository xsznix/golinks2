'use strict';

const Onboarding = (() => {
  const Onboarding = {};
  const ONBOARDING_KEY = 'onboarding_done';

  Onboarding.shouldRun = async function shouldRun() {
    const [snapshot] = await AsyncChrome.Storage.get(ONBOARDING_KEY);
    return !snapshot[ONBOARDING_KEY];
  }

  Onboarding.markAsComplete = async function markAsComplete() {
    await AsyncChrome.Storage.set({[ONBOARDING_KEY]: true});
  }

  Onboarding.show = async function show() {
    await AsyncChrome.Tabs.create({
      url: chrome.runtime.getURL('/onboarding.html'),
    });
  }

  return Onboarding;
})();
