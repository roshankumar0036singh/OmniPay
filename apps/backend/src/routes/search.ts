import { Router } from 'express';
import { SearchService } from '../services/searchService';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { query, regions } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        const results = await SearchService.globalSearch({
            query,
            regions: regions || ["JP", "US", "DE"], // Default regions
            currency: "USD"
        });

        res.json({ results });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Global search failed' });
    }
});

export default router;
