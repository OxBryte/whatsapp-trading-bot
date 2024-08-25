// Save the wallet to the database

const Wallet = require("../models/wallet");

const newWallet = (userId, wallet) => {
  const newWallet = new Wallet({
    userId: userId,
    publicKey: wallet.publicKey.toString(),
    secretKey: JSON.stringify(Array.from(wallet.secretKey)),
    balance: 0,
  });

  return newWallet;
};

module.exports = newWallet;
