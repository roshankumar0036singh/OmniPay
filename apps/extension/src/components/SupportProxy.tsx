import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Globe, RefreshCw, X, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { PremiumButton } from './PremiumButton';
import { cn } from '../utils/cn';

interface TicketMessage {
    id: string;
    sender: 'user' | 'seller';
    originalText: string;
    translatedText: string;
    timestamp: string;
}

interface SupportTicket {
    id: string;
    orderId: string;
    status: 'open' | 'closed';
    subject: string;
    messages: TicketMessage[];
}

export const SupportProxy = ({ productId, title }: { productId?: string, title?: string }) => {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();

    const fetchTickets = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/support', {
                headers: { 'Authorization': 'Bearer dev-token' }
            });
            if (res.ok) {
                const data = await res.json();
                setTickets(data);
            }
        } catch (e) {
            console.error("Failed to fetch tickets", e);
        }
    };

    useEffect(() => {
        fetchTickets();
        const interval = setInterval(fetchTickets, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (activeTicket) {
            const updated = tickets.find(t => t.id === activeTicket.id);
            if (updated) setActiveTicket(updated);
        }
    }, [tickets]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeTicket?.messages]);

    const handleCreateTicket = async () => {
        if (!inputText.trim()) return;
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3000/api/support', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer dev-token'
                },
                body: JSON.stringify({
                    orderId: `ord_${productId || 'general'}`,
                    subject: title || "General Inquiry",
                    message: inputText
                })
            });
            if (res.ok) {
                const newTicket = await res.json();
                setTickets([...tickets, newTicket]);
                setActiveTicket(newTicket);
                setInputText("");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async () => {
        if (!inputText.trim() || !activeTicket) return;
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/api/support/${activeTicket.id}/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer dev-token'
                },
                body: JSON.stringify({ message: inputText })
            });
            if (res.ok) {
                const updatedTicket = await res.json();
                setActiveTicket(updatedTicket);
                setInputText("");
                fetchTickets();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const renderChat = () => {
        if (!activeTicket) return null;

        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col h-full"
            >
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
                    <PremiumButton variant="glass" size="icon" onClick={() => setActiveTicket(null)} className="h-8 w-8 hover:bg-white/5 rounded-full">
                        <ArrowLeft size={16} className="text-gray-400" />
                    </PremiumButton>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-black truncate text-white italic truncate">{activeTicket.subject}</h3>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{activeTicket.id}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[8px] text-neon bg-neon/10 px-2 py-1 rounded-full border border-neon/20 font-black uppercase tracking-tighter shadow-neon/10">
                        <Globe size={10} /> Live Translate
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 scrollbar-hide">
                    {activeTicket.messages.map((msg, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            key={msg.id}
                            className={cn("flex flex-col", msg.sender === 'user' ? 'items-end' : 'items-start')}
                        >
                            <div className={cn(
                                "max-w-[85%] rounded-2xl p-3 shadow-glass",
                                msg.sender === 'user'
                                    ? 'bg-neon/10 border border-neon/20 text-right rounded-tr-none'
                                    : 'glass-panel border-white/5 rounded-tl-none'
                            )}>
                                <p className="text-sm font-medium leading-relaxed">{msg.originalText}</p>
                                <div className="mt-2 pt-2 border-t border-white/5 opacity-50 flex items-center gap-1.5">
                                    <Globe size={10} className="text-neon" />
                                    <p className="text-[10px] italic font-medium">
                                        {msg.translatedText}
                                    </p>
                                </div>
                            </div>
                            <span className="text-[8px] text-gray-600 mt-1 uppercase font-black px-1">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="flex gap-2 p-2 bg-white/5 rounded-2xl border border-white/10 group focus-within:border-neon/30 transition-all">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleReply()}
                        placeholder="Type in English..."
                        className="flex-1 bg-transparent border-none px-2 py-1 text-sm focus:outline-none placeholder:text-gray-600 font-medium text-white"
                        disabled={loading || activeTicket.status === 'closed'}
                    />
                    <PremiumButton
                        variant="neon"
                        size="icon"
                        onClick={handleReply}
                        disabled={loading || !inputText.trim() || activeTicket.status === 'closed'}
                        className="h-8 w-8 rounded-xl shrink-0"
                    >
                        {loading ? <RefreshCw className="animate-spin" size={14} /> : <Send size={14} />}
                    </PremiumButton>
                </div>
            </motion.div>
        );
    };

    const renderList = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-base font-black text-white italic uppercase tracking-tight">Active Tickets</h3>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">{tickets.length} total inquiries</p>
                </div>
                <PremiumButton variant="glass" size="icon" onClick={fetchTickets} className="h-8 w-8 rounded-full border-white/10">
                    <RefreshCw size={14} className={loading ? "animate-spin" : "text-gray-400"} />
                </PremiumButton>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-1 scrollbar-hide">
                <AnimatePresence>
                    {tickets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 opacity-30">
                            <MessageSquare size={32} className="mb-2" />
                            <p className="text-xs font-bold uppercase tracking-widest">No active tickets</p>
                        </div>
                    ) : (
                        tickets.map((ticket, idx) => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                key={ticket.id}
                                onClick={() => setActiveTicket(ticket)}
                                className="glass-panel hover:bg-white/5 border-white/5 hover:border-white/10 p-4 cursor-pointer transition-all group relative overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-black text-white italic uppercase truncate flex-1 pr-4">{ticket.subject}</span>
                                    <span className={cn(
                                        "text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border",
                                        ticket.status === 'open' ? 'bg-neon/10 text-neon border-neon/20 shadow-neon/10' : 'bg-gray-500/10 text-gray-500 border-white/10'
                                    )}>
                                        {ticket.status}
                                    </span>
                                </div>
                                <p className="text-[11px] text-gray-500 font-medium truncate opacity-60 group-hover:opacity-100 transition-opacity">
                                    {ticket.messages[ticket.messages.length - 1]?.originalText || "Awaiting support..."}
                                </p>
                                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-neon opacity-0 group-hover:opacity-100 transition-opacity shadow-neon" />
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            <div className="space-y-3">
                <div className="relative">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={t('support.newInquiry')}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-neon/30 transition-all min-h-[80px] resize-none font-medium text-white placeholder:text-gray-600"
                        disabled={loading}
                    />
                    <PremiumButton
                        variant="neon"
                        glow
                        onClick={handleCreateTicket}
                        disabled={loading || !inputText.trim()}
                        className="absolute bottom-3 right-3 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest"
                    >
                        {loading ? <RefreshCw className="animate-spin" size={14} /> : "Submit"}
                    </PremiumButton>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="w-full h-full flex flex-col font-sans">
            {activeTicket ? renderChat() : renderList()}
        </div>
    );
};
