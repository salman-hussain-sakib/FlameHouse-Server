"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const users = [
    { id: 'admin-id', name: 'Chef Admin', email: 'admin@flamehouse.com', password: 'admin123', role: 'admin' },
    { id: 'user-id', name: 'Alex Customer', email: 'user@flamehouse.com', password: 'password123', role: 'user' },
];
router.post('/login', (req, res) => {
    const { email, password } = req.body || {};
    const user = users.find((item) => item.email === email && item.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }
    const { password: _password, ...safeUser } = user;
    res.json({ user: safeUser });
});
router.post('/register', (req, res) => {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    const existing = users.find((item) => item.email === email);
    if (existing) {
        return res.status(409).json({ error: 'An account with this email already exists' });
    }
    const newUser = { id: `user-${Date.now()}`, name, email, password, role: 'user' };
    users.push(newUser);
    const { password: _pw, ...safeUser } = newUser;
    res.status(201).json({ user: safeUser });
});
exports.default = router;
