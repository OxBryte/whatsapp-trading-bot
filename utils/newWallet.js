// Save the wallet to the database

const Wallet = require("../models/wallet");
const getWalletBalance = require("./getWalletBalance");

const createNewWallet = async (userId, wallet) => {
  const publicKey = wallet.publicKey.toString();
  const balance = await getWalletBalance(wallet.publicKey);

  const newWallet = new Wallet({
    userId: userId,
    publicKey: publicKey,
    secretKey: JSON.stringify(Array.from(wallet.secretKey)),
    balance: balance,
  });

  return newWallet;
};

module.exports = createNewWallet;
