const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { publishUserRegisteredEvent } = require('../events/userPublisher');

async function register(userData) {
    const { name, email, password } = userData;

    if (!name || !email || !password) {
        throw new Error('Name, email, and password are required');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    await publishUserRegisteredEvent(user);

    return {
        id: user._id,
        name: user.name,
        email: user.email
    };
}

async function login(credentials) {
    const { email, password } = credentials;

    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || 'super_secret_assignment_key_2026',
        { expiresIn: '1h' }
    );
    return { token };
}

module.exports = { register, login };