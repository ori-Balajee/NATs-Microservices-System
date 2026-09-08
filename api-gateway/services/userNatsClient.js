const { getNatsClient, sc } = require('../config/nats');

async function sendNatsRequest(subject, payload, timeoutMs = 5000){
    const nc = getNatsClient();
    const response = await nc.request(
        subject,
        sc.encode(JSON.stringify(payload)),
        {timeout : timeoutMs}
    );
    return JSON.parse(sc.decode(response.data));
}

module.exports = {sendNatsRequest};