// this snippet is used to get the wallet balance

const solanaWeb3 = require("@solana/web3.js");

// Create a connection to the Solana cluster
const connection = new solanaWeb3.Connection(
  solanaWeb3.clusterApiUrl("mainnet-beta"),
  "confirmed"
);

async function getWalletBalance(walletAddress) {
  try {
    const publicKey = new solanaWeb3.PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    return balance / solanaWeb3.LAMPORTS_PER_SOL;
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    throw error;
  }
}

module.exports = getWalletBalance;
