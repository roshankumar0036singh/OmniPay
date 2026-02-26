export class CurrencyService {
    // Fallback static rates if no API key
    private static fallbackRates: Record<string, number> = {
        "USD": 1,
        "JPY": 150.0,
        "EUR": 0.92,
        "GBP": 0.79,
        "CNY": 7.20
    };

    /**
     * Convert currency using real-time API.
     * Requires EXCHANGE_API_KEY from OpenExchangeRates or Fixer.io
     */
    static async convert(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
        const from = fromCurrency.toUpperCase();
        const to = toCurrency.toUpperCase();

        if (from === to) return amount;

        let rates = this.fallbackRates;

        if (process.env.EXCHANGE_API_KEY) {
            try {
                // Example using OpenExchangeRates API
                const res = await fetch(`https://openexchangerates.org/api/latest.json?app_id=${process.env.EXCHANGE_API_KEY}`);
                if (res.ok) {
                    const data = await res.json();
                    rates = data.rates;
                }
            } catch (err) {
                console.error("[CurrencyService] Failed to fetch live rates, using fallback", err);
            }
        }

        const rateFrom = rates[from];
        const rateTo = rates[to];

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
