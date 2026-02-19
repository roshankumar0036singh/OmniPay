import { ScrapedProduct, SiteAdapter } from './baseAdapter';

export class AmazonJpAdapter implements SiteAdapter {
    detectProductPage(): boolean {
        return !!document.querySelector('#productTitle');
    }

    async scrapeProduct(): Promise<ScrapedProduct | null> {
        const title = document.querySelector('#productTitle')?.textContent?.trim();

        // Amazon price is tricky, lots of possible selectors
        const priceElement = document.querySelector('.a-price .a-offscreen') ||
            document.querySelector('#priceblock_ourprice') ||
            document.querySelector('#priceblock_dealprice');

        const priceText = priceElement?.textContent?.trim().replace(/[^0-9.]/g, '');
        const price = priceText ? parseFloat(priceText) : 0;

        const imageElement = document.querySelector('#landingImage') as HTMLImageElement;
        const imageUrl = imageElement?.src || '';

        if (!title) return null;

        return {
            id: window.location.pathname,
            title,
            price,
            currency: 'JPY',
            imageUrl,
            url: window.location.href
        };
    }
}
