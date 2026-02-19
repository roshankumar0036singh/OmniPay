export class ShippingEstimator {
    // Base shipping rates in USD
    private static baseRates: Record<string, number> = {
        "JP": 20, // Japan -> US
        "DE": 15, // Germany -> US
        "ES": 18, // Spain -> US
        "FR": 18, // France -> US
        "CN": 25, // China -> US
        "US": 5   // Domestic
    };

    // Duty rates (%)
    private static dutyRates: Record<string, number> = {
        "electronics": 0.0, // Often duty free under $800
        "clothing": 0.10,   // 10% duty
        "general": 0.05
    };

    static async estimateLandedCost(
        priceUsd: number,
        originCountry: string,
        category: string = "general",
        destCountry: string = "US"
    ) {
        // 1. Shipping
        const shippingCost = this.baseRates[originCountry] || 25;

        // 2. Duties (De Minimis threshold check could go here)
        const dutyRate = this.dutyRates[category] || 0.05;
        const dutyCost = priceUsd > 800 ? priceUsd * dutyRate : 0; // US De Minimis is $800

        // 3. Total
        const total = priceUsd + shippingCost + dutyCost;

        return {
            priceUsd,
            shippingCost,
            dutyCost,
            total,
            breakdown: {
                shipping: shippingCost,
                duty: dutyCost
            }
        };
    }
}
