const express = require('express');
const bodyParser = require('body-parser');
const Twilio = require('twilio');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new Twilio(accountSid, authToken);

// console.log(accountSid, authToken);
const whatsappNumber = 'whatsapp:+14155238886'; // Your Twilio WhatsApp number


app.post('/webhook', (req, res) => {
    const incomingMessage = req.body.Body;
    const fromNumber = req.body.From;

    // Process the incoming message
    console.log(`Message received: ${incomingMessage} from ${fromNumber}`);

    // Send a response back to the user
    client.messages.create({
        body: 'Thanks for your message!',
        from: 'whatsapp:+14155238886',  // Your Twilio WhatsApp number
        to: fromNumber
    }).then(message => console.log(`Message sent with SID: ${message.sid}`));

    // Respond to Twilio
    res.send('<Response></Response>');
});
// Example route for incoming messages
// app.post('/webhook', async (req, res) => {
//     const message = req.body.Body.toLowerCase();
//     const from = req.body.From;

//     if (message.includes('buy')) {
//         // Example: Execute a buy order through the trading API
//         const response = await executeTrade('buy');
//         sendMessage(from, `Trade executed: ${response}`);
//     } else if (message.includes('sell')) {
//         // Example: Execute a sell order through the trading API
//         const response = await executeTrade('sell');
//         sendMessage(from, `Trade executed: ${response}`);
//     } else {
//         sendMessage(from, 'Unknown command. Please use "buy" or "sell".');
//     }

//     res.sendStatus(200);
// });

// function sendMessage(to, body) {
//     client.messages.create({
//         body,
//         from: whatsappNumber,
//         to
//     });
// }

// async function executeTrade(action) {
//     try {
//         // Replace this with a real trading API request
//         const response = await axios.post('https://api.tradingplatform.com/order', {
//             action,
//             amount: 1, // Example amount
//             symbol: 'BTCUSDT'
//         }, {
//             headers: {
//                 'Authorization': `Bearer ${process.env.TRADING_API_KEY}`
//             }
//         });

//         return `Order placed: ${response.data}`;
//     } catch (error) {
//         console.error(error);
//         return `Failed to execute trade: ${error.message}`;
//     }
// }

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
