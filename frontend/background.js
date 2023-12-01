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
    alert(data.message)
  })
  .catch((error) => {
    console.error("Error making report:", error);
  });
}
