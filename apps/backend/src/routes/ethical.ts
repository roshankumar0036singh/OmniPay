import { Router } from 'express';
import { EthicalScannerService } from '../services/ethicalScannerService';

const router = Router();

router.post('/scan', async (req: any, res) => {
    try {
        const { productId, title, description } = req.body;

        if (!productId || !title) {
            return res.status(400).json({ error: 'productId and title are required' });
        }

        const report = await EthicalScannerService.scanProduct(productId, title, description);
        res.json(report);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to scan product' });
    }
});

export default router;
