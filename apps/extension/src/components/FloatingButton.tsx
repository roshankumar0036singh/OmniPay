import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrapedProduct } from '../lib/adapters/baseAdapter';
import { Plus, X, ShoppingBag, Languages, Sparkles } from 'lucide-react';
import { LingoChip } from './LingoChip';
import { DomTranslator } from '../lib/domTranslator';
import { LingoClient } from '../services/lingoClient';
import { PremiumButton } from './PremiumButton';
import { cn } from '../utils/cn';

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

        const originalTexts = nodes.map(n => n.originalText);

        try {
            const translatedTexts = await LingoClient.translateBatch(originalTexts, "en");
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
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(10px)' }}
                        className="mb-4 glass-panel p-5 shadow-glass rounded-3xl w-80 relative overflow-hidden"
                    >
                        {/* Decorative Background */}
                        <div className="absolute top-0 left-0 w-32 h-32 bg-neon/5 blur-3xl -ml-16 -mt-16 pointer-events-none" />

                        <div className="flex items-center gap-3 mb-5 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-neon/10 flex items-center justify-center text-neon border border-neon/20 shadow-neon">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-black text-sm tracking-tight italic">AI INTELLIGENCE</h3>
                                <p className="text-neon/70 text-[9px] font-black uppercase tracking-widest">Active Analysis</p>
                            </div>
                        </div>

                        <div className="flex gap-4 mb-6 relative z-10">
                            <div className="w-20 h-20 rounded-2xl bg-black/40 border border-white/5 overflow-hidden ring-1 ring-white/10 shrink-0">
                                <img src={product.imageUrl} className="w-full h-full object-cover opacity-90" />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <p className="text-white text-xs font-bold line-clamp-2 mb-1 leading-tight">{product.title}</p>
                                <p className="text-xl font-black text-white tracking-tighter">
                                    <span className="text-neon text-xs mr-1 opacity-70 font-sans uppercase">{product.currency}</span>
                                    {product.price.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 relative z-10">
                            <PremiumButton variant="neon" glow className="w-full py-4 rounded-xl text-[11px] font-black uppercase tracking-widest">
                                <Plus size={16} className="mr-2" /> Add to OmniCart
                            </PremiumButton>

                            <PremiumButton
                                variant="glass"
                                size="md"
                                onClick={handleTranslate}
                                disabled={isTranslating}
                                className="w-full py-4 rounded-xl text-[11px] font-black uppercase tracking-widest border border-white/5"
                            >
                                <Languages size={16} className={cn("mr-2", isTranslating ? 'animate-spin' : '')} />
                                {isTranslating ? 'Translating...' : 'Translate Page'}
                            </PremiumButton>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1, rotate: expanded ? 90 : 0 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setExpanded(!expanded)}
                className="relative bg-lingo-dark border border-white/20 w-16 h-16 rounded-3xl flex items-center justify-center shadow-glass hover:border-neon transition-colors duration-500 overflow-hidden group"
            >
                {/* Dynamic Inner Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-neon/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {expanded ? (
                    <X size={28} className="text-white relative z-10" />
                ) : (
                    <LingoChip className="w-9 h-9 relative z-10 pointer-events-none" />
                )}
            </motion.button>
        </div>
    );
};

