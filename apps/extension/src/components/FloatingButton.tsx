import { useState } from 'react';
import { ScrapedProduct } from '../lib/adapters/baseAdapter';
import { Plus, X, ShoppingBag, Languages } from 'lucide-react';
import { LingoChip } from './LingoChip';
import { DomTranslator } from '../lib/domTranslator';
import { LingoClient } from '../services/lingoClient';

export const FloatingButton = ({ product }: { product: ScrapedProduct }) => {
    const [expanded, setExpanded] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);

    const handleTranslate = async () => {
        setIsTranslating(true);
        const translator = new DomTranslator();
        const nodes = translator.extractTextNodes();

        if (nodes.length === 0) {
            setIsTranslating(false);
            return;
        }

        console.log(`[OmniPay] Found ${nodes.length} translatable nodes`);

        // Extract original texts
        const originalTexts = nodes.map(n => n.originalText);

        try {
            // Call Backend API
            // TODO: Get target language from user settings, defaulting to English for now
            const translatedTexts = await LingoClient.translateBatch(originalTexts, "en");

            // Apply translations
            nodes.forEach((node, index) => {
                if (translatedTexts[index]) {
                    translator.replaceNodeWithTranslation(node, translatedTexts[index]);
                }
            });
        } catch (e) {
            console.error("[OmniPay] Translation failed", e);
        }

        setIsTranslating(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-sans group">
            {expanded && (
                <div className="mb-4 bg-lingo-dark/95 backdrop-blur-xl border border-white/10 p-5 shadow-2xl rounded-2xl w-80 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-3">
                        <div className="w-8 h-8 rounded-lg bg-lingo-green/10 flex items-center justify-center text-lingo-green">
                            <ShoppingBag size={16} />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-sm">Product Detected</h3>
                            <p className="text-gray-400 text-[10px] uppercase tracking-wide">Ready to Analyze</p>
                        </div>
                    </div>

                    <div className="flex gap-3 mb-4">
                        <img src={product.imageUrl} className="w-16 h-16 rounded-lg object-cover bg-white/5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-gray-200 text-xs font-medium line-clamp-2 mb-1">{product.title}</p>
                            <p className="text-lg font-bold text-white">{product.currency} {product.price.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button className="col-span-2 w-full bg-white text-black font-bold py-2 rounded-xl text-xs hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                            <Plus size={14} /> Add to OmniCart
                        </button>
                        <button
                            onClick={handleTranslate}
                            disabled={isTranslating}
                            className="col-span-2 w-full bg-lingo-card border border-white/10 text-white font-bold py-2 rounded-xl text-xs hover:bg-white/5 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Languages size={14} className={isTranslating ? 'animate-spin' : ''} />
                            {isTranslating ? 'Translating Page...' : 'Translate Page'}
                        </button>
                    </div>
                </div>
            )}

            <button
                onClick={() => setExpanded(!expanded)}
                className="relative group bg-lingo-dark border border-white/10 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-all duration-300 hover:border-lingo-green/50"
            >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-lingo-green/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                {expanded ? (
                    <X size={24} className="text-white relative z-10" />
                ) : (
                    <LingoChip className="w-8 h-8 relative z-10 pointer-events-none" />
                )}
            </button>
        </div>
    );
};
