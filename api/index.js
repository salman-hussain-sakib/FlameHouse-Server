const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient } = require('mongodb');

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

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

// Root route
app.get('/', (_req, res) => {
  res.json({
    service: 'FlameHouse Server',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      overview: '/api/overview',
      menus: '/api/menus',
      contact: '/api/contact',
      orders: '/api/orders',
      auth: '/api/auth',
    },
  });
});

// Health check
app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'flamehouse-server',
    dbConnected,
    mongoUri: MONGODB_URI.replace(/\/\/([^:@]+):[^@]+@/, '//***:***@'),
  });
});

// Overview route
app.get('/api/overview', (_req, res) => {
  res.json({
    brand: 'FlameHouse',
    tagline: 'Fire-grilled fast food for modern cravings',
    featured: ['Signature Burger', 'Firehouse Pizza', 'Hot Chicken'],
  });
});

// Menu routes
app.get('/api/menus', async (_req, res) => {
  try {
    const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    const db = client.db('flamehouse');
    const menus = await db.collection('menus').find({}).toArray();
    await client.close();
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menus' });
  }
});

app.get('/api/menus/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    const db = client.db('flamehouse');
    const menu = await db.collection('menus').findOne({ _id: new ObjectId(req.params.id) });
    await client.close();
    if (!menu) return res.status(404).json({ error: 'Menu not found' });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

// Contact route
app.post('/api/contact', async (req, res) => {
  try {
    const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    const db = client.db('flamehouse');
    const result = await db.collection('contacts').insertOne({
      ...req.body,
      createdAt: new Date(),
    });
    await client.close();
    res.status(201).json({ success: true, id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit contact' });
  }
});

// Orders routes
app.get('/api/orders', async (_req, res) => {
  try {
    const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    const db = client.db('flamehouse');
    const orders = await db.collection('orders').find({}).toArray();
    await client.close();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    const db = client.db('flamehouse');
    const result = await db.collection('orders').insertOne({
      ...req.body,
      createdAt: new Date(),
    });
    await client.close();
    res.status(201).json({ success: true, id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    const db = client.db('flamehouse');
    const order = await db.collection('orders').findOne({ _id: new ObjectId(req.params.id) });
    await client.close();
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    const db = client.db('flamehouse');
    const existing = await db.collection('users').findOne({ email: req.body.email });
    if (existing) {
      await client.close();
      return res.status(400).json({ error: 'User already exists' });
    }
    const result = await db.collection('users').insertOne({
      ...req.body,
      createdAt: new Date(),
    });
    await client.close();
    res.status(201).json({ success: true, id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    const db = client.db('flamehouse');
    const user = await db.collection('users').findOne({ email: req.body.email });
    await client.close();
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

app.get('/api/auth/users', async (_req, res) => {
  try {
    const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    const db = client.db('flamehouse');
    const users = await db.collection('users').find({}).toArray();
    await client.close();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Connect to database on startup
connectToDatabase();

// Export app for Vercel serverless
module.exports = app;