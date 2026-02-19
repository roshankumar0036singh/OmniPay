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

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'omnipay-backend' });
});

app.listen(PORT, () => {
    console.log(`Using Node.js ${process.version}`);
    console.log(`Backend server running on http://localhost:${PORT}`);
});
