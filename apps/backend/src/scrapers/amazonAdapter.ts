import { BaseAdapter } from './baseAdapter';
import { ScrapedProduct } from '@omnipay/shared/src/types/product';
import * as cheerio from 'cheerio';

export class AmazonAdapter extends BaseAdapter {
    siteId: string;
    domain: string;
    region: string;
    currency: string;

    constructor(region: string, domain: string, currency: string) {
        super();
        this.region = region;
        this.domain = domain;
        this.siteId = `amazon_${region.toLowerCase()}`;
        this.currency = currency;
    }

    protected getSearchUrl(query: string): string {
        return `https://www.${this.domain}/s?k=${encodeURIComponent(query)}`;
    }

    protected async parseSearchResults($: cheerio.CheerioAPI): Promise<ScrapedProduct[]> {
        const products: ScrapedProduct[] = [];

        $('.s-result-item[data-component-type="s-search-result"]').each((_, element) => {
            try {
                const title = $(element).find('h2 a span').text().trim();
                const priceText = $(element).find('.a-price .a-offscreen').first().text().trim();
                const image = $(element).find('img.s-image').attr('src') || '';
                const link = $(element).find('h2 a').attr('href');

                // Cross-region price parsing (handles $1,234.56, 1.234,56 €, ¥1,234 etc)
                const price = this.parseRegionalPrice(priceText);

                if (title && price && link) {
                    products.push({
                        id: $(element).attr('data-asin') || Math.random().toString(36).substr(2, 9),
                        title,
                        price,
                        currency: this.currency,
                        image,
                        url: link.startsWith('http') ? link : `https://www.${this.domain}${link}`,
                        site: `Amazon ${this.region}`,
                        region: this.region
                    });
                }
            } catch (e) {
                // Skip invalid items
            }
        });

        return products;
    }

    protected async parseProductPage($: cheerio.CheerioAPI, url: string): Promise<ScrapedProduct | null> {
        const title = $('#productTitle').text().trim();
        const priceText = $('.a-price .a-offscreen').first().text().trim();
        const price = this.parseRegionalPrice(priceText);
        const image = $('#landingImage').attr('src') || '';

        if (!title) return null;

        return {
            id: 'asin-placeholder',
            title,
            price: price || 0,
            currency: this.currency,
            image,
            url,
            site: `Amazon ${this.region}`,
            region: this.region
        };
    }

    private parseRegionalPrice(text: string): number {
        if (!text) return 0;
        // Strip currency symbols and handle regional separators
        // This is a naive implementation; in production, use a library like currency-scraper
        if (this.region === 'DE' || this.region === 'FR' || this.region === 'ES') {
            // "1.234,56 €" -> 1234.56
            const clean = text.replace(/[^-0-9,]/g, '').replace(',', '.');
            return parseFloat(clean);
        }
        // "¥1,234" or "$1,234.56"
        const clean = text.replace(/[^-0-9.]/g, '');
        return parseFloat(clean);
    }
}
