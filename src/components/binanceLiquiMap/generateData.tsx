import * as d3 from "d3";

// Need to create TimeBuckets as well.

const generateHeatmapData = (names, days = 200) => {
  const data = [];
  const today = new Date();
  let contractPool = [];

  // 1. Determine density based on timeframe
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
  // Create "sticky" price levels where clusters will form
  const clusters = {};

  names.forEach((name) => {
    lastPrices[name] = 500;
    // Pre-define 3-5 specific price levels for each coin to clump around
    clusters[name] = Array.from(
      { length: 4 },
      () => 500 + (Math.random() - 0.5) * 600,
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

      // 2. DECREASE FREQUENCY: Only update/add clusters 15% of the time
      if (Math.random() > 0.85) {
        // Occasionally shift one cluster level to simulate market moving
        const clusterIdx = Math.floor(Math.random() * clusters[name].length);
        clusters[name][clusterIdx] = close + (Math.random() - 0.5) * 400;

        // Add a "Heavy Cluster" to the pool
        const targetPrice = clusters[name][clusterIdx];
        const priceStep = 10;

        // Spawn 5-10 orders tightly around this specific price
        for (let j = 0; j < 8; j++) {
          const snappedPrice =
            Math.round((targetPrice + (Math.random() * 15 - 7.5)) / priceStep) *
            priceStep;

          contractPool.push({
            price: snappedPrice,
            volume: Math.floor(Math.random() * 800) + 200, // Higher volume for clumps
            type: snappedPrice > close ? "short" : "long",
          });
        }
      }

      // 3. PERSISTENCE: Slowly decay the pool so clumps fade rather than disappear
      if (contractPool.length > 800) {
        contractPool.splice(0, 10); // Remove oldest orders slowly
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
