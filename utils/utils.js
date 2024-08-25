export const formatVolume = (volume) => {
  return volume >= 1e6
    ? `${(volume / 1e6).toFixed(1)}M`
    : `${(volume / 1e3).toFixed(1)}K`;
};
