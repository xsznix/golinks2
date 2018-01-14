'use strict';

let USER_OS;
chrome.runtime.getPlatformInfo(info => {
  USER_OS = info.os;
});
