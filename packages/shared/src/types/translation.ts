export interface TranslateRequest {
    text: string;
    sourceLang?: string;
    targetLang: string;
    context?: string; // e.g., "fashion", "electronics", "ui"
}

export interface BatchTranslateRequest {
    texts: string[];
    sourceLang?: string;
    targetLang: string;
    context?: string;
}

export interface TranslateResponse {
    original: string;
    translated: string;
    sourceLang: string;
    targetLang: string;
}

export interface BatchTranslateResponse {
    translations: TranslateResponse[];
}

export type LingoContext = 'general' | 'fashion' | 'electronics' | 'home' | 'beauty' | 'auto';
