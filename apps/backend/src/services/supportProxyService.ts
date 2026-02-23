import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface TicketMessage {
    id: string;
    sender: 'user' | 'seller';
    originalText: string;
    translatedText: string;
    timestamp: Date;
}

export interface SupportTicket {
    id: string;
    orderId: string;
    status: 'open' | 'closed';
    subject: string;
    messages: TicketMessage[];
}

export class SupportProxyService {
    // In-memory store for MVP to avoid complex DB setup right now.
    private static tickets: Record<string, SupportTicket> = {};

    static async getTickets(userId: string): Promise<SupportTicket[]> {
        return Object.values(this.tickets);
    }

    static async getTicket(ticketId: string): Promise<SupportTicket | null> {
        return this.tickets[ticketId] || null;
    }

    static async createTicket(userId: string, orderId: string, subject: string, initialMessage: string): Promise<SupportTicket> {
        const ticketId = `tkt_${Date.now()}`;

        const newTicket: SupportTicket = {
            id: ticketId,
            orderId,
            status: 'open',
            subject,
            messages: [
                {
                    id: `msg_${Date.now()}`,
                    sender: 'user',
                    originalText: initialMessage,
                    // In a real app, send to Lingo.dev to translate to seller's language
                    translatedText: `[Translated to JP]: ${initialMessage}`,
                    timestamp: new Date()
                }
            ]
        };

        this.tickets[ticketId] = newTicket;

        // Simulate a seller response after a short delay (for MVP demo purposes)
        setTimeout(() => {
            this.simulateSellerResponse(ticketId);
        }, 5000);

        return newTicket;
    }

    static async replyToTicket(ticketId: string, message: string, sender: 'user' | 'seller' = 'user'): Promise<SupportTicket> {
        const ticket = this.tickets[ticketId];
        if (!ticket) throw new Error('Ticket not found');

        const translatedText = sender === 'user'
            ? `[Translated to JP]: ${message}`
            : `[Translated to EN]: ${message}`;

        ticket.messages.push({
            id: `msg_${Date.now()}`,
            sender,
            originalText: message,
            translatedText,
            timestamp: new Date()
        });

        if (sender === 'user') {
            // Simulate response
            setTimeout(() => {
                this.simulateSellerResponse(ticketId);
            }, 5000);
        }

        return ticket;
    }

    private static simulateSellerResponse(ticketId: string) {
        const ticket = this.tickets[ticketId];
        if (!ticket || ticket.status === 'closed') return;

        const responses = [
            "申し訳ありませんが、在庫切れです。", // Sorry, out of stock
            "商品は本日発送されました。", // Item shipped today
            "ご不便をおかけして申し訳ありません。返金処理を行います。", // Sorry for inconvenience, processing refund
            "詳細は追ってお知らせします。" // Will let you know details later
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        this.replyToTicket(ticketId, randomResponse, 'seller').catch(console.error);
    }
}
