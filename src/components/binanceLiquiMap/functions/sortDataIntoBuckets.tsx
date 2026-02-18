const sortDataIntoBuckets = (data, binSize = 1) => {
  const bins = {};

  data.forEach((item) => {
    const priceBin = Math.floor(item.value / binSize) * binSize;

    if (!bins[priceBin])
      bins[priceBin] = { price: priceBin, shortVol: 0, longVol: 0 };

    if (item.type === "short") bins[priceBin].shortVol += item.volume;
    else bins[priceBin].longVol += item.volume;
  });
  return Object.values(bins);
};

export default sortDataIntoBuckets;
