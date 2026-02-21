import { PrismaClient } from '@prisma/client';
import { SearchService } from './searchService';
import { RegionPrice, PriceComparison } from '@omnipay/shared/src/types/product';

const prisma = new PrismaClient();

export class PriceArbitrageService {
    /**
     * Compare prices for a given product search query across all supported regions
     */
    static async comparePrices(query: string): Promise<PriceComparison | null> {
        const regions = ['US', 'JP', 'DE', 'ES'];
        const currency = 'USD'; // Target reference currency

        // Use Global Search to do the heavy lifting: translate, scrape, normalize
        const searchResults = await SearchService.globalSearch({
            query,
            regions,
            currency
        });

        if (!searchResults || searchResults.length === 0) {
            return null;
        }

        // Search returns a sorted array by totalPriceUsd (Landed Cost)
        // Extract the best match per region (assuming first result per region is best match)
        const regionBestDeals: Map<string, any> = new Map();

        for (const item of searchResults) {
            if (!regionBestDeals.has(item.region)) {
                regionBestDeals.set(item.region, item);
            }
        }

        const prices: RegionPrice[] = Array.from(regionBestDeals.values()).map(item => ({
            region: item.region,
            price: item.price,
            currency: item.currency,
            priceUsd: item.totalPriceUsd, // Use landed cost for true comparison
            url: item.url,
            site: item.site
        }));

        if (prices.length < 1) return null;

        if (prices.length === 1) {
            return {
                productId: query,
                bestDeal: prices[0],
                prices,
                savingsPercent: 0
            }
        }

        // Sort by USD price ascending
        prices.sort((a, b) => a.priceUsd - b.priceUsd);

        const bestDeal = prices[0];
        const highestPrice = prices[prices.length - 1];

        const savingsUsd = highestPrice.priceUsd - bestDeal.priceUsd;
        // Calculate max potential savings percentage relative to the highest found price
        const savingsPercent = Math.round((savingsUsd / highestPrice.priceUsd) * 100);

        return {
            productId: query, // In a real app this would be a normalized ASIN/SKU
            bestDeal,
            prices,
            savingsPercent
        };
    }

    // --- Alerts Management ---
    static async createAlert(userId: number, productId: number, targetPriceUsd: number) {
        return await prisma.priceAlert.create({
            data: {
                userId,
                productId,
                targetPriceUsd
            }
        });
    }

    static async getAlerts(userId: number) {
        return await prisma.priceAlert.findMany({
            where: { userId, isActive: true },
            include: { product: true }
        });
    }

    static async deleteAlert(userId: number, alertId: number) {
        return await prisma.priceAlert.deleteMany({
            where: { id: alertId, userId }
        });
    }

    // --- Price History ---
    static async getPriceHistory(productId: number) {
        return await prisma.priceHistory.findMany({
            where: { productId },
            orderBy: { capturedAt: 'asc' }
        });
    }
}
