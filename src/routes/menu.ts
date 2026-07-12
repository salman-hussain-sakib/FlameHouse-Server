import express, { Request, Response, Router } from 'express';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

const router: Router = express.Router();
const items: MenuItem[] = [
  { id: 'burger-1', name: 'Signature Burger', price: 12.99, category: 'Burgers' },
  { id: 'burger-2', name: 'Volcano Spicy Burger', price: 13.49, category: 'Burgers' },
  { id: 'pizza-1', name: 'Firehouse Pepperoni Pizza', price: 15.99, category: 'Pizza' },
  { id: 'pizza-2', name: 'Garden Veggie Feast Pizza', price: 14.99, category: 'Pizza' },
  { id: 'chicken-1', name: 'Nashville Hot Fried Chicken', price: 11.99, category: 'Fried Chicken' },
  { id: 'side-1', name: 'Cajun Seasoned Waffle Fries', price: 4.49, category: 'Sides' },
  { id: 'drink-1', name: 'Blazing Mango Mocktail', price: 3.99, category: 'Drinks' },
];

router.get('/', (_req: Request, res: Response) => {
  res.json({ items });
});

router.get('/:id', (req: Request, res: Response) => {
  const item = items.find((entry) => entry.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json({ item });
});

export default router;
