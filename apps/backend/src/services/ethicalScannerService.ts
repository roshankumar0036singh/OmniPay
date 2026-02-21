import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface EthicalReport {
    productId: string;
    score: number; // 0-100
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    materials: string[];
    origin: string;
    certifications: string[];
    flags: string[]; // e.g. "High Carbon Footprint", "Unverified Labor"
    summary: string;
}

export class EthicalScannerService {
    /**
     * Generate an ethical score for a product.
     * In a real app, this would call Good On You, Open Apparel Registry, or an LLM.
     * For this MVP, we simulate a scan based on product keywords.
     */
    static async scanProduct(productId: string, title: string, description: string = ''): Promise<EthicalReport> {
        // Simple mock logic for MVP
        const text = `${title} ${description}`.toLowerCase();

        let score = 50; // Base score
        const materials = [];
        const flags = [];
        const certifications = [];

        // Simple keyword heuristics
        if (text.includes('organic cotton') || text.includes('recycled')) {
            score += 30;
            materials.push(text.includes('organic cotton') ? 'Organic Cotton' : 'Recycled Materials');
            certifications.push('Eco-Friendly Material');
        } else if (text.includes('polyester') || text.includes('plastic')) {
            score -= 20;
            materials.push('Synthetic/Polyester');
            flags.push('Microplastic pollution risk');
        }

        if (text.includes('fair trade')) {
            score += 20;
            certifications.push('Fair Trade Certified');
        }

        if (text.includes('fast fashion')) {
            score -= 30;
            flags.push('High waste industry');
        }

        // Clamp score 0-100
        score = Math.max(0, Math.min(100, score));

        // Assign Grade
        let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'C';
        if (score >= 90) grade = 'A';
        else if (score >= 70) grade = 'B';
        else if (score >= 50) grade = 'C';
        else if (score >= 30) grade = 'D';
        else grade = 'F';

        return {
            productId,
            score,
            grade,
            materials: materials.length > 0 ? materials : ['Unknown'],
            origin: 'Various / Unverified', // Mock
            certifications,
            flags,
            summary: `This product scored ${score}/100. ${flags.length > 0 ? 'Proceed with caution due to environmental flags.' : 'Good ethical standing.'}`
        };
    }
}
