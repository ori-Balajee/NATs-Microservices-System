require('dotenv').config({ path: '../.env' });
const connectDB = require('./config/db');
const { initNats } = require('./config/nats');
const { setupRpcHandlers } = require('./controllers/userRpcController');

async function bootstrap() {
    await connectDB();
    await initNats();
    setupRpcHandlers();
    console.log('[USER SERVICE] Running and ready for work');
}

bootstrap();