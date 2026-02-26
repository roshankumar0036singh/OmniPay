import { BaseAdapter } from './baseAdapter';
import { AmazonAdapter } from './amazonAdapter';
import { MercadoLibreMxAdapter } from './mercadoLibreAdapter';
import { EbayAdapter } from './ebayAdapter';
import { AliExpressAdapter } from './aliexpressAdapter';
import { TemuAdapter } from './temuAdapter';

export class AdapterRegistry {
    private static adapters: Map<string, BaseAdapter[]> = new Map();

    static register(adapter: BaseAdapter) {
        // Register by siteId
        if (!this.adapters.has(adapter.siteId)) {
            this.adapters.set(adapter.siteId, []);
        }
        this.adapters.get(adapter.siteId)!.push(adapter);

        // Register by region
        if (!this.adapters.has(adapter.region)) {
            this.adapters.set(adapter.region, []);
        }
        this.adapters.get(adapter.region)!.push(adapter);
    }

    // Initialize default adapters
    static {
        // Amazon Multi-region
        this.register(new AmazonAdapter('US', 'amazon.com', 'USD'));
        this.register(new AmazonAdapter('DE', 'amazon.de', 'EUR'));
        this.register(new AmazonAdapter('FR', 'amazon.fr', 'EUR'));
        this.register(new AmazonAdapter('ES', 'amazon.es', 'EUR'));
        this.register(new AmazonAdapter('JP', 'amazon.co.jp', 'JPY'));

        // Region Specific
        this.register(new MercadoLibreMxAdapter());

        // Global/US Marketplace
        this.register(new EbayAdapter());
        this.register(new AliExpressAdapter());
        this.register(new TemuAdapter());
    }

    static getAdapters(id: string): BaseAdapter[] {
        return this.adapters.get(id) || [];
    }

    static getAllAdapters(): BaseAdapter[] {
        const all = Array.from(this.adapters.values()).flat();
        // Return unique adapters (since they are registered twice: siteId and region)
        return Array.from(new Set(all));
    }
}
