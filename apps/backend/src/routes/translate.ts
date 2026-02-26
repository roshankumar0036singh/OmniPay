import { Router } from 'express';
import { LingoService } from '../integrations/lingoService';


const router = Router();
const lingoService = LingoService.getInstance();

// Single translation endpoint
router.post('/translate', async (req, res) => {
    try {
        const { text, targetLang, sourceLang, context } = req.body;

        if (!text || !targetLang) {
            return res.status(400).json({ error: 'Missing text or targetLang' });
        }

        const userApiKey = req.headers['x-lingo-key'] as string | undefined;
        const result = await lingoService.translate({ text, targetLang, sourceLang, context }, userApiKey);
        res.json(result);
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({ error: 'Translation failed' });
    }
});

// Batch translation endpoint
router.post('/translate/batch', async (req, res) => {
    try {
        const { texts, targetLang, sourceLang, context } = req.body;

        if (!texts || !Array.isArray(texts) || !targetLang) {
            return res.status(400).json({ error: 'Invalid batch request' });
        }

        const userApiKey = req.headers['x-lingo-key'] as string | undefined;
        const result = await lingoService.translateBatch({ texts, targetLang, sourceLang, context }, userApiKey);
        res.json(result);
    } catch (error) {
        console.error('Batch translation error:', error);
        res.status(500).json({ error: 'Batch translation failed' });
    }
});

// Language detection endpoint
router.post('/detect', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: 'Missing text' });

        const lang = await lingoService.detectLanguage(text);
        res.json({ language: lang });
    } catch (error) {
        console.error('Detection error:', error);
        res.status(500).json({ error: 'Detection failed' });
    }
});

export default router;
