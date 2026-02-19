import type { PlasmoCSConfig } from "plasmo"
import { detectSite, SupportedSite } from "./lib/siteDetector"
import { AmazonJpAdapter } from "./lib/adapters/amazonJpAdapter"

export const config: PlasmoCSConfig = {
    matches: [
        "https://www.amazon.co.jp/*",
        "https://www.rakuten.co.jp/*",
        "https://jp.mercari.com/*"
    ]
}

const init = async () => {
    const site = detectSite(window.location.href);
    console.log(`[OmniPay] Detected site: ${site}`);

    if (site === SupportedSite.AmazonJP) {
        const adapter = new AmazonJpAdapter();
        if (adapter.detectProductPage()) {
            console.log('[OmniPay] Product page detected');
            const product = await adapter.scrapeProduct();
            console.log('[OmniPay] Scraped product:', product);
            // TODO: Inject floating UI here
        }
    }
}

// Simple debounce to handle dynamic loading (SPA) behaviors
let timeout: NodeJS.Timeout;
const debouncedInit = () => {
    clearTimeout(timeout);
    timeout = setTimeout(init, 1000);
}

window.addEventListener('load', debouncedInit);
// Optional: Observe URL changes for SPAs if needed
// window.addEventListener('popstate', debouncedInit);
