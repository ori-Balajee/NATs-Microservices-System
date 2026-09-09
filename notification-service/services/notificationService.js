const notifier = require('node-notifier');
const path = require('path');

async function sendWelcomeEmail(userData) {
    const { name, email } = userData;

    // Triggers OS Native Desktop Notification
    notifier.notify({
        title: 'New User Registered!',
        message: `${name} (${email}) just joined the platform.`,
        sound: true,
        wait: false
    });

    console.log(`[NOTIFICATION SERVICE] Desktop alert displayed for ${email}`);
}

module.exports = { sendWelcomeEmail };