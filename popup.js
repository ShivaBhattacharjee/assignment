document.addEventListener('DOMContentLoaded', () => {
  scrapeData();
  document.getElementById('scrapeBtn').addEventListener('click', () => {
    scrapeData();
  });
});

function scrapeData() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: scrapeEventDetails
    });
  });
}

function scrapeEventDetails() {
  try {
    const mobileTitleElement = document.querySelector('h1.MobileNav__Title-sc-9b74d80e-6');
    const eventTitleElement = document.querySelector('[data-testid="event-title"]');
    const eventDetailsElement = document.querySelector('[data-testid="event-details"]');

    let scrapedData = {};

    if (eventTitleElement) {
      scrapedData.title = eventTitleElement.textContent.trim();
    }
    if (mobileTitleElement) {
      scrapedData.title = mobileTitleElement.textContent.trim();
    }
    if (eventDetailsElement) {
      const dateTimeLocationText = eventDetailsElement.textContent.trim();
      scrapedData.dateTimeLocation = dateTimeLocationText;
    }

    console.log('Scraped Data:', scrapedData);
    chrome.runtime.sendMessage({ scrapedData: scrapedData });
  } catch (error) {
    console.error('An error occurred:', error);
  }
}