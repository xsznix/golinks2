'use strict';

import('./asyncify');
import('./changelog');
import('./chromeapi');
import('./store');
import('./onboarding');

addEventListener('activate', () => {
  (async () => {
    if (await Onboarding.shouldRun()) {
      await Onboarding.show();
      await Onboarding.markAsComplete();
      await Changelog.markAsComplete();
    } else if (await Changelog.shouldRun()) {
      await Changelog.show();
      await Changelog.markAsComplete();
    }
  })();
});
