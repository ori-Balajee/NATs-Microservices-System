const { sendNatsRequest } = require('../services/userNatsClient');

async function registerUser(req, res) {
    try {
        const data = await sendNatsRequest('users.rpc.register', req.body);
        if (data.error) return res.status(400).json(data);
        return res.status(201).json(data);
    } catch (err) {
        return res.status(504).json({ error: 'User Service timed out or unavailable' });
    }
}

async function loginUser(req, res) {
    try {
        const data = await sendNatsRequest('users.rpc.login', req.body);
        if (data.error) return res.status(401).json(data);
        return res.status(200).json(data);
    } catch (err) {
        return res.status(504).json({ error: 'User Service timed out or unavailable' });
    }
}

function getProfile(req, res) {
    return res.status(200).json({
        message: 'Profile retrieved successfully',
        user: req.user
    });
}

module.exports = { registerUser, loginUser, getProfile };