import { PrismaClient } from '@prisma/client';
import { CartService } from './cartService';

const prisma = new PrismaClient();

export class OrderService {
    static async createOrderFromCart(userId: number, shippingAddress: any) {
        const cart = await CartService.getCart(userId);

        if (cart.items.length === 0) {
            throw new Error('Cart is empty');
        }

        // Calculate total (simple sum for now, ignores currency conversion for MVP)
        // In a real app, we'd normalize to USD here
        const totalUsd = cart.items.reduce((sum, item) => {
            return sum + (Number(item.priceAtAdd) * item.quantity);
        }, 0);

        // Transaction to create order and clear cart
        return await prisma.$transaction(async (tx) => {
            // 1. Create Order
            const order = await tx.order.create({
                data: {
                    userId,
                    status: 'PENDING',
                    totalUsd,
                    shippingAddress: shippingAddress || {},
                    items: {
                        create: cart.items.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            pricePaidUsd: item.priceAtAdd // Assuming USD for simplicity in MVP
                        }))
                    }
                },
                include: { items: true }
            });

            // 2. Clear Cart
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id }
            });

            return order;
        });
    }

    static async getOrders(userId: number) {
        return await prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: { product: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    static async getOrderById(userId: number, orderId: number) {
        return await prisma.order.findFirst({
            where: { id: orderId, userId },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });
    }
}
