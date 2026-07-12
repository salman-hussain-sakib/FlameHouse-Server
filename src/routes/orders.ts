import express, { Request, Response, Router } from 'express';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
}

interface OrderRecord {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  date: string;
}

const router: Router = express.Router();
const orders: OrderRecord[] = [];

router.get('/', (_req: Request, res: Response) => {
  res.json({ orders });
});

router.post('/', (req: Request, res: Response) => {
  const { userId, items, cartTotal } = req.body || {};
  if (!userId || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newOrder: OrderRecord = {
    id: `ord-${Date.now()}`,
    userId,
    items,
    total: Number((cartTotal * 1.08 + 3.99).toFixed(2)),
    status: 'Pending',
    date: new Date().toISOString().split('T')[0],
  };

  orders.push(newOrder);
  res.status(201).json({ order: newOrder });
});

export default router;
