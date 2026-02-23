import { Router } from 'express';
import { SupportProxyService } from '../services/supportProxyService';

const router = Router();

// Get all tickets for user
router.get('/', async (req: any, res) => {
    try {
        const userId = 'mock-user-id'; // Assume auth middleware sets this
        const tickets = await SupportProxyService.getTickets(userId);
        res.json(tickets);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get specific ticket
router.get('/:id', async (req: any, res) => {
    try {
        const ticket = await SupportProxyService.getTicket(req.params.id);
        if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
        res.json(ticket);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Create new ticket
router.post('/', async (req: any, res) => {
    try {
        const userId = 'mock-user-id';
        const { orderId, subject, message } = req.body;

        if (!orderId || !subject || !message) {
            return res.status(400).json({ error: 'orderId, subject, and message are required' });
        }

        const newTicket = await SupportProxyService.createTicket(userId, orderId, subject, message);
        res.status(201).json(newTicket);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Reply to ticket
router.post('/:id/reply', async (req: any, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: 'message is required' });

        const updatedTicket = await SupportProxyService.replyToTicket(req.params.id, message, 'user');
        res.json(updatedTicket);
    } catch (error: any) {
        if (error.message === 'Ticket not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

export default router;
