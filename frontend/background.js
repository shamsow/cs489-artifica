chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "artificaContextMenu",
    title: "Is this AI?",
    contexts: ["image"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "artificaContextMenu") {
    // Check if the right-clicked element is an image
    if (info.srcUrl) {
      // Log the source link of the image to the console
      console.log("Image Source Link:", info.srcUrl);
    } else {
      console.log("Not image");
    }
  }
});
