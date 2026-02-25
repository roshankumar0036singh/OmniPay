import { SearchResult } from '../stores/useSearchStore';

class ApiClient {
    private static API_URL = "http://localhost:3000/api";

    private static async getKeys() {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            return new Promise<{ mistral_key?: string, lingo_key?: string }>((resolve) => {
                chrome.storage.local.get(['mistral_key', 'lingo_key'], (result) => resolve(result));
            });
        }
        return {
            mistral_key: localStorage.getItem('mistral_key') || undefined,
            lingo_key: localStorage.getItem('lingo_key') || undefined
        };
    }

    static async search(query: string, regions: string[]): Promise<SearchResult[]> {
        const keys = await this.getKeys();
        try {
            const response = await fetch(`${this.API_URL}/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Mistral-Key': keys.mistral_key || '',
                    'X-Lingo-Key': keys.lingo_key || ''
                },
                body: JSON.stringify({ query, regions })
            });

            if (!response.ok) return [];
            const data = await response.json();
            return data.results || [];
        } catch (error) {
            console.error('[ApiClient] Search error:', error);
            return [];
        }
    }

    static async analyzeSentiment(productId: string, title: string) {
        const keys = await this.getKeys();
        try {
            const response = await fetch(`${this.API_URL}/sentiment/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Mistral-Key': keys.mistral_key || ''
                },
                body: JSON.stringify({ productId, title })
            });
            return response.ok ? await response.json() : null;
        } catch (e) {
            return null;
        }
    }

    static async scanEthical(productId: string, title: string, description: string) {
        const keys = await this.getKeys();
        try {
            const response = await fetch(`${this.API_URL}/ethical/scan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Mistral-Key': keys.mistral_key || ''
                },
                body: JSON.stringify({ productId, title, description })
            });
            return response.ok ? await response.json() : null;
        } catch (e) {
            return null;
        }
    }
}

export { ApiClient };
