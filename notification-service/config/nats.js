const { connect, StringCodec } = require('nats');

let nc = null;
let js = null;
const sc = StringCodec();

async function initNats() {
    try {
        const natsUrl = process.env.NATS_URL || 'nats://localhost:4222';
        nc = await connect({ servers: natsUrl });
        js = nc.jetstream();

        console.log(`[NOTIFICATION SERVICE] Connected to NATS broker at ${natsUrl}`);
        return { nc, js };
    } catch (err) {
        console.error('[NOTIFICATION SERVICE] NATS Connection Error:', err);
        process.exit(1);
    }
}

function getNats() {
    if (!nc || !js) throw new Error('NATS not initialized');
    return { nc, js, sc };
}

module.exports = { initNats, getNats };