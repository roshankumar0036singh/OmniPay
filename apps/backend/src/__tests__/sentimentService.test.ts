import { describe, it, expect } from 'vitest';
import { SentimentService } from '../services/sentimentService';

describe('SentimentService', () => {
    it('should return a positive summary for an even-length product ID', async () => {
        const result = await SentimentService.analyzeReviews('evenid12', 'Test Product');

        expect(result.productId).toBe('evenid12');
        expect(result.avgRating).toBeGreaterThanOrEqual(4.2);
        expect(result.consensus).toContain('positive reception');
        expect(result.pros.length).toBeGreaterThan(0);
        expect(result.cons.length).toBeGreaterThan(0);
    });

    it('should return a mixed summary for an odd-length product ID', async () => {
        const result = await SentimentService.analyzeReviews('oddid1234', 'Test Product Odd');

        expect(result.productId).toBe('oddid1234');
        expect(result.avgRating).toBeLessThanOrEqual(4.5); // max possible is ~4.4 + rounding up to 4.5
        expect(result.consensus).toContain('Mixed reviews');
        expect(result.pros.length).toBeGreaterThan(0);
        expect(result.cons.length).toBeGreaterThan(0);
    });
});
