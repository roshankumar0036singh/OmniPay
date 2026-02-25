import { Router } from 'express';
import express from 'express';
import { StripeClient } from '../integrations/stripeClient';
import { OrderService } from '../services/orderService';

const router = Router();
const stripe = StripeClient.getInstance();

router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        return res.status(400).send('Webhook secret missing');
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object as any;
            console.log(`[Webhook] PaymentIntent for ${paymentIntent.amount} was successful!`);

            try {
                // In production, user metadata holds cart info
                await OrderService.fulfillOrder(paymentIntent.id, paymentIntent.metadata);
            } catch (err) {
                console.error("Failed to fulfill order", err);
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

export default router;
