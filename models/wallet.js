const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // To associate wallet with a user
  publicKey: { type: String, required: true },
  secretKey: { type: String, required: true },
});

const Wallet = mongoose.model("Wallet", walletSchema);

module.exports = Wallet;