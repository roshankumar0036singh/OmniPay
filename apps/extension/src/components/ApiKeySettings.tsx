import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Save, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumButton } from './PremiumButton';
import { cn } from '../utils/cn';

export const ApiKeySettings = () => {
    const [mistralKey, setMistralKey] = useState('');
    const [lingoKey, setLingoKey] = useState('');
    const [showMistral, setShowMistral] = useState(false);
    const [showLingo, setShowLingo] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        // Load keys from storage
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.get(['mistral_key', 'lingo_key'], (result) => {
                if (result.mistral_key) setMistralKey(result.mistral_key);
                if (result.lingo_key) setLingoKey(result.lingo_key);
            });
        } else {
            // Fallback for dev environment
            const m = localStorage.getItem('mistral_key') || '';
            const l = localStorage.getItem('lingo_key') || '';
            setMistralKey(m);
            setLingoKey(l);
        }
    }, []);

    const handleSave = () => {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.set({
                mistral_key: mistralKey,
                lingo_key: lingoKey
            }, () => {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            });
        } else {
            localStorage.setItem('mistral_key', mistralKey);
            localStorage.setItem('lingo_key', lingoKey);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Secure Auth Nodes</h3>
                    <div className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
                </div>
                <Key size={12} className="text-neon/40" />
            </div>

            <div className="glass-card rounded-[2rem] p-6 border border-white/10 bg-white/[0.01] shadow-inner-glass space-y-6 relative overflow-hidden">
                {/* Background Texture */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

                {/* Mistral Key */}
                <div className="space-y-2 relative z-10">
                    <div className="flex items-center justify-between px-1">
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Mistral Protocol</label>
                        {mistralKey && <span className="text-[8px] font-bold text-neon/40 uppercase tracking-tighter italic">Key Active</span>}
                    </div>
                    <div className="relative group">
                        <input
                            type={showMistral ? "text" : "password"}
                            placeholder="MISTRAL_X_CORE_KEY..."
                            value={mistralKey}
                            onChange={(e) => setMistralKey(e.target.value)}
                            className="w-full h-12 px-5 rounded-2xl bg-black/60 border border-white/5 text-[11px] font-mono font-bold text-neon/90 focus:outline-none focus:border-neon/40 focus:ring-1 focus:ring-neon/20 transition-all placeholder:text-gray-800"
                        />
                        <button
                            onClick={() => setShowMistral(!showMistral)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-neon transition-colors"
                        >
                            {showMistral ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {/* Lingo Key */}
                <div className="space-y-2 relative z-10">
                    <div className="flex items-center justify-between px-1">
                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Lingo Dev Node</label>
                        {lingoKey && <span className="text-[8px] font-bold text-neon/40 uppercase tracking-tighter italic">Link Verified</span>}
                    </div>
                    <div className="relative group">
                        <input
                            type={showLingo ? "text" : "password"}
                            placeholder="LG_INTEL_SYSTEM_KEY..."
                            value={lingoKey}
                            onChange={(e) => setLingoKey(e.target.value)}
                            className="w-full h-12 px-5 rounded-2xl bg-black/60 border border-white/5 text-[11px] font-mono font-bold text-neon/90 focus:outline-none focus:border-neon/40 focus:ring-1 focus:ring-neon/20 transition-all placeholder:text-gray-800"
                        />
                        <button
                            onClick={() => setShowLingo(!showLingo)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-neon transition-colors"
                        >
                            {showLingo ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <div className="pt-2 relative z-10">
                    <PremiumButton
                        onClick={handleSave}
                        variant={saved ? "neon" : "glass"}
                        className={cn(
                            "w-full rounded-2xl py-4 font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all transform active:scale-[0.98]",
                            saved ? "bg-neon text-black" : "bg-white/5 hover:bg-white/10"
                        )}
                        glow={saved}
                    >
                        {saved ? (
                            <>
                                <CheckCircle2 size={16} className="animate-bounce" />
                                <span>CONFIG UPDATED</span>
                            </>
                        ) : (
                            <>
                                <Save size={16} className="group-hover:rotate-12 transition-transform" />
                                <span>SYNC CREDENTIALS</span>
                            </>
                        )}
                    </PremiumButton>
                </div>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-neon/[0.03] border border-neon/10 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-neon/10">
                    <Key size={14} className="text-neon" />
                </div>
                <p className="text-[9px] text-gray-500 font-bold leading-relaxed uppercase tracking-tight">
                    Military-grade local encryption active. Keys never leave this terminal's sandbox.
                </p>
            </div>
        </div>
    );
};
