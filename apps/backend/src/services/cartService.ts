import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CartService {
    static async getCart(userId: number) {
        let cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    },
                    orderBy: { addedAt: 'desc' }
                }
            }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId },
                include: { items: { include: { product: true } } }
            });
        }

        return cart;
    }

    static async addToCart(userId: number, productId: number, quantity: number = 1) {
        const cart = await this.getCart(userId);

        // Check if item exists
        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId
            }
        });

        if (existingItem) {
            return await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity }
            });
        }

        // Get product price for snapshot
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) throw new Error('Product not found');

        return await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                quantity,
                priceAtAdd: product.price
            }
        });
    }

    static async updateQuantity(userId: number, itemId: number, quantity: number) {
        const cart = await this.getCart(userId);

        // Verify item belongs to user's cart
        const item = await prisma.cartItem.findFirst({
            where: { id: itemId, cartId: cart.id }
        });

        if (!item) throw new Error('Item not found in cart');

        if (quantity <= 0) {
            return await prisma.cartItem.delete({ where: { id: itemId } });
        }

        return await prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity }
        });
    }

    static async removeItem(userId: number, itemId: number) {
        const cart = await this.getCart(userId);

        const item = await prisma.cartItem.findFirst({
            where: { id: itemId, cartId: cart.id }
        });

        if (!item) throw new Error('Item not found');

        return await prisma.cartItem.delete({ where: { id: itemId } });
    }

    static async clearCart(userId: number) {
        const cart = await this.getCart(userId);
        return await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
}
