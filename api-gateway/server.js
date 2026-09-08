require('dotenv').config({ path: '../.env' });
const express = require('express');
const path = require('path');
const { connectNats } = require('./config/nats');

const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);

const PORT = process.env.PORT_GATEWAY || 8000;

async function bootstrap() {
  await connectNats();
  app.listen(PORT, () => {
    console.log(`[API GATEWAY] Listening on http://localhost:${PORT}`);
  });
}

bootstrap();
