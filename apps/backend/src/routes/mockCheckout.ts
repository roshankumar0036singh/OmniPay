import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET endpoint to render the mock checkout HTML page
router.get('/:orderId', async (req, res) => {
    try {
        const orderId = Number(req.params.orderId);

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: { include: { product: true } } }
        });

        if (!order) {
            return res.status(404).send('<h1>Order Not Found</h1>');
        }

        if (order.status === 'PAID') {
            return res.send(`
                <html>
                <body style="background:#0A0A0A; color:#fff; font-family:sans-serif; display:flex; justify-content:center; align-items:center; height:100vh;">
                    <div style="text-align:center;">
                        <h1 style="color:#00ff00;">Order Already Paid</h1>
                        <p>You can close this window and return to OmniPay.</p>
                    </div>
                </body>
                </html>
            `);
        }

        const itemsHtml = order.items.map(item => `
            <div class="item">
                <img src="${item.product.imageUrl || ''}" alt="Product" />
                <div class="item-details">
                    <div class="item-title">${item.product.title}</div>
                    <div class="item-price">Qty: ${item.quantity}  |  $${item.pricePaidUsd}</div>
                </div>
            </div>
        `).join('');

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OmniPay Secure Checkout</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        
        body {
            margin: 0;
            padding: 0;
            background-color: #050505;
            color: #ffffff;
            font-family: 'Inter', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-image: 
                radial-gradient(circle at 50% 0%, rgba(0, 255, 128, 0.05) 0%, transparent 60%),
                linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
            background-size: 100% 100%, 30px 30px, 30px 30px;
        }

        .checkout-container {
            width: 100%;
            max-width: 480px;
            background: rgba(255, 255, 255, 0.02);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.05);
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            padding-bottom: 20px;
        }

        .header h1 {
            font-size: 24px;
            font-weight: 900;
            margin: 0 0 5px 0;
            text-transform: uppercase;
            letter-spacing: -0.05em;
            font-style: italic;
        }

        .header p {
            font-size: 10px;
            color: #00ff80;
            text-transform: uppercase;
            letter-spacing: 0.3em;
            margin: 0;
            font-weight: 700;
        }

        .order-summary {
            margin-bottom: 30px;
        }

        .item {
            display: flex;
            gap: 15px;
            margin-bottom: 15px;
            background: rgba(0, 0, 0, 0.4);
            padding: 10px;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.02);
            align-items: center;
        }

        .item img {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 8px;
        }

        .item-details {
            flex: 1;
        }

        .item-title {
            font-size: 12px;
            font-weight: 700;
            color: #ccc;
            margin-bottom: 4px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        .item-price {
            font-size: 10px;
            color: #888;
            font-family: monospace;
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .total-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            font-weight: 900;
        }

        .total-amount {
            font-size: 32px;
            font-weight: 900;
            color: #fff;
            font-style: italic;
            letter-spacing: -0.05em;
        }

        .pay-button {
            width: 100%;
            background: #00ff80;
            color: #000;
            border: none;
            padding: 20px;
            border-radius: 16px;
            font-size: 14px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 0 20px rgba(0, 255, 128, 0.2);
            margin-top: 10px;
        }

        .pay-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 30px rgba(0, 255, 128, 0.4);
            background: #00e673;
        }
        
        .pay-button:active {
            transform: scale(0.98);
        }

        .mock-info {
            text-align: center;
            margin-top: 20px;
            font-size: 10px;
            color: #555;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        /* Loading Overlay */
        #loader {
            display: none;
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.8);
            backdrop-filter: blur(5px);
            border-radius: 24px;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            color: #00ff80;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.2em;
        }
        
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(0, 255, 128, 0.1);
            border-left-color: #00ff80;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        }

        @keyframes spin { 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>

    <div class="checkout-container">
        <div id="loader">
            <div class="spinner"></div>
            <span>Processing Gateway...</span>
        </div>

        <div class="header">
            <h1>OmniPay Secure</h1>
            <p>Universal Payment Gateway</p>
        </div>

        <div class="order-summary">
            ${itemsHtml}

            <div class="total-row">
                <span class="total-label">Subtotal USD</span>
                <span class="total-amount">$${order.totalUsd}</span>
            </div>
        </div>

        <button class="pay-button" onclick="processPayment()">
            Pay with OmniCard
        </button>
        
        <button class="pay-button" style="background: #003087; color: #fff; box-shadow: 0 0 20px rgba(0, 48, 135, 0.3);" onclick="processPayment()">
            Pay with PayPal Mock
        </button>

        <div class="mock-info">
            Development Mode - No real funds will be charged
        </div>
    </div>

    <script>
        async function processPayment() {
            const loader = document.getElementById('loader');
            loader.style.display = 'flex';
            
            try {
                const response = await fetch('/api/mock-checkout/${orderId}/pay', {
                    method: 'POST'
                });
                
                if (response.ok) {
                    loader.innerHTML = '<div style="font-size: 40px; margin-bottom: 20px;">✓</div><span>Payment Successful</span><div style="font-size: 9px; color: #888; margin-top: 10px;">You can close this window</div>';
                    // Notify parent window if opened as popup or just let user close tab
                } else {
                    loader.innerHTML = '<div style="color: red; margin-bottom: 20px; font-size: 24px;">Failed</div>';
                    setTimeout(() => loader.style.display = 'none', 2000);
                }
            } catch (e) {
                alert('Connection error');
                loader.style.display = 'none';
            }
        }
    </script>
</body>
</html>
        `;

        res.send(html);

    } catch (e) {
        console.error(e);
        res.status(500).send('Server Error');
    }
});

// POST endpoint to process the mock payment
router.post('/:orderId/pay', async (req, res) => {
    try {
        const orderId = Number(req.params.orderId);

        await prisma.order.update({
            where: { id: orderId },
            data: { status: 'PAID' }
        });

        res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Failed to process payment' });
    }
});

export default router;
