import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { MongoClient } from 'mongodb';

import overviewRoutes from '../src/routes/overview';
import menuRoutes from '../src/routes/menu';
import contactRoutes from '../src/routes/contact';
import ordersRoutes from '../src/routes/orders';
import authRoutes from '../src/routes/auth';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/flamehouse';

app.use(cors());
app.use(express.json());

let dbConnected = false;

async function connectToDatabase() {
  try {
    const mongoClient = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    await mongoClient.connect();
    dbConnected = true;
    app.locals.dbConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    dbConnected = false;
    console.error('MongoDB connection failed:', error);
    app.locals.dbConnected = false;
  }
}

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    ok: true,
    service: 'flamehouse-server',
    dbConnected,
    mongoUri: MONGODB_URI.replace(/\/\/([^:@]+):[^@]+@/, '//***:***@'),
  });
});

app.get('/', (_req: Request, res: Response) => {
  res.json({
    ok: true,
    service: 'flamehouse-server',
    message: 'Server is running',
    health: '/health',
  });
});

app.get('/api/index', (_req: Request, res: Response) => {
  res.json({
    ok: true,
    service: 'flamehouse-server',
    message: 'Server is running',
    health: '/health',
  });
});

app.use('/api/overview', overviewRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/auth', authRoutes);

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use((req: Request, res: Response) => {
  res.status(404).json({
    ok: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Connect to database on startup
connectToDatabase();

// Export app for Vercel serverless
export default app;