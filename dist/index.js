"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const mongodb_1 = require("mongodb");
const overview_1 = __importDefault(require("./routes/overview"));
const menu_1 = __importDefault(require("./routes/menu"));
const contact_1 = __importDefault(require("./routes/contact"));
const orders_1 = __importDefault(require("./routes/orders"));
const auth_1 = __importDefault(require("./routes/auth"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '..', '..', '.env') });
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/flamehouse';
app.use((0, cors_1.default)());
app.use(express_1.default.json());
let mongoClient = null;
let dbConnected = false;
async function connectToDatabase() {
    try {
        mongoClient = new mongodb_1.MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        await mongoClient.connect();
        dbConnected = true;
        console.log('MongoDB connected successfully');
        app.locals.dbConnected = true;
    }
    catch (error) {
        dbConnected = false;
        console.error('MongoDB connection failed:', error);
        app.locals.dbConnected = false;
    }
}
app.get('/health', (_req, res) => {
    res.json({
        ok: true,
        service: 'flamehouse-server',
        dbConnected,
        mongoUri: MONGODB_URI.replace(/\/\/([^:@]+):[^@]+@/, '//***:***@'),
    });
});
app.use('/api/overview', overview_1.default);
app.use('/api/menus', menu_1.default);
app.use('/api/contact', contact_1.default);
app.use('/api/orders', orders_1.default);
app.use('/api/auth', auth_1.default);
app.use(express_1.default.static(path_1.default.join(__dirname, '..', '..', 'public')));
connectToDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`FlameHouse server running on http://localhost:${PORT}`);
    });
});
