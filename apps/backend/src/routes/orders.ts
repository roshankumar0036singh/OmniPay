import { Router } from 'express';
import { OrderService } from '../services/orderService';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Checkout (Create Order)
router.post('/', authMiddleware, async (req: any, res) => {
    try {
        const { shippingAddress } = req.body;
        const order = await OrderService.createOrderFromCart(req.user.userId, shippingAddress);
        res.status(201).json(order);
    } catch (error: any) {
        res.status(400).json({ error: error.message || 'Checkout failed' });
    }
});

// List Orders
router.get('/', authMiddleware, async (req: any, res) => {
    try {
        const orders = await OrderService.getOrders(req.user.userId);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Get Order Details
router.get('/:id', authMiddleware, async (req: any, res) => {
    try {
        const order = await OrderService.getOrderById(req.user.userId, Number(req.params.id));
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

export default router;
