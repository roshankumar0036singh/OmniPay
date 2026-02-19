export class CurrencyService {
    // Mock exchange rates (Base: USD)
    private static rates: Record<string, number> = {
        "USD": 1,
        "JPY": 150.0, // 1 USD = 150 JPY
        "EUR": 0.92,  // 1 USD = 0.92 EUR
        "GBP": 0.79,  // 1 USD = 0.79 GBP
        "CNY": 7.20   // 1 USD = 7.20 CNY
    };

    static async convert(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
        // Normalize currencies
        const from = fromCurrency.toUpperCase();
        const to = toCurrency.toUpperCase();

        if (from === to) return amount;

        // Convert to USD first
        const rateFrom = this.rates[from];
        const rateTo = this.rates[to];

        if (!rateFrom || !rateTo) {
            console.warn(`[CurrencyService] Missing rate for ${from} or ${to}`);
            return amount; // Fallback
        }

        const amountInUsd = amount / rateFrom;
        return amountInUsd * rateTo;
    }

    static format(amount: number, currency: string): string {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
    }
}
