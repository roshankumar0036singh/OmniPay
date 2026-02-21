import { Router } from 'express';
import { CartService } from '../services/cartService';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Get Cart
router.get('/', authMiddleware, async (req: any, res) => {
    try {
        const cart = await CartService.getCart(req.user.userId);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
});

// Add Item
router.post('/items', authMiddleware, async (req: any, res) => {
    try {
        const { productId, quantity } = req.body;
        const item = await CartService.addToCart(req.user.userId, productId, quantity);
        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add item' });
    }
});

// Update Item
router.patch('/items/:id', authMiddleware, async (req: any, res) => {
    try {
        const { quantity } = req.body;
        const item = await CartService.updateQuantity(req.user.userId, Number(req.params.id), quantity);
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update item' });
    }
});

// Remove Item
router.delete('/items/:id', authMiddleware, async (req: any, res) => {
    try {
        await CartService.removeItem(req.user.userId, Number(req.params.id));
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove item' });
    }
});

// Clear Cart
router.delete('/', authMiddleware, async (req: any, res) => {
    try {
        await CartService.clearCart(req.user.userId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to clear cart' });
    }
});

export default router;
