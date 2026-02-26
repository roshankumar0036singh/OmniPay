import { Router } from 'express';
import { SentimentService } from '../services/sentimentService';

const router = Router();

router.post('/analyze', async (req: any, res) => {
    try {
        const { productId, title } = req.body;

        if (!productId || !title) {
            return res.status(400).json({ error: 'productId and title are required' });
        }

        const userApiKey = req.headers['x-mistral-key'] as string | undefined;
        const summary = await SentimentService.analyzeReviews(productId, title, userApiKey);
        res.json(summary);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to analyze sentiment' });
    }
});

export default router;
