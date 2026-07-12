"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const items = [
    { id: 'burger-1', name: 'Signature Burger', price: 12.99, category: 'Burgers' },
    { id: 'burger-2', name: 'Volcano Spicy Burger', price: 13.49, category: 'Burgers' },
    { id: 'pizza-1', name: 'Firehouse Pepperoni Pizza', price: 15.99, category: 'Pizza' },
    { id: 'pizza-2', name: 'Garden Veggie Feast Pizza', price: 14.99, category: 'Pizza' },
    { id: 'chicken-1', name: 'Nashville Hot Fried Chicken', price: 11.99, category: 'Fried Chicken' },
    { id: 'side-1', name: 'Cajun Seasoned Waffle Fries', price: 4.49, category: 'Sides' },
    { id: 'drink-1', name: 'Blazing Mango Mocktail', price: 3.99, category: 'Drinks' },
];
router.get('/', (_req, res) => {
    res.json({ items });
});
router.get('/:id', (req, res) => {
    const item = items.find((entry) => entry.id === req.params.id);
    if (!item)
        return res.status(404).json({ error: 'Item not found' });
    res.json({ item });
});
exports.default = router;
