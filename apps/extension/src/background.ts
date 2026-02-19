export { }

console.log("OmniPay Background Service Started")

chrome.runtime.onInstalled.addListener(() => {
    console.log("OmniPay Extension Installed")
})

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "CHECK_AUTH") {
        // Check auth state logic
        sendResponse({ isAuthenticated: false })
    }
})
