'use strict';

(async () => {
  if (await Onboarding.shouldRun()) {
    await Onboarding.show();
    await Onboarding.markAsComplete();
  }

  Store.setup();
})();
