import { BaseAdapter } from './baseAdapter';
import { ScrapedProduct } from '@omnipay/shared/src/types/product';
import * as cheerio from 'cheerio';

export class MercadoLibreMxAdapter extends BaseAdapter {
    siteId = 'mercadolibre_mx';
    domain = 'mercadolibre.com.mx';
    region = 'MX';

    protected getSearchUrl(query: string): string {
        return `https://listado.mercadolibre.com.mx/${encodeURIComponent(query)}`;
    }

    protected async parseSearchResults($: cheerio.CheerioAPI): Promise<ScrapedProduct[]> {
        const products: ScrapedProduct[] = [];

        $('.ui-search-result__wrapper').each((_, element) => {
            try {
                const title = $(element).find('.ui-search-item__title').text().trim();
                const priceFraction = $(element).find('.andes-money-amount__fraction').first().text().trim();
                const priceCents = $(element).find('.andes-money-amount__cents').first().text().trim() || '00';
                const image = $(element).find('.ui-search-result-image__element').attr('data-src') || $(element).find('.ui-search-result-image__element').attr('src') || '';
                const link = $(element).find('.ui-search-link').attr('href');

                const price = parseFloat(`${priceFraction.replace(/[.,]/g, '')}.${priceCents}`);

                if (title && price && link) {
                    products.push({
                        id: link.split('MLM-')[1]?.split('-')[0] || Math.random().toString(36).substr(2, 9),
                        title,
                        price,
                        currency: 'MXN',
                        image,
                        url: link,
                        site: 'Mercado Libre MX',
                        region: 'MX'
                    });
                }
            } catch (e) {
                // Skip
            }
        });

        return products;
    }

    protected async parseProductPage($: cheerio.CheerioAPI, url: string): Promise<ScrapedProduct | null> {
        const title = $('.ui-pdp-title').text().trim();
        const priceFraction = $('.ui-pdp-price__part .andes-money-amount__fraction').first().text().trim();
        const priceCents = $('.ui-pdp-price__part .andes-money-amount__cents').first().text().trim() || '00';
        const price = parseFloat(`${priceFraction.replace(/[.,]/g, '')}.${priceCents}`);
        const image = $('.ui-pdp-gallery__figure__image').first().attr('src') || '';

        if (!title) return null;

        return {
            id: url.split('MLM-')[1]?.split('-')[0] || 'ml-placeholder',
            title,
            price,
            currency: 'MXN',
            image,
            url,
            site: 'Mercado Libre MX',
            region: 'MX'
        };
    }
}
