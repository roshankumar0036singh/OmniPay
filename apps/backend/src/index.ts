import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initTelemetry } from './utils/telemetry';

dotenv.config();
initTelemetry();

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(cors());
app.use(morgan('dev'));
import translateRoutes from './routes/translate';
import authRoutes from './routes/auth';

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/translate', translateRoutes);
import searchRoutes from './routes/search';
app.use('/api/search', searchRoutes);
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';
import priceRoutes from './routes/price';
import ethicalRoutes from './routes/ethical';
import sentimentRoutes from './routes/sentiment';
import supportRoutes from './routes/support';
import mockCheckoutRoutes from './routes/mockCheckout';

app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/price', priceRoutes);
app.use('/api/ethical', ethicalRoutes);
app.use('/api/sentiment', sentimentRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/mock-checkout', mockCheckoutRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'omnipay-backend' });
});

app.listen(PORT, () => {
    console.log(`Using Node.js ${process.version}`);
    console.log(`Backend server running on http://localhost:${PORT}`);
});
