const express = require("express");
const bodyParser = require("body-parser");
const Twilio = require("twilio");
const axios = require("axios");
const { ethers } = require("ethers"); // Add this line to import ethers
const { formatVolume } = require("./utils/utils");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new Twilio(accountSid, authToken);

// console.log(accountSid, authToken);
const whatsappNumber = "whatsapp:+14155238886"; // Your Twilio WhatsApp number

// Example route for incoming messages
app.post("/webhook", async (req, res) => {
  const incomingMessage = req.body.Body.toLowerCase();
  const fromNumber = req.body.From;

  // Process the incoming message
  console.log(`Message received: ${incomingMessage} from ${fromNumber}`);

  let responseMessage;

  if (incomingMessage.includes("create")) {
    const wallet = ethers.Wallet.createRandom(); // Create a new wallet
    responseMessage = `Wallet created! Address: ${wallet.address}\nPrivate Key: ${wallet.privateKey}`;
  } else if (incomingMessage.includes("wallet")) {
    responseMessage = `Wallet address: ${wallet.address}`;
  } else if (incomingMessage.includes("token")) {
    const tokenAddress = incomingMessage.split(" ")[1];
    const fetchTokenDetails = require("./utils/fetchTokenDetails");
    try {
      const tokenDetails = await fetchTokenDetails(tokenAddress);
      const {
        name,
        symbol,
        price,
        volume,
        liquidity,
        chain,
        fdv,
        priceChangeh24,
        priceChangeh6,
        priceChangeh1,
        priceChangem5,
        dexId,
      } = tokenDetails;
      responseMessage = `Token Details:\n ✨Name: ${name}\n 👓Symbol: ${symbol}\n 💰Price: ${price}\n 📊Volume: $${formatVolume(
        volume
      )}\n 💦Liquidity: $${formatVolume(
        liquidity
      )}\n 🔗Chain: ${chain}\n 💎FDV: $${formatVolume(
        fdv
      )}\n 📈Price Change 24h: ${priceChangeh24}% 6h: ${priceChangeh6}% 1h: ${priceChangeh1}% 5m: ${priceChangem5}%\n 🚨Dex: ${dexId}`;
    } catch (error) {
      responseMessage = `Error fetching token details: ${error.message}`;
    }
  } else {
    responseMessage = 'Unknown command. Please use "create", "buy", or "sell".';
  }

  // Send a response back to the user
  await client.messages
    .create({
      body: responseMessage,
      from: whatsappNumber, // Your Twilio WhatsApp number
      to: fromNumber,
    })
    .then((message) => console.log(`Message sent with SID: ${message.sid}`));

  // Respond to Twilio
  res.send("<Response></Response>");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
