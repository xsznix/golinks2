'use strict';

(async () => {
  if (await Onboarding.shouldRun()) {
    await Onboarding.show();
    await Onboarding.markAsComplete();
  } else if (await Changelog.shouldRun()) {
    await Changelog.show();
    await Changelog.markAsComplete();
  }
})();
