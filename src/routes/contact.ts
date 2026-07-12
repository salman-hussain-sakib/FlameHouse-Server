import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

router.post('/', (req: Request, res: Response) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  res.status(201).json({ ok: true, received: { name, email, message } });
});

export default router;
