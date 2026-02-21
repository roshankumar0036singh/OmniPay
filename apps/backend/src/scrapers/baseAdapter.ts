import { ScrapedProduct } from '@omnipay/shared/src/types/product';
import axios from 'axios';
import * as cheerio from 'cheerio';

export abstract class BaseAdapter {
    abstract siteId: string;
    abstract domain: string;
    abstract region: string;

    /**
     * Main entry point to scrape a search result page
     */
    async scrapeSearchResults(query: string): Promise<ScrapedProduct[]> {
        const url = this.getSearchUrl(query);
        console.log(`[${this.siteId}] Scraping search: ${url}`);

        try {
            const html = await this.fetchHtml(url);
            const $ = cheerio.load(html);
            return this.parseSearchResults($);
        } catch (error) {
            console.error(`[${this.siteId}] Scraping failed:`, error);
            return [];
        }
    }

    /**
     * Main entry point to scrape a single product page
     */
    async scrapeProduct(url: string): Promise<ScrapedProduct | null> {
        console.log(`[${this.siteId}] Scraping product: ${url}`);
        try {
            const html = await this.fetchHtml(url);
            const $ = cheerio.load(html);
            return this.parseProductPage($, url);
        } catch (error) {
            console.error(`[${this.siteId}] Product scrape failed:`, error);
            return null;
        }
    }

    protected async fetchHtml(url: string): Promise<string> {
        const response = await axios.get(url, {
            headers: {
                // Mimic a real browser to avoid some bot detection
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });
        return response.data;
    }

    protected abstract getSearchUrl(query: string): string;
    protected abstract parseSearchResults($: cheerio.CheerioAPI): Promise<ScrapedProduct[]>;
    protected abstract parseProductPage($: cheerio.CheerioAPI, url: string): Promise<ScrapedProduct | null>;
}
