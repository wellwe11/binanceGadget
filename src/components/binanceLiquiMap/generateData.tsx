import { GeneratedDataType, LiquidationType } from "./types";
import * as d3 from "d3";

const generateHeatmapData = (names: string[], days: number) => {
  const data = [] as GeneratedDataType[];
  const today = new Date();
  let contractPool = [] as LiquidationType[];

  // ✅ Always ensure at least 100 points
  let amountOfData = 300;

  if (days > 29) amountOfData = 400;
  if (days > 87) amountOfData = 500;
  if (days > 182) amountOfData = 600;
  if (days > 365) amountOfData = 1200;

  // ✅ Use Minutes for interval to handle short durations (like 12h) accurately
  const totalMinutes = days * 24 * 60;
  const intervalMinutes = totalMinutes / amountOfData;

  // Use d3.timeMinute instead of timeHour for higher granularity
  const timeOffset = (i: number): Date =>
    d3.timeMinute.offset(today, -(i * intervalMinutes));

  const lastPrices: Record<string, number> = {};
  const clusters: Record<string, number[]> = {};

  names.forEach((name) => {
    lastPrices[name] = 500;
    clusters[name] = Array.from(
      { length: 5 },
      () => 500 + (Math.random() - 0.5) * 400,
    );
  });

  for (let i = amountOfData; i >= 0; i--) {
    const date = timeOffset(i);

    names.forEach((name) => {
      const open = lastPrices[name];
      const volatility = Math.random() * 40;
      const isUp = Math.random() > 0.5;
      const close = isUp ? open + volatility : Math.max(10, open - volatility);
      const high = Math.max(open, close) + Math.random() * 5;
      const low = Math.max(5, Math.min(open, close) - Math.random() * 5);
      lastPrices[name] = close;

      // ✅ Less frequent clustering (25% chance)
      if (Math.random() > 0.75) {
        const clusterIdx = Math.floor(Math.random() * clusters[name].length);
        clusters[name][clusterIdx] = close + (Math.random() - 0.5) * 100;

        const targetPrice = clusters[name][clusterIdx];
        const priceStep = 5;

        // ✅ Moderate orders per cluster (12-20)
        const ordersInCluster = Math.floor(Math.random() * 8) + 12;

        for (let j = 0; j < ordersInCluster; j++) {
          const spread = 35;
          const snappedPrice =
            Math.round(
              (targetPrice + (Math.random() - 0.5) * spread) / priceStep,
            ) * priceStep;

          contractPool.push({
            price: Math.max(10, snappedPrice),
            volume: Math.floor(Math.random() * 600) + 300,
            type: snappedPrice > close ? "short" : "long",
          });
        }
      }

      // ✅ Remove ONLY liquidated positions (price passed through)
      contractPool = contractPool.filter((contract) => {
        // Short liquidated if price went ABOVE it
        if (contract.type === "short" && low >= contract.price) {
          return false;
        }
        // Long liquidated if price went BELOW it
        if (contract.type === "long" && high <= contract.price) {
          return false;
        }
        // Keep all others - they persist until liquidated
        return true;
      });

      // ✅ Moderate pool limit (600)
      if (contractPool.length > 600) {
        contractPool.splice(0, 50);
      }

      data.push({
        coin: name,
        date,
        open,
        close,
        high,
        low,
        value: close,
        liquidations: [...contractPool],
      });
    });
  }

  return data;
};

export default generateHeatmapData;
