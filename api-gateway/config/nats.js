const { connect, StringCodec } = require('nats');

let nc = null;
const sc = StringCodec();

async function connectNats() {
    try {
        const natsUrl = process.env.NATS_URL || 'nats://localhost:4222';
        nc = await connect({ servers: natsUrl });
        console.log(`[API GATEWAY] Connected to NATS broker at ${natsUrl}`);
        return nc;
    } catch (e) {
        console.error('[API GATEWAY] Failed to connect to NATS:', err);
        process.exit(1);
    }
}

function getNatsClient() {
    if (!nc) throw new Error('NATS client not initialized');
    return nc;
}

module.exports = { connectNats, getNatsClient, sc };