import { TranslateRequest, BatchTranslateRequest, TranslateResponse, BatchTranslateResponse, LingoContext } from '@omnipay/shared/src/types/translation';

import Redis from 'ioredis';

const MOCK_TRANSLATIONS: Record<string, string> = {
    "Sony WH-1000XM5": "Sony WH-1000XM5 [Translated]",
    "Vintage Film Camera": "Vintage Film Camera [Translated]",
    "Cart is empty": "Cart is empty [Translated]",
};

export class LingoService {
    private static instance: LingoService;
    private apiKey: string | undefined;
    private redis: Redis | null = null;

    private constructor() {
        this.apiKey = process.env.LINGO_API_KEY;
        if (process.env.REDIS_URL) {
            try {
                this.redis = new Redis(process.env.REDIS_URL);
                this.redis.on('error', (err) => {
                    console.warn('[LingoService] Redis connection failed, cache disabled.');
                    this.redis = null;
                });
            } catch (e) {
                this.redis = null;
            }
        }
    }

    public static getInstance(): LingoService {
        if (!LingoService.instance) {
            LingoService.instance = new LingoService();
        }
        return LingoService.instance;
    }

    async translate(request: TranslateRequest, userApiKey?: string): Promise<TranslateResponse> {
        const { text, targetLang, sourceLang = 'auto', context = 'general' } = request;
        const activeKey = userApiKey || this.apiKey;

        // 1. Check Redis Cache
        const cacheKey = `trans:${sourceLang}:${targetLang}:${text}`;
        if (this.redis) {
            const cached = await this.redis.get(cacheKey);
            if (cached) {
                return { original: text, translated: cached, sourceLang, targetLang, cached: true };
            }
        }

        // 2. Call Lingo.dev Live API
        let translatedText = text;
        if (activeKey && activeKey !== 'mock_key') {
            try {
                // Assuming standard REST API format for Lingo.dev
                const res = await fetch('https://api.lingo.dev/v1/translate', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${activeKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ q: text, target: targetLang, source: sourceLang, context })
                });

                if (res.ok) {
                    const data = await res.json();
                    translatedText = data.translatedText || data.data?.translations[0]?.translatedText || text;
                } else {
                    console.error("[LingoService] API returned status", res.status);
                    throw new Error("API Failure");
                }
            } catch (err) {
                console.error("[LingoService] Live translation failed, falling back", err);
                translatedText = MOCK_TRANSLATIONS[text] || `[${targetLang}] ${text}`;
            }
        } else {
            translatedText = MOCK_TRANSLATIONS[text] || `[${targetLang}] ${text}`;
        }

        // 3. Set Cache
        if (this.redis) {
            await this.redis.set(cacheKey, translatedText, 'EX', 60 * 60 * 24 * 7); // 1-week expiry
        }

        return {
            original: text,
            translated: translatedText,
            sourceLang,
            targetLang,
            cached: false
        };
    }

    async translateBatch(request: BatchTranslateRequest, userApiKey?: string): Promise<BatchTranslateResponse> {
        const { texts, targetLang, sourceLang = 'auto' } = request;
        const translations = await Promise.all(
            texts.map(text => this.translate({ text, targetLang, sourceLang, context: request.context }, userApiKey))
        );
        return { translations };
    }

    async detectLanguage(text: string): Promise<string> {
        if (/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/.test(text)) {
            return 'ja';
        }
        return 'en';
    }
}
