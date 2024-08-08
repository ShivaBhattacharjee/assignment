chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.scrapedData) {
    console.log('Received scraped data:', message.scrapedData);
  }
});
