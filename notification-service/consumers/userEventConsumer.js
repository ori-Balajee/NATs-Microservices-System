const { getNats } = require('../config/nats');
const { consumerOpts, AckPolicy } = require('nats');
const { isEventProcessed, markEventProcessed } = require('../utils/idempotencyStore');
const { sendWelcomeEmail } = require('../services/notificationService');

async function startUserEventConsumer() {
    const { js, sc } = getNats();

    // Create consumer options using consumerOpts()
    const opts = consumerOpts();
    opts.durable('notification-service-worker');
    opts.ackExplicit();
    opts.deliverTo('notification-service-deliver');

    try {
        const sub = await js.subscribe('users.event.created', opts);
        console.log('[NOTIFICATION SERVICE] Subscribed to JetStream subject: users.event.created');

        (async () => {
            for await (const msg of sub) {
                try {
                    const event = JSON.parse(sc.decode(msg.data));
                    const { event_id, event_type, data } = event;

                    // Idempotency Check
                    if (isEventProcessed(event_id)) {
                        console.log(`[NOTIFICATION SERVICE] Event ${event_id} already processed. Skipping.`);
                        msg.ack();
                        continue;
                    }

                    if (event_type === 'USER_REGISTERED') {
                        await sendWelcomeEmail(data);
                        markEventProcessed(event_id);
                    }

                    msg.ack();
                } catch (err) {
                    console.error('[NOTIFICATION SERVICE] Error processing message:', err.message);
                    msg.nak();
                }
            }
        })();
    } catch (err) {
        console.error('[NOTIFICATION SERVICE] Consumer subscription error:', err);
    }
}

module.exports = { startUserEventConsumer };