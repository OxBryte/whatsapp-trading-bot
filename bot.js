const express = require("express");
const bodyParser = require("body-parser");
const Twilio = require("twilio");
const axios = require("axios");
const { ethers } = require("ethers"); // Add this line to import ethers
const { Connection, Keypair } = require("@solana/web3.js"); // Import Solana libraries
const solanaWeb3 = require("@solana/web3.js");
require("dotenv").config();
const { formatVolume, formatDate } = require("./utils/utils");
const { default: mongoose } = require("mongoose");
const Wallet = require("./models/wallet");
const getWalletBalance = require("./utils/getWalletBalance");
const newWallet = require("./utils/newWallet");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new Twilio(accountSid, authToken);

// console.log(accountSid, authToken);
const whatsappNumber = "whatsapp:+14155238886"; // Your Twilio WhatsApp number
const connection = new solanaWeb3.Connection(
  solanaWeb3.clusterApiUrl("mainnet-beta"),
  "confirmed"
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 20000,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Example route for incoming messages
app.post("/webhook", async (req, res) => {
  const incomingMessage = req.body.Body.toLowerCase();
  const fromNumber = req.body.From;

  // Process the incoming message
  console.log(`Message received: ${incomingMessage} from ${fromNumber}`);

  let responseMessage;
  let walletData = await Wallet.findOne({ userId: fromNumber });
  let wallet;
  let walletAddress;

  // Check if the user is new
  if (!walletData) {
    responseMessage = `Welcome! Here are the commands you can use:\n
    1. **create** - Create a new wallet.\n
    2. **wallet** - Check your wallet details.\n
    3. **balance** - Check your wallet balance.\n
    4. **token <token address>** - Get details about a specific token.\n
    \nFeel free to ask if you have any questions!`;

    // Send the welcome message
    await client.messages.create({
      body: responseMessage,
      from: whatsappNumber,
      to: fromNumber,
    });
  }

  if (incomingMessage.includes("create")) {
    const userId = fromNumber;
    wallet = Keypair.generate(); // Create a new Solana wallet
    // wallet = ethers.Wallet.createRandom(); // Create a new evm wallet
    // responseMessage = `Wallet created! Address: \n\n${wallet.address}\nPrivate Key: ${wallet.privateKey}`; // for evm
    await newWallet(userId, wallet)
      .save()
      .then(() => {
        responseMessage = `Wallet created! Address: \n\n${wallet.publicKey.toString()}\nPrivate Key: ${wallet.secretKey.toString()}`; // for solana
      })
      .catch((err) => {
        responseMessage = `Error creating wallet: ${err.message}`;
      });
  } else if (incomingMessage.includes("wallet")) {
    const userId = fromNumber; // Use the user's phone number to find their wallet
    walletData = await Wallet.findOne({ userId: userId });
    if (walletData) {
      walletAddress = walletData.publicKey;
      const balance = await getWalletBalance(walletAddress);
      responseMessage = `Wallet address: ${walletAddress} \n Balance: ${balance} SOL`;
    } else {
      responseMessage = `No wallet found. Please create a wallet first by prompting "create"`;
    }
  } else if (incomingMessage.includes("balance")) {
    const userId = fromNumber; // Use the user's phone number to find their wallet
    walletData = await Wallet.findOne({ userId: userId });

    if (walletData) {
      try {
        walletAddress = walletData.publicKey;
        const balance = await getWalletBalance(walletAddress);
        responseMessage =
          balance === 0
            ? "Get some fund in your fucking bag!!"
            : `Wallet balance: ${balance} SOL`;
      } catch (error) {
        responseMessage = `Error fetching balance: ${error.message}`;
      }
    } else {
      responseMessage = `No wallet found. Please create a wallet first by prompting "create"`;
    }
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
        date,
      } = tokenDetails;
      responseMessage = `Token Details:\n ✨Name: ${name}\n 👓Symbol: ${symbol}\n 💰Price: ${price}\n 📊Volume: $${formatVolume(
        volume
      )}\n 💦Liquidity: $${formatVolume(
        liquidity
      )}\n 🔗Chain: ${chain}\n 💎FDV: $${formatVolume(
        fdv
      )}\n 📈Price Change 24h: ${priceChangeh24}% 6h: ${priceChangeh6}% 1h: ${priceChangeh1}% 5m: ${priceChangem5}%\n 🚨Dex: ${dexId} \n 📅Age: ${formatDate(
        date
      )} \n\nWhat would you like to do next?\n1. Get more details\n2. Buy Token\n3. Sell Token\nReply with the number of your choice.`;
    } catch (error) {
      responseMessage = `${error.message}`;
    }
  } else {
    responseMessage =
      'Unknown command. Please use \n"create", \n"token <token address>", \n"balance", \n"wallet".';
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
