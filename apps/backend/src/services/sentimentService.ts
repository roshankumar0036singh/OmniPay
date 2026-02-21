import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ReviewSummaryData {
    productId: string;
    consensus: string;
    pros: string[];
    cons: string[];
    avgRating: number;
    reviewCount: number;
}

export class SentimentService {
    /**
     * Analyze and summarize product reviews.
     * MVP: Mock sentiment analysis based on product ID/title.
     */
    static async analyzeReviews(productId: string, title: string): Promise<ReviewSummaryData> {
        // Mock data logic for MVP
        const isHighlyRated = productId.length % 2 === 0;

        const avgRating = isHighlyRated ? (4.2 + Math.random() * 0.7) : (3.5 + Math.random() * 0.9);
        const reviewCount = Math.floor(Math.random() * 500) + 50;

        const pros = isHighlyRated
            ? ['Great build quality', 'Fast shipping', 'Exactly as described', 'Excellent value for money']
            : ['Decent price', 'Fast shipping'];

        const cons = isHighlyRated
            ? ['Packaging could be better']
            : ['Feels a bit cheap', 'Sizing runs small', 'Average battery life'];

        const consensus = isHighlyRated
            ? 'Generally positive reception. Most users praise the quality and value.'
            : 'Mixed reviews. While the price is good, some users report quality and sizing issues.';

        // Randomly pick a subset of pros/cons for variety
        const randomSubset = (arr: string[], max: number) => {
            const shuffled = [...arr].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, Math.floor(Math.random() * max) + 1);
        };

        return {
            productId,
            consensus,
            pros: randomSubset(pros, 3),
            cons: randomSubset(cons, 3),
            avgRating: parseFloat(avgRating.toFixed(1)),
            reviewCount
        };
    }
}
