import { BaseAdapter } from './baseAdapter';
import { ScrapedProduct } from '@omnipay/shared/src/types/product';
import * as cheerio from 'cheerio';

export class EbayAdapter extends BaseAdapter {
    siteId = 'ebay_us';
    domain = 'ebay.com';
    region = 'US';

    protected getSearchUrl(query: string): string {
        return `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`;
    }

    protected async parseSearchResults($: cheerio.CheerioAPI): Promise<ScrapedProduct[]> {
        const products: ScrapedProduct[] = [];

        $('.s-item__wrapper').each((_, element) => {
            try {
                const title = $(element).find('.s-item__title').text().trim();
                const priceText = $(element).find('.s-item__price').text().trim();
                const image = $(element).find('.s-item__image-img').attr('src') || '';
                const link = $(element).find('.s-item__link').attr('href');

                // eBay prices can be "$12.99" or "$12.99 to $15.99"
                const priceMatch = priceText.match(/[0-9,.]+/);
                const price = priceMatch ? parseFloat(priceMatch[0].replace(/,/g, '')) : 0;

                if (title && price && link && !title.includes('Shop on eBay')) {
                    products.push({
                        id: link.split('/itm/')[1]?.split('?')[0] || Math.random().toString(36).substr(2, 9),
                        title,
                        price,
                        currency: 'USD',
                        image,
                        url: link,
                        site: 'eBay',
                        region: 'US'
                    });
                }
            } catch (e) {
                // Skip
            }
        });

        return products;
    }

    protected async parseProductPage($: cheerio.CheerioAPI, url: string): Promise<ScrapedProduct | null> {
        const title = $('.x-item-title__mainTitle').text().trim();
        const priceText = $('.x-price-primary').text().trim();
        const priceMatch = priceText.match(/[0-9,.]+/);
        const price = priceMatch ? parseFloat(priceMatch[0].replace(/,/g, '')) : 0;
        const image = $('.ux-image-magnify__image--main').attr('src') || '';

        if (!title) return null;

        return {
            id: url.split('/itm/')[1]?.split('?')[0] || 'ebay-placeholder',
            title,
            price,
            currency: 'USD',
            image,
            url,
            site: 'eBay',
            region: 'US'
        };
    }
}
