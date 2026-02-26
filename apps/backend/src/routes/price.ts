import { Router } from 'express';
import { PriceArbitrageService } from '../services/priceArbitrageService';


const router = Router();

// Compare prices across regions
router.post('/compare', async (req: any, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'Query is required for price comparison' });
        }
        const comparison = await PriceArbitrageService.comparePrices(query);
        res.json(comparison || { message: 'No comparisons found' });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to compare prices' });
    }
});

// Price Alerts
router.post('/alerts', async (req: any, res) => {
    try {
        const { productId, targetPriceUsd } = req.body;
        const alert = await PriceArbitrageService.createAlert(1, productId, targetPriceUsd);
        res.status(201).json(alert);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to create alert' });
    }
});

router.get('/alerts', async (req: any, res) => {
    try {
        const alerts = await PriceArbitrageService.getAlerts(1);
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch alerts' });
    }
});

router.delete('/alerts/:id', async (req: any, res) => {
    try {
        await PriceArbitrageService.deleteAlert(1, Number(req.params.id));
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete alert' });
    }
});

// Price History
router.get('/history/:productId', async (req, res) => {
    try {
        const history = await PriceArbitrageService.getPriceHistory(Number(req.params.productId));
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch price history' });
    }
});

export default router;
