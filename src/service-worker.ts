export {};

declare global {
  interface Window {
    [key: string]: any;
  }
}

chrome.runtime.onMessage.addListener(async (request) => {
  if (request.type === "INJECT_SCRIPT") {
    chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id as number },
        // readding event listener, ref:https://greasyfork.org/en/scripts/477710-quicker-backloggd-log/code
        func: () => window.onmount(),
        world: "MAIN",
      });
    });
  }
});
