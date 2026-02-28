import * as d3 from "d3";

// Need to create TimeBuckets as well.
const generateHeatmapData = (names, days = 300) => {
  const data = [];
  const today = new Date();
  let contractPool = [];

  let amountOfData;
  let timeOffset;
  if (days <= 1) {
    amountOfData = 25;
    timeOffset = (i) => d3.timeHour.offset(today, -i);
  } else {
    amountOfData = days;
    timeOffset = (i) => d3.timeDay.offset(today, -i);
  }

  const lastPrices = {};
  const clusters = {};

  names.forEach((name) => {
    lastPrices[name] = 500;
    // ✅ Create 5-8 cluster zones
    clusters[name] = Array.from(
      { length: 7 },
      () => 500 + (Math.random() - 0.5) * 400, // ✅ Tighter initial range
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

      // ✅ Add clusters 40% of the time (more frequent)
      if (Math.random() > 0.6) {
        const clusterIdx = Math.floor(Math.random() * clusters[name].length);
        clusters[name][clusterIdx] = close + (Math.random() - 0.5) * 300;

        const targetPrice = clusters[name][clusterIdx];
        const priceStep = 5; // ✅ Smaller step for tighter clustering

        // ✅ Create 20-40 orders per cluster (much denser)
        const ordersInCluster = Math.floor(Math.random() * 20) + 20;

        for (let j = 0; j < ordersInCluster; j++) {
          // ✅ Tighter spread (±3 units instead of ±7.5)
          const snappedPrice =
            Math.round((targetPrice + (Math.random() * 6 - 3)) / priceStep) *
            priceStep;

          contractPool.push({
            price: Math.max(10, snappedPrice),
            volume: Math.floor(Math.random() * 600) + 300, // ✅ Higher base volume
            type: snappedPrice > close ? "short" : "long",
          });
        }
      }

      // ✅ Remove liquidated positions (price passed through)
      contractPool = contractPool.filter((contract) => {
        if (contract.type === "short" && low >= contract.price) {
          return false; // Liquidated
        }
        if (contract.type === "long" && high <= contract.price) {
          return false; // Liquidated
        }
        return true;
      });

      // ✅ Higher pool limit for more density
      if (contractPool.length > 3000) {
        contractPool.splice(0, 50); // Remove oldest in larger batches
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
