chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "artificaContextMenu",
    title: "Is this AI?",
    contexts: ["all"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "artificaContextMenu") {
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

function makeReportRequest(link) {
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
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle the response data
      console.log("Report Response:", data);
    })
    .catch((error) => {
      console.error("Error making report request:", error);
    });
}


