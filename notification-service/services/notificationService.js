async function sendWelcomeEmail(userData) {
    const { name, email } = userData;

    console.log('\n==================================================');
    console.log(`[NOTIFICATION SERVICE] Sending Welcome Email to: ${email}`);
    console.log(`Message: "Hello ${name}, welcome to our platform!"`);
    console.log('==================================================\n');
}

module.exports = { sendWelcomeEmail };