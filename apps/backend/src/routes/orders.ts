import { Router } from 'express';
import { OrderService } from '../services/orderService';


const router = Router();

// Create Checkout Session (Start Checkout)
router.post('/checkout', async (req: any, res) => {
    try {
        const { shippingAddress } = req.body;
        const session = await OrderService.createCheckoutSession(1, shippingAddress);
        res.json(session);
    } catch (error: any) {
        console.error("Checkout Error:", error);
        res.status(400).json({ error: error.message || 'Checkout failed' });
    }
});

// Finalize Order (Called after payment success on client, or mostly for testing MVP flow)
router.post('/', async (req: any, res) => {
    try {
        const { shippingAddress } = req.body;
        // In a real Stripe flow, we'd rely on webhooks, but for MVP we might allow manual creation
        const order = await OrderService.createOrderFromCart(1, shippingAddress);
        res.status(201).json(order);
    } catch (error: any) {
        res.status(400).json({ error: error.message || 'Order creation failed' });
    }
});

// List Orders
router.get('/', async (req: any, res) => {
    try {
        const orders = await OrderService.getOrders(1);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Get Order Details
router.get('/:id', async (req: any, res) => {
    try {
        const order = await OrderService.getOrderById(1, Number(req.params.id));
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

export default router;
