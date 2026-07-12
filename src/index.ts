import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { MongoClient } from 'mongodb';

import overviewRoutes from './routes/overview';
import menuRoutes from './routes/menu';
import contactRoutes from './routes/contact';
import ordersRoutes from './routes/orders';
import authRoutes from './routes/auth';

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/flamehouse';

app.use(cors());
app.use(express.json());

let mongoClient: MongoClient | null = null;
let dbConnected = false;

async function connectToDatabase() {
  try {
    mongoClient = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    await mongoClient.connect();
    dbConnected = true;
    console.log('MongoDB connected successfully');
    app.locals.dbConnected = true;
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

app.use('/api/overview', overviewRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/auth', authRoutes);

app.use(express.static(path.join(__dirname, '..', '..', 'public')));

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`FlameHouse server running on http://localhost:${PORT}`);
  });
});
