import { BaseAdapter } from './baseAdapter';
import { ScrapedProduct } from '@omnipay/shared/src/types/product';
import * as cheerio from 'cheerio';

export class AliExpressAdapter extends BaseAdapter {
    siteId = 'aliexpress_global';
    domain = 'aliexpress.com';
    region = 'GLOBAL';

    protected getSearchUrl(query: string): string {
        return `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(query)}`;
    }

    protected async parseSearchResults($: cheerio.CheerioAPI): Promise<ScrapedProduct[]> {
        const products: ScrapedProduct[] = [];

        // Note: AliExpress uses highly dynamic classes, targeting generic patterns
        $('.list-container .search-card-item').each((_, element) => {
            try {
                const title = $(element).find('.multi--titleText--n9M1Y9l').text().trim();
                const priceText = $(element).find('.multi--price-sale--399S18n').text().trim();
                const image = $(element).find('.multi--image--1v8B2H4').attr('src') || '';
                const link = $(element).find('a').attr('href');

                const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));

                if (title && price && link) {
                    products.push({
                        id: link.split('.html')[0].split('/').pop() || Math.random().toString(36).substr(2, 9),
                        title,
                        price,
                        currency: 'USD',
                        image: image.startsWith('//') ? `https:${image}` : image,
                        url: link.startsWith('http') ? link : `https:${link}`,
                        site: 'AliExpress',
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
        const title = $('.pdp-product-title').text().trim();
        const priceText = $('.pdp-price').text().trim();
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        const image = $('.pdp-main-image img').attr('src') || '';

        if (!title) return null;

        return {
            id: url.split('.html')[0].split('/').pop() || 'ax-placeholder',
            title,
            price: price || 0,
            currency: 'USD',
            image,
            url,
            site: 'AliExpress',
            region: 'Global'
        };
    }
}
