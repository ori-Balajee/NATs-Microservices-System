const { getNats } = require('../config/nats');
const { v4: uuidv4 } = require('uuid');

async function publishUserRegisteredEvent(user) {
    const { js, sc } = getNats();

    const eventPayload = {
        event_id: uuidv4(),
        event_type: 'USER_REGISTERED',
        timestamp: new Date().toISOString(),
        data: {
            userId: user._id,
            name: user.name,
            email: user.email
        }
    };

    // Publish to JetStream subject
    await js.publish('users.event.created', sc.encode(JSON.stringify(eventPayload)));
    console.log(`[USER SERVICE] Published "USER_REGISTERED" event for: ${user.email}`);
}

module.exports = { publishUserRegisteredEvent };