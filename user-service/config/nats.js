const { connect, StringCodec } = require('nats');

let nc = null;
let js = null;
const sc = StringCodec();

function getNats() {
    if (!nc || !js) throw new Error('NATS not initialized');
    return { nc, js, sc };
}

async function initNats() {
  try {
    const natsUrl = process.env.NATS_URL || 'nats://localhost:4222';
    nc = await connect({ servers: natsUrl });
    js = nc.jetstream();

    // Create or assert the JetStream Stream for user events
    const jsm = await nc.jetstreamManager();
    try {
      await jsm.streams.add({
        name: 'USER_EVENTS',
        subjects: ['users.event.>']
      });
      console.log('[USER SERVICE] JetStream stream "USER_EVENTS" active');
    } catch (err) {
      console.log('[USER SERVICE] Stream "USER_EVENTS" already exists');
    }

    console.log(`[USER SERVICE] Connected to NATS broker at ${natsUrl}`);
    return { nc, js };
  } catch (err) {
    console.error('[USER SERVICE] Failed to connect to NATS:', err);
    process.exit(1);
  }
}

module.exports = { initNats, getNats };