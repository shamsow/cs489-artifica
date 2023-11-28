chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "contextMenuButton",
    title: "Is this AI?",
    contexts: ["all"]
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "contextMenuButton") {
    // Handle the button click action here
    console.log("Check AI button clicked!");
  }
});
