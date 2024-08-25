// this snippet is used to update the wallet balance in the database

const Wallet = require("../models/wallet");
const solanaWeb3 = require("@solana/web3.js");

const updateWalletBalance = async (userId) => {
  const walletData = await Wallet.findOne({ userId: userId });
  // Create a connection to the Solana cluster
  const connection = new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl("mainnet-beta"),
    "confirmed"
  );

  if (walletData) {
    const publicKey = new solanaWeb3.PublicKey(walletData.publicKey);
    const balance = await connection.getBalance(publicKey);

    // Update the balance in the database
    walletData.balance = balance / solanaWeb3.LAMPORTS_PER_SOL; // Store balance in SOL
    await walletData.save();
  } else {
    throw new Error("Wallet not found");
  }
};

module.exports = updateWalletBalance;


// After a deposit or transaction
// await updateWalletBalance(userId);