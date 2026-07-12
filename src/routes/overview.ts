import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({
    brand: 'FlameHouse',
    tagline: 'Fire-grilled fast food for modern cravings',
    featured: ['Signature Burger', 'Firehouse Pizza', 'Hot Chicken'],
  });
});

export default router;
