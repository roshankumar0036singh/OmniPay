import { useState, useEffect } from 'react';
import en from '../locales/en.json';
import ja from '../locales/ja.json';

const translations: Record<string, Record<string, string>> = {
    en,
    ja
};

export const useTranslation = () => {
    // Default to 'en' for now. In a real app, read from chrome.storage or browser navigator.language
    const [locale, setLocale] = useState('en');

    useEffect(() => {
        // Mock loading locale from storage
        const savedLocale = localStorage.getItem('omnipay-locale');
        if (savedLocale && translations[savedLocale]) {
            setLocale(savedLocale);
        }
    }, []);

    const changeLanguage = (lang: string) => {
        if (translations[lang]) {
            setLocale(lang);
            localStorage.setItem('omnipay-locale', lang);
        }
    };

    const t = (key: string): string => {
        const currentTranslations = translations[locale] || translations['en'];
        return currentTranslations[key] || key;
    };

    return { t, locale, changeLanguage };
};
