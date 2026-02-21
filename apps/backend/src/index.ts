import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/price', priceRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'omnipay-backend' });
});

app.listen(PORT, () => {
    console.log(`Using Node.js ${process.version}`);
    console.log(`Backend server running on http://localhost:${PORT}`);
});
