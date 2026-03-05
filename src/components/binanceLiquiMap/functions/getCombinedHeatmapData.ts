import { CoinOnDateType, HeatmapDataType } from "../types";

const getCombinedHeatmapData = (
  data: CoinOnDateType[],
  min: number,
  max: number,
  amountOfBuckets: number,
) => {
  const priceStep = (max - min) / amountOfBuckets;
  console.log(data);

  const cellGrid = <HeatmapDataType>new Map();
  const bucketMap = new Map();
  let globalMaxVol = 0;
  let totalVol = 0;

  for (let i = 0; i < amountOfBuckets; i++) {
    const p = min + i * priceStep;
    bucketMap.set(i, { price: p, volume: 0 });
  }

  data.forEach((obj) => {
    const sliceVolumes = new Array(amountOfBuckets).fill(0);

    obj.liquidations.forEach((l) => {
      const idx = Math.floor((l.price - min) / priceStep);
      if (idx >= 0 && idx < amountOfBuckets) {
        sliceVolumes[idx] += l.volume;

        bucketMap.get(idx).volume += l.volume;
      }
    });

    for (let i = 0; i < amountOfBuckets; i++) {
      const bucketPrice = min + i * priceStep;
      const vol = sliceVolumes[i];
      if (vol > globalMaxVol) globalMaxVol = vol;
      totalVol += vol;

      const isLiquidated = bucketPrice >= obj.low && bucketPrice <= obj.high;
      const key = `${obj.date}-${bucketPrice.toFixed(4)}`;

      const { price, volume, ...rest } = obj;

      cellGrid.set(key, {
        ...rest,
        price: bucketPrice,
        volume: isLiquidated ? 0 : vol,
      });
    }
  });

  console.log(cellGrid);

  return {
    maxVolume: globalMaxVol,
    totalVolume: totalVol,
    cellGrid,
    aggregateBar: Array.from(bucketMap.values()),
    currentPrice: data[data.length - 1].value,
  };
};

export default getCombinedHeatmapData;
