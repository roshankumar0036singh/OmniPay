import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Globe, RefreshCw } from 'lucide-react';

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
        const interval = setInterval(fetchTickets, 3000); // Poll for random seller responses
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
            <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
                    <button onClick={() => setActiveTicket(null)} className="text-gray-400 hover:text-neon text-xs">← Back</button>
                    <h3 className="text-sm font-bold truncate flex-1">{activeTicket.subject}</h3>
                    <div className="flex items-center gap-1 text-[10px] text-neon bg-neon/10 px-2 py-0.5 rounded border border-neon/30">
                        <Globe size={10} /> Auto-Translating
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-2 custom-scrollbar">
                    {activeTicket.messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col \${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[85%] rounded-lg p-2 \${msg.sender === 'user' ? 'bg-neon/20 border border-neon/30 text-right' : 'bg-white/10 border border-white/20'}`}>
                                <p className="text-sm">{msg.originalText}</p>
                                <p className="text-[10px] text-gray-400 mt-1 italic border-t border-white/10 pt-1">
                                    {msg.translatedText}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="flex gap-2 relative">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleReply()}
                        placeholder="Type message in English..."
                        className="flex-1 bg-black border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon transition-colors"
                        disabled={loading || activeTicket.status === 'closed'}
                    />
                    <button
                        onClick={handleReply}
                        disabled={loading || !inputText.trim() || activeTicket.status === 'closed'}
                        className="bg-neon text-black p-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed hidden md:block" // Hidden on very small screens for compact mode
                    >
                        {loading ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
                    </button>
                </div>
            </div>
        );
    };

    const renderList = () => (
        <div className="flex flex-col h-full">
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                <MessageSquare className="text-neon" size={16} /> Support Tickets
            </h3>

            <div className="flex-1 overflow-y-auto space-y-2 mb-3 custom-scrollbar">
                {tickets.length === 0 ? (
                    <div className="text-center text-gray-500 text-xs py-4">No active tickets.</div>
                ) : (
                    tickets.map(ticket => (
                        <div
                            key={ticket.id}
                            onClick={() => setActiveTicket(ticket)}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 cursor-pointer transition-colors"
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold truncate flex-1 pr-2">{ticket.subject}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider \${ticket.status === 'open' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                    {ticket.status}
                                </span>
                            </div>
                            <p className="text-[11px] text-gray-400 truncate">
                                {ticket.messages[ticket.messages.length - 1]?.originalText || "No messages"}
                            </p>
                        </div>
                    ))
                )}
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateTicket()}
                    placeholder={title ? `Ask about \${title}...` : "New inquiry..."}
                    className="flex-1 bg-black border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon transition-colors"
                    disabled={loading}
                />
                <button
                    onClick={handleCreateTicket}
                    disabled={loading || !inputText.trim()}
                    className="bg-neon text-black p-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-black/95 backdrop-blur-2xl border border-neon/50 p-4 rounded-xl shadow-[0_0_30px_rgba(74,222,128,0.15)] w-[360px] h-[450px] font-sans text-white z-50 overflow-hidden flex flex-col pointer-events-auto">
            {activeTicket ? renderChat() : renderList()}
        </div>
    );
};
