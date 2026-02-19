import { useState } from 'react';
import { ScrapedProduct } from '../lib/adapters/baseAdapter';

export const FloatingButton = ({ product }: { product: ScrapedProduct }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="fixed bottom-4 right-4 z-[9999] font-mono group">
            {expanded && (
                <div className="mb-2 bg-black border-2 border-[#00FF00] p-4 shadow-[0_0_10px_#00FF00] w-64 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <h3 className="text-[#00FF00] font-bold text-xs uppercase border-b border-[#00FF00] pb-1 mb-2">
                        &gt; ITEM_DETECTED
                    </h3>
                    <p className="text-white text-xs truncate mb-1">{product.title}</p>
                    <p className="text-[#00FF00] font-bold text-sm mb-3">
                        {product.currency} {product.price.toLocaleString()}
                    </p>
                    <button className="w-full bg-[#00FF00] text-black font-bold py-1 text-xs uppercase hover:bg-white transition-colors">
                        [+] ADD_TO_CART
                    </button>
                    <button className="w-full mt-2 border border-[#00FF00] text-[#00FF00] py-1 text-xs uppercase hover:bg-[#00FF00]/10 transition-colors">
                        [?] CHECK_GLOBALS
                    </button>
                </div>
            )}

            <button
                onClick={() => setExpanded(!expanded)}
                className="bg-black text-[#00FF00] border-2 border-[#00FF00] w-12 h-12 flex items-center justify-center font-bold text-xl shadow-[0_0_10px_#00FF00] hover:scale-110 transition-transform"
            >
                {expanded ? 'X' : 'OP'}
            </button>
        </div>
    );
};
