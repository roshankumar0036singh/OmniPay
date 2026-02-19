import { TranslateRequest, BatchTranslateRequest, TranslateResponse, BatchTranslateResponse, LingoContext } from '@omnipay/shared/src/types/translation';

// Mock translations for dev environment
const MOCK_TRANSLATIONS: Record<string, string> = {
    "Sony WH-1000XM5": "Sony WH-1000XM5 [Translated]",
    "Vintage Film Camera": "Vintage Film Camera [Translated]",
    "Cart is empty": "Cart is empty [Translated]",
};

export class LingoService {
    private static instance: LingoService;
    private apiKey: string | undefined;

    private constructor() {
        this.apiKey = process.env.LINGO_API_KEY;
    }

    public static getInstance(): LingoService {
        if (!LingoService.instance) {
            LingoService.instance = new LingoService();
        }
        return LingoService.instance;
    }

    async translate(request: TranslateRequest): Promise<TranslateResponse> {
        const { text, targetLang, sourceLang = 'auto', context = 'general' } = request;

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 50));

        // Todo: Integrate actual Lingo.dev API here
        // For now, return mock or simple prefix
        const translatedText = MOCK_TRANSLATIONS[text] || `[${targetLang}] ${text}`;

        return {
            original: text,
            translated: translatedText,
            sourceLang,
            targetLang
        };
    }

    async translateBatch(request: BatchTranslateRequest): Promise<BatchTranslateResponse> {
        const { texts, targetLang, sourceLang = 'auto' } = request;

        // Process in parallel (simulated)
        const translations = await Promise.all(
            texts.map(text => this.translate({ text, targetLang, sourceLang, context: request.context }))
        );

        return { translations };
    }

    async detectLanguage(text: string): Promise<string> {
        // Mock detection
        if (/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/.test(text)) {
            return 'ja';
        }
        return 'en';
    }
}
