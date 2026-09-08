const { getNats } = require('../config/nats');
const userService = require('../services/userService');

function setupRpcHandlers() {
    const { nc, sc } = getNats();

    const regSub = nc.subscribe('users.rpc.register');
    (async () => {
        for await (const msg of regSub) {
            try {
                const payload = JSON.parse(sc.decode(msg.data));
                const result = await userService.register(payload);
                msg.respond(sc.encode(JSON.stringify(result)));
            } catch (err) {
                msg.respond(sc.encode(JSON.stringify({ error: err.message })));
            }
        }
    })();

    const loginSub = nc.subscribe('users.rpc.login');
    (async () => {
        for await (const msg of loginSub) {
            try {
                const payload = JSON.parse(sc.decode(msg.data));
                const result = await userService.login(payload);
                msg.respond(sc.encode(JSON.stringify(result)));
            } catch (err) {
                msg.respond(sc.encode(JSON.stringify({ error: err.message })));
            }
        }
    })();

    console.log('[USER SERVICE] NATS RPC Handlers initialized');
}

module.exports = { setupRpcHandlers };