import { BaseAdapter } from './baseAdapter';
import { ScrapedProduct } from '@omnipay/shared/src/types/product';
import * as cheerio from 'cheerio';

export class TemuAdapter extends BaseAdapter {
    siteId = 'temu_global';
    domain = 'temu.com';
    region = 'GLOBAL';

    protected getSearchUrl(query: string): string {
        return `https://www.temu.com/search_result.html?search_key=${encodeURIComponent(query)}`;
    }

    protected async parseSearchResults($: cheerio.CheerioAPI): Promise<ScrapedProduct[]> {
        const products: ScrapedProduct[] = [];

        $('.c-goods-item').each((_, element) => {
            try {
                const title = $(element).find('.c-goods-name').text().trim();
                const priceText = $(element).find('.c-goods-price').text().trim();
                const image = $(element).find('img').attr('src') || '';
                const link = $(element).find('a').attr('href');

                const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));

                if (title && price && link) {
                    products.push({
                        id: Math.random().toString(36).substr(2, 9),
                        title,
                        price,
                        currency: 'USD',
                        image,
                        url: link.startsWith('http') ? link : `https://www.temu.com${link}`,
                        site: 'Temu',
                        region: 'GLOBAL'
                    });
                }
            } catch (e) {
                // Skip
            }
        });

        return products;
    }

    protected async parseProductPage($: cheerio.CheerioAPI, url: string): Promise<ScrapedProduct | null> {
        return null; // Not implemented for now
    }
}
