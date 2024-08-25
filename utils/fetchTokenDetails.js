const axios = require("axios");

async function fetchTokenDetails(tokenAddress) {
  try {
    const response = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);
    const tokenDetails = response.data;

    console.log(tokenDetails);
    // Display token details
    return {
      name: tokenDetails.pairs[0].baseToken.name,
      symbol: tokenDetails.pairs[0].baseToken.symbol,
      price: tokenDetails.pairs[0].priceUsd,
      volume: tokenDetails.pairs[0].volumeUsd24h,
      liquidity: tokenDetails.pairs[0].liquidity.usd,
      chain: tokenDetails.pairs[0].chainId,
      marketCap: tokenDetails.pairs[0].marketCapUsd,
      volumeUsd24h: tokenDetails.pairs[0].volume.h24,
    };
  } catch (error) {
    console.error("Error fetching token details:", error);
    throw new Error("Failed to fetch token details");
  }
}

// Example usage
// fetchTokenDetails("0x...").then(console.log).catch(console.error);

module.exports = fetchTokenDetails;