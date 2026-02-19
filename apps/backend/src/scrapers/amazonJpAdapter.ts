import { BaseAdapter } from './baseAdapter';
import { ScrapedProduct } from '@omnipay/shared/src/types/product';
import * as cheerio from 'cheerio';

export class AmazonJpAdapter extends BaseAdapter {
    siteId = 'amazon_jp';
    domain = 'amazon.co.jp';
    region = 'JP';

    protected getSearchUrl(query: string): string {
        return `https://www.amazon.co.jp/s?k=${encodeURIComponent(query)}`;
    }

    protected async parseSearchResults($: cheerio.CheerioAPI): Promise<ScrapedProduct[]> {
        const products: ScrapedProduct[] = [];

        $('.s-result-item[data-component-type="s-search-result"]').each((_, element) => {
            try {
                const title = $(element).find('h2 a span').text().trim();
                const priceText = $(element).find('.a-price .a-offscreen').first().text().trim();
                const image = $(element).find('img.s-image').attr('src') || '';
                const link = $(element).find('h2 a').attr('href');

                // Parse Price (¥1,234 -> 1234)
                const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10);

                if (title && price && link) {
                    products.push({
                        id: $(element).attr('data-asin') || Math.random().toString(36).substr(2, 9),
                        title,
                        price,
                        currency: 'JPY',
                        image,
                        url: link.startsWith('http') ? link : `https://www.amazon.co.jp${link}`,
                        site: 'Amazon JP',
                        region: 'JP'
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
        const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10);
        const image = $('#landingImage').attr('src') || '';

        if (!title) return null;

        return {
            id: 'asin-placeholder', // In real app extract ASIN from URL
            title,
            price: price || 0,
            currency: 'JPY',
            image,
            url,
            site: 'Amazon JP',
            region: 'JP'
        };
    }
}
