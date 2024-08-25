const formatVolume = (volume) => {
  return volume >= 1e6
    ? `${(volume / 1e6).toFixed(1)}M`
    : `${(volume / 1e3).toFixed(1)}K`;
};

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Adjust options as needed for formatting
  };

module.exports = { formatVolume, formatDate };