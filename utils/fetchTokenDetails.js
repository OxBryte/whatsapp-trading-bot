// this snippet is used to fetch the token details

const axios = require("axios");

async function fetchTokenDetails(tokenAddress) {
  try {
    const response = await axios.get(
      `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`
    );
    const tokenDetails = response.data;
    // check if the token is on the solana chain
    const solanaChainId = "solana";
    if (tokenDetails.pairs[0].chainId !== solanaChainId) {
      throw new Error("Token does not belong to the Solana chain.");
    }

    return {
      name: tokenDetails.pairs[0].baseToken.name,
      symbol: tokenDetails.pairs[0].baseToken.symbol,
      fdv: tokenDetails.pairs[0].fdv,
      price: tokenDetails.pairs[0].priceUsd,
      volume: tokenDetails.pairs[0].volume.h24,
      liquidity: tokenDetails.pairs[0].liquidity.usd,
      chain: tokenDetails.pairs[0].chainId,
      priceChangeh24: tokenDetails.pairs[0].priceChange.h24,
      priceChangeh6: tokenDetails.pairs[0].priceChange.h6,
      priceChangeh1: tokenDetails.pairs[0].priceChange.h1,
      priceChangem5: tokenDetails.pairs[0].priceChange.m5,
      dexId: tokenDetails.pairs[0].dexId,
      fdv: tokenDetails.pairs[0].fdv,
      date: tokenDetails.pairs[0].pairCreatedAt,
    };
  } catch (error) {
    console.error("Error fetching token details:", error);
    throw error;
  }
}

// Example usage
// fetchTokenDetails("0x...").then(console.log).catch(console.error);

module.exports = fetchTokenDetails;
