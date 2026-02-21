import { BaseAdapter } from './baseAdapter';
import { AmazonJpAdapter } from './amazonJpAdapter';

export class AdapterRegistry {
    private static adapters: Map<string, BaseAdapter> = new Map();

    static register(adapter: BaseAdapter) {
        this.adapters.set(adapter.siteId, adapter);
        this.adapters.set(adapter.region, adapter); // Also register by region code for easier lookup
    }

    // Initialize default adapters
    static {
        this.register(new AmazonJpAdapter());
    }

    static getAdapter(id: string): BaseAdapter | undefined {
        return this.adapters.get(id);
    }

    static getAllAdapters(): BaseAdapter[] {
        return Array.from(this.adapters.values());
    }
}
