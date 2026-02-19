import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
    matches: ["<all_urls>"],
    all_frames: true
}

console.log("OmniPay Content Script Loaded")

// Extract product info logic will go here
window.addEventListener("load", () => {
    // Detect if we are on a product page
})
