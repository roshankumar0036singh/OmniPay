import { SearchResult } from '../stores/useSearchStore';

class ApiClient {
    private static API_URL = "http://localhost:3000/api";

    static async search(query: string, regions: string[]): Promise<SearchResult[]> {
        console.log(`[ApiClient] Searching for "${query}" in`, regions);
        try {
            const response = await fetch(`${this.API_URL}/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}` // TODO: Add auth
                },
                body: JSON.stringify({ query, regions })
            });

            if (!response.ok) {
                console.error(`[ApiClient] Search failed: ${response.status} ${response.statusText}`);
                return [];
            }

            const data = await response.json();
            return data.results || [];
        } catch (error) {
            console.error('[ApiClient] Network error:', error);
            return [];
        }
    }
}

export { ApiClient };
