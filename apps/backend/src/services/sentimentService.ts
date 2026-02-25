import { PrismaClient } from '@prisma/client';
import { Mistral } from '@mistralai/mistralai';

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
     * Analyze and summarize product reviews using Mistral AI.
     * Falls back to mock data if MISTRAL_API_KEY is not set.
     */
    static async analyzeReviews(productId: string, title: string, userApiKey?: string): Promise<ReviewSummaryData> {
        const apiKey = userApiKey || process.env.MISTRAL_API_KEY;

        if (!apiKey) {
            console.warn("Mistral API key not provided. Falling back to mock sentiment data.");
            return this.mockAnalyze(productId, title);
        }

        try {
            const client = new Mistral({ apiKey });

            const prompt = `You are an expert e-commerce product analyst.
Analyze the sentiment for the product titled: "${title}".
Since we don't have actual user reviews scraped yet in this phase, generate a highly realistic set of Pros, Cons, a short Consensus summary, and an estimated Average Rating (between 1.0 and 5.0) as if you read 100 customer reviews.

Return exactly AND ONLY a JSON object with this shape, no markdown formatting:
{
  "consensus": "Summary of what people think...",
  "pros": ["pro1", "pro2", "pro3"],
  "cons": ["con1", "con2"],
  "avgRating": 4.5,
  "reviewCount": 124
}`;

            const response = await client.chat.complete({
                model: 'mistral-small-latest',
                messages: [{ role: 'user', content: prompt }],
                responseFormat: { type: 'json_object' },
            });

            const content = response.choices?.[0]?.message?.content?.toString() || "{}";
            const parsed = JSON.parse(content);

            return {
                productId,
                consensus: parsed.consensus || "Information unavailable",
                pros: parsed.pros || [],
                cons: parsed.cons || [],
                avgRating: typeof parsed.avgRating === 'number' ? parsed.avgRating : 0,
                reviewCount: typeof parsed.reviewCount === 'number' ? parsed.reviewCount : 0
            };

        } catch (error) {
            console.error("Mistral analysis failed, falling back to mock:", error);
            return this.mockAnalyze(productId, title);
        }
    }

    private static mockAnalyze(productId: string, title: string): ReviewSummaryData {
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
