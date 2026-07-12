import express, { Request, Response, Router } from 'express';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

const router: Router = express.Router();
const users: UserRecord[] = [
  { id: 'admin-id', name: 'Chef Admin', email: 'admin@flamehouse.com', password: 'admin123', role: 'admin' },
  { id: 'user-id', name: 'Alex Customer', email: 'user@flamehouse.com', password: 'password123', role: 'user' },
];

router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  const user = users.find((item) => item.email === email && item.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const { password: _password, ...safeUser } = user;
  res.json({ user: safeUser });
});

router.post('/register', (req: Request, res: Response) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  const existing = users.find((item) => item.email === email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }
  const newUser: UserRecord = { id: `user-${Date.now()}`, name, email, password, role: 'user' };
  users.push(newUser);
  const { password: _pw, ...safeUser } = newUser;
  res.status(201).json({ user: safeUser });
});

export default router;
