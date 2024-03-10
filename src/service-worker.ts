export {};

declare global {
  interface Window {
    [key: string]: any;
  }
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.type === "INJECT_SCRIPT") {
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id as number },
        func: () => window.onmount(),
        world: "MAIN",
      });
    });
  }
});
