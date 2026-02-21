import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("STRIPE_SECRET_KEY is missing. Payment features will not work.");
}

export class StripeClient {
    private static instance: Stripe;

    static getInstance(): Stripe {
        if (!this.instance) {
            this.instance = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
                apiVersion: '2026-01-28.clover', // Match TS definition
            });
        }
        return this.instance;
    }
}
