import { PrismaClient } from '@prisma/client';
import { CartService } from './cartService';
import { StripeClient } from '../integrations/stripeClient';

const prisma = new PrismaClient();
const stripe = StripeClient.getInstance();

export class OrderService {
    static async createPaymentIntent(userId: number, shippingAddress: any) {
        const cart = await CartService.getCart(userId);

        if (cart.items.length === 0) {
            throw new Error('Cart is empty');
        }

        // Calculate total in cents (USD)
        const totalUsd = cart.items.reduce((sum: number, item: any) => {
            return sum + (Number(item.priceAtAdd) * item.quantity);
        }, 0);

        const amountInCents = Math.round(totalUsd * 100);

        // Create Stripe PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                userId: userId.toString(),
                cartId: cart.id.toString(),
            },
        });

        // We don't create the Order in DB yet. We wait for webhook or client confirmation.
        // But for this MVP, we might want to return the clientSecret so the frontend can complete payment.

        return {
            clientSecret: paymentIntent.client_secret,
            amount: totalUsd,
            currency: 'USD'
        };
    }

    // ... existing methods (getOrders, getOrderById) ...

    // Method to handle successful payment webhook
    static async fulfillOrder(paymentIntentId: string) {
        // Logic to move Cart -> Order upon successful payment
        // For now, we'll keep the simple createOrderFromCart but maybe adapt it
        // This part is tricky without a real webhook flow locally.
        // We'll trust the frontend flow for Phase 13 MVP.
    }

    // Keeping legacy method for manual testing scenarios if needed, but primary flow is now PaymentIntent
    static async createOrderFromCart(userId: number, shippingAddress: any) {
        // ... implementation same as before ...
        return await this._createOrderTransaction(userId, shippingAddress);
    }

    private static async _createOrderTransaction(userId: number, shippingAddress: any) {
        const cart = await CartService.getCart(userId);
        if (cart.items.length === 0) throw new Error('Cart is empty');

        const totalUsd = cart.items.reduce((sum: number, item: any) => sum + (Number(item.priceAtAdd) * item.quantity), 0);

        return await prisma.$transaction(async (tx: any) => {
            const order = await tx.order.create({
                data: {
                    userId,
                    status: 'PAID', // In real app, PENDING then WEBHOOK updates to PAID
                    totalUsd,
                    shippingAddress: shippingAddress || {},
                    items: {
                        create: cart.items.map((item: any) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            pricePaidUsd: item.priceAtAdd
                        }))
                    }
                },
                include: { items: true }
            });

            await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
            return order;
        });
    }

    static async getOrders(userId: number) {
        return await prisma.order.findMany({
            where: { userId },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }

    static async getOrderById(userId: number, orderId: number) {
        return await prisma.order.findFirst({
            where: { id: orderId, userId },
            include: { items: { include: { product: true } } }
        });
    }
}
