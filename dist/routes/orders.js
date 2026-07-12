"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const orders = [];
router.get('/', (_req, res) => {
    res.json({ orders });
});
router.post('/', (req, res) => {
    const { userId, items, cartTotal } = req.body || {};
    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const newOrder = {
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
exports.default = router;
