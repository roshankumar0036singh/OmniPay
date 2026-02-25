import { PrismaClient } from '@prisma/client';
import { CartService } from './cartService';

const prisma = new PrismaClient();

export class OrderService {
    static async createCheckoutSession(userId: number, shippingAddress: any) {
        const cart = await CartService.getCart(userId);

        if (cart.items.length === 0) {
            throw new Error('Cart is empty');
        }

        const totalUsd = cart.items.reduce((sum: number, item: any) => sum + (Number(item.priceAtAdd) * item.quantity), 0);

        // Create a PENDING order directly
        const order = await prisma.$transaction(async (tx: any) => {
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    status: 'PENDING',
                    totalUsd,
                    shippingAddress: shippingAddress || {},
                    items: {
                        create: cart.items.map((item: any) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            pricePaidUsd: item.priceAtAdd
                        }))
                    }
                }
            });

            // Clear the user's cart
            await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

            return newOrder;
        });

        return {
            url: `http://localhost:3000/api/mock-checkout/${order.id}`,
            sessionId: `mock_session_${order.id}`
        };
    }

    // ... existing methods (getOrders, getOrderById) ...

    // Method to handle successful payment webhook
    static async fulfillOrder(paymentIntentId: string, metadata: any) {
        if (!metadata || !metadata.userId || !metadata.cartId) {
            console.error("[OrderService] Missing metadata in payment intent");
            return;
        }

        const userId = parseInt(metadata.userId);
        // Execute the same logic we used for manual cart checkout
        await this._createOrderTransaction(userId, {});
        console.log(`[OrderService] Successfully fulfilled order for pi: ${paymentIntentId}`);
    }

    // Keeping legacy method for manual testing scenarios if needed, but primary flow is now PaymentIntent
    static async createOrderFromCart(userId: number, shippingAddress: any) {
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
