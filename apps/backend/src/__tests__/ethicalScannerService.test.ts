import { describe, it, expect } from 'vitest';
import { EthicalScannerService } from '../services/ethicalScannerService';

describe('EthicalScannerService', () => {
    it('should return a high score (A/B) and eco flags for sustainable materials', async () => {
        const result = await EthicalScannerService.scanProduct('prod1', 'Organic Cotton T-Shirt', 'Made from 100% organic cotton and fair trade.');

        expect(result.score).toBeGreaterThan(70);
        expect(['A', 'B']).toContain(result.grade);
        expect(result.materials).toContain('Organic Cotton');
        expect(result.certifications).toContain('Eco-Friendly Material');
        expect(result.certifications).toContain('Fair Trade Certified');
    });

    it('should return a lower score and risk flags for synthetic materials', async () => {
        const result = await EthicalScannerService.scanProduct('prod2', 'Fast Fashion Polyester Jacket', 'Cheap plastic materials.');

        expect(result.score).toBeLessThan(70);
        expect(result.materials).toContain('Synthetic/Polyester');
        expect(result.flags).toContain('Microplastic pollution risk');
        expect(result.flags).toContain('High waste industry');
    });

    it('should clamp scores between 0 and 100', async () => {
        // Highly positive text that would exceed 100 without clamping
        const result = await EthicalScannerService.scanProduct('prod3', 'Organic organic organic fair trade fair trade recycled recycled');
        expect(result.score).toBe(100);
        expect(result.grade).toBe('A');
    });
});
