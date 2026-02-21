import type { PlasmoCSConfig } from "plasmo"
import { createRoot } from "react-dom/client"
import { detectSite, SupportedSite } from "./lib/siteDetector"
import { AmazonJpAdapter } from "./lib/adapters/amazonJpAdapter"
import { FloatingButton } from "./components/FloatingButton"
import { PriceCompare } from "./components/PriceCompare"

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

            if (product) {
                console.log('[OmniPay] Scraped product:', product);

                // Inject Floating UI
                const mountPoint = document.createElement('div');
                mountPoint.id = 'omnipay-floating-root';
                document.body.appendChild(mountPoint);

                const root = createRoot(mountPoint);
                root.render(
                    <>
                        {/* Render Price Compare widget explicitly for testing/demo */}
                        <div className="fixed bottom-24 right-6 z-[999999]">
                            <PriceCompare productTitle={product.title} />
                        </div>
                        <FloatingButton product={product} />
                    </>
                );
            }
        }
    }
}

// Simple debounce
let timeout: NodeJS.Timeout;
const debouncedInit = () => {
    clearTimeout(timeout);
    timeout = setTimeout(init, 1000);
}

window.addEventListener('load', debouncedInit);
