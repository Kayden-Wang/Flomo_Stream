import { FlomoNote } from '../types';

// Listen for tab updates to get page info
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const note: Partial<FlomoNote> = {
      title: tab.title || '',
      url: tab.url,
    };

    // Send page info to content script
    chrome.tabs.sendMessage(tabId, {
      type: 'PAGE_INFO',
      payload: note,
    });
  }
});