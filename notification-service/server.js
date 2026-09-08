require('dotenv').config({ path: '../.env' });
const { initNats } = require('./config/nats');
const { startUserEventConsumer } = require('./consumers/userEventConsumer');

async function bootstrap() {
    await initNats();
    await startUserEventConsumer();
    console.log('[NOTIFICATION SERVICE] Listening for incoming events...');
}

bootstrap();