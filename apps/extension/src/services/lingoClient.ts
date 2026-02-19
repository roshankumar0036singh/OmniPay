export class LingoClient {
    private static API_URL = "http://localhost:3000/api";

    static async translateBatch(texts: string[], targetLang: string = "en", sourceLang?: string): Promise<string[]> {
        if (texts.length === 0) return [];

        try {
            const response = await fetch(`${LingoClient.API_URL}/translate/batch`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Use dummy token
                    "Authorization": "Bearer dev-token"
                },
                body: JSON.stringify({
                    texts,
                    targetLang,
                    sourceLang,
                    context: "ecommerce"
                })
            });

            if (!response.ok) {
                console.error("[LingoClient] Translation failed:", response.status, response.statusText);
                return texts;
            }

            const data = await response.json();
            if (Array.isArray(data) && data.length === texts.length) {
                return data;
            }
            return texts;

        } catch (error) {
            console.error("[LingoClient] Network error:", error);
            return texts;
        }
    }
}
