import { Router } from 'express';
import { CartService } from '../services/cartService';


const router = Router();

// Get Cart
router.get('/', async (req: any, res) => {
    try {
        const cart = await CartService.getCart(1);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
});

// Add Item
router.post('/items', async (req: any, res) => {
    try {
        const { productId, quantity } = req.body;
        const item = await CartService.addToCart(1, productId, quantity);
        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add item' });
    }
});

// Update Item
router.patch('/items/:id', async (req: any, res) => {
    try {
        const { quantity } = req.body;
        const item = await CartService.updateQuantity(1, Number(req.params.id), quantity);
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update item' });
    }
});

// Remove Item
router.delete('/items/:id', async (req: any, res) => {
    try {
        await CartService.removeItem(1, Number(req.params.id));
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove item' });
    }
});

// Clear Cart
router.delete('/', async (req: any, res) => {
    try {
        await CartService.clearCart(1);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to clear cart' });
    }
});

export default router;
