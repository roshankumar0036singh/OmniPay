import { useState, useEffect } from 'react';
import en from '../locales/en.json';
import ja from '../locales/ja.json';
import es from '../locales/es.json';
import zh from '../locales/zh.json';
import fr from '../locales/fr.json';

const translations: Record<string, Record<string, string>> = {
    en, ja, es, zh, fr
    // Other 20+ locales will fallback to English until their JSON files are created
};

export const useTranslation = () => {
    const [locale, setLocale] = useState('en');

    useEffect(() => {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.get(['omnipay-locale'], (result) => {
                if (result['omnipay-locale']) {
                    setLocale(result['omnipay-locale']);
                }
            });
        } else {
            const savedLocale = localStorage.getItem('omnipay-locale');
            if (savedLocale) {
                setLocale(savedLocale);
            }
        }
    }, []);

    const changeLanguage = (lang: string) => {
        setLocale(lang);
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.set({ 'omnipay-locale': lang }, () => {
                window.location.reload();
            });
        } else {
            localStorage.setItem('omnipay-locale', lang);
            window.location.reload();
        }
    };

    const t = (key: string): string => {
        const currentTranslations = translations[locale] || translations['en'];
        return currentTranslations[key] || key;
    };

    return { t, locale, changeLanguage };
};
