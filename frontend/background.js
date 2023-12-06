chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.imageUrls) {
    makeBatchCheckRequest(message.imageUrls);
  }
});


chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "artificaScanPage",
    title: "Scan Page for AI Images",
    contexts: ["page"]
  });
  // ... existing menu items ...
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "artificaCheckAI",
    title: "Is this AI?",
    contexts: ["image"]
  });
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "artificaReportAI",
    title: "Report AI",
    contexts: ["image"]
  });
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "artificaReportNotAI",
    title: "Report Not AI",
    contexts: ["image"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "artificaScanPage") {
    chrome.tabs.executeScript(tab.id, {file: "scanPage.js"});
  }
  // ... existing handlers ...
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "artificaReportAI") {
    // Check if the right-clicked element is an image
    if (info.srcUrl) {
      // Log the source link of the image to the console

      console.log("Image Source Link:", info.srcUrl);
      makeReportRequest(info.srcUrl, "positive");
    } else {
      console.log("Not image");
    }
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "artificaReportNotAI") {
    // Check if the right-clicked element is an image
    if (info.srcUrl) {
      // Log the source link of the image to the console

      console.log("Image Source Link:", info.srcUrl);
      makeReportRequest(info.srcUrl, "negative");
    } else {
      console.log("Not image");
    }
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "artificaCheckAI") {
    // Check if the right-clicked element is an image
    if (info.srcUrl) {
      // Log the source link of the image to the console

      console.log("Image Source Link:", info.srcUrl);
      makeCheckRequest(info.srcUrl);
    } else {
      console.log("Not image");
    }
  }
});


function makeCheckRequest(link) {
  // Specify the endpoint URL
  const endpoint = "http://localhost:8000/api/check/";

  // Create the POST request
  fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: link,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      else {
        throw new Error(`Check request failed with status ${response.status}`);
      }
    })
    .then((data) => {
      // Handle the response data
      console.log("Check Response:", data);
      alert(`AI Verdict: ${data.label.toUpperCase()}`)
    })
    .catch((error) => {
      console.error("Error making check request:", error);
    });
}

function makeReportRequest(link, feedback) {
  // Specify the endpoint URL
  const endpoint = "http://localhost:8000/api/report/";

  // Create the POST request
  fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: link,
      feedback: feedback
    }),
  })
  .then((response) => {
    if (response.ok) {
      return response.json()
    }
    else {
      throw new Error(`Report request failed with status ${response.status}`);
    }
  })
  .then((data) => {
    // Handle the response data
    console.log("Report Response:", data);
    real_stats = (data.real / (data.real + data.synthetic)) * 100
    synth_stats = (data.synthetic / (data.real + data.synthetic)) * 100
    alert(`${data.message} [Real: ${Math.round(real_stats)}; Synthetic: ${Math.round(synth_stats)}]`)
  })
  .catch((error) => {
    console.error("Error making report:", error);
  });
}


function makeBatchCheckRequest(links) {
  const endpoint = "http://localhost:8000/api/batch_check/";

  fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      urls: links,
    }),
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Network response was not ok.');
    }
  })
  .then(data => {
    // Process each result
    let foundFake = false;
    data.forEach(result => {
      if (result.error) {
        console.error(`Error processing ${result.url}: ${result.error}`);
      } else {
        console.log(`Image: ${result.url}, AI Detection: ${result.label}`);
        if (result.label === 'positive') { 
          foundFake = true;
        }
      }
    });

    if (!foundFake) {
      // Delay the alert by 3 seconds (3000 milliseconds)
      setTimeout(() => {
        alert('No AI generated images found.');
      }, 3000);
    } else {
      console.log(data)
      alert(`Found ${data.length} AI generated images on this page. Check console for details.`);
    }
  })
  .catch(error => {
    console.error('Error during fetch operation:', error.message);
    setTimeout(() => {
      alert('No fake image found');
    }, 3000);
  });
}



