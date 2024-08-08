let scrapeCount = {};
const rangeSize = 150;
let lastScrapedWidth = window.innerWidth;

function scrapeEventDetails() {
  try {
    const mobileTitleElement = document.querySelector("h1.MobileNav__Title-sc-9b74d80e-6");
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

    console.log("Scraped Data:", scrapedData);
    chrome.runtime.sendMessage({ action: "scrapedData", data: scrapedData });
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

function attemptScrape() {
  scrapeEventDetails();
  if (
    !document.querySelector('[data-testid="event-title"]') &&
    !document.querySelector("h1.MobileNav__Title-sc-9b74d80e-6")
  ) {
    setTimeout(attemptScrape, 1000);
  }
}

function shouldScrape(currentWidth) {
  const currentRange = Math.floor(currentWidth / rangeSize) * rangeSize;
  
  if (typeof scrapeCount[currentRange] === 'undefined') {
    scrapeCount[currentRange] = 0;
  }

  const widthDifference = Math.abs(currentWidth - lastScrapedWidth);
  const significantChange = widthDifference > 50;

  if (significantChange && scrapeCount[currentRange] < 2) {
    scrapeCount[currentRange]++;
    lastScrapedWidth = currentWidth;
    return true;
  }

  return false;
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

const debouncedResize = debounce(() => {
  const currentWidth = window.innerWidth;
  if (currentWidth <= 960 && shouldScrape(currentWidth)) {
    attemptScrape();
  }
}, 250);

attemptScrape();

document.addEventListener("DOMContentLoaded", attemptScrape);

window.addEventListener("resize", debouncedResize);