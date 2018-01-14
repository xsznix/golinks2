'use strict';

document.getElementById('cmdconfig').addEventListener('click', () => {
  chrome.tabs.create({url: 'chrome://extensions/configureCommands'});
});
