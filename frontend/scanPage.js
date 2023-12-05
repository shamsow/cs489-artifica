(function() {
    const imageElements = document.getElementsByTagName('img');
    const imageUrls = Array.from(imageElements).map(img => img.src);

    chrome.runtime.sendMessage({imageUrls: imageUrls});
})();