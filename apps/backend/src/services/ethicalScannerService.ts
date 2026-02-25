import { Mistral } from '@mistralai/mistralai';
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
     * Generate an ethical score for a product using Mistral AI.
     * Falls back to keyword heuristics if API key is not present.
     */
    static async scanProduct(productId: string, title: string, description: string = '', userApiKey?: string): Promise<EthicalReport> {
        const apiKey = userApiKey || process.env.MISTRAL_API_KEY;

        if (!apiKey) {
            console.warn("Mistral API key not provided. Falling back to mock ethical heuristics.");
            return this.mockScan(productId, title, description);
        }

        try {
            const client = new Mistral({ apiKey });
            const prompt = `You are a strict sustainable fashion and consumer goods analyst. 
Analyze the following product for ethical, environmental, and sustainability indicators.
Product Title: "${title}"
Description: "${description}"

Provide a detailed ethical assessment. If the description is vague, assume a standard score and flag lack of transparency.
Return exactly AND ONLY a JSON object with this shape:
{
  "score": 65,
  "grade": "C",
  "materials": ["Cotton", "Polyester (Assumed)"],
  "origin": "Unverified",
  "certifications": ["None detected"],
  "flags": ["Lack of material transparency", "Potential fast fashion"],
  "summary": "Short 1-2 sentence summary of the ethical standing."
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
                score: typeof parsed.score === 'number' ? parsed.score : 50,
                grade: parsed.grade || 'C',
                materials: Array.isArray(parsed.materials) ? parsed.materials : ['Unknown'],
                origin: parsed.origin || 'Unverified',
                certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
                flags: Array.isArray(parsed.flags) ? parsed.flags : [],
                summary: parsed.summary || 'Ethical assessment unavailable.'
            };
        } catch (error) {
            console.error("Mistral ethical scan failed:", error);
            return this.mockScan(productId, title, description);
        }
    }

    private static mockScan(productId: string, title: string, description: string): EthicalReport {
        const text = `${title} ${description}`.toLowerCase();

        let score = 50;
        const materials = [];
        const flags = [];
        const certifications = [];

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

        score = Math.max(0, Math.min(100, score));

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
            origin: 'Various / Unverified',
            certifications,
            flags,
            summary: `This product scored ${score}/100. ${flags.length > 0 ? 'Proceed with caution due to environmental flags.' : 'Good ethical standing.'}`
        };
    }
}
