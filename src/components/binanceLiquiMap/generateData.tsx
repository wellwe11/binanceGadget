import * as d3 from "d3";

const generateHeatmapData = (names: string[], days = 100) => {
  const data = [];
  const today = new Date();
  let contractPool = [];

  let amountOfData;
  let timeOffset;
  if (days <= 1) {
    amountOfData = 25;
    timeOffset = (i: number) => d3.timeHour.offset(today, -i);
  } else if (days <= 7) {
    amountOfData = Math.floor((days * 16) / 6);
    timeOffset = (i: number) => d3.timeHour.offset(today, -i * 6);
  } else if (days <= 14) {
    amountOfData = Math.floor((days * 26) / 8);
    timeOffset = (i: number) => d3.timeHour.offset(today, -i * 8);
  } else {
    amountOfData = days;
    timeOffset = (i: number) => d3.timeDay.offset(today, -i);
  }

  const lastPrices = {};
  names.forEach((name) => (lastPrices[name] = 500));

  // Loop forward in time so contracts accumulate properly
  for (let i = amountOfData; i >= 0; i--) {
    const date = timeOffset(i);

    names.forEach((name) => {
      const open = lastPrices[name];
      const isUp = Math.random() > 0.5;
      const volatility = Math.random() * 50;
      const close = isUp ? open + volatility : Math.max(0, open - volatility);
      const high = Math.max(open, close) + Math.random() * 10;
      const low = Math.max(0, Math.min(open, close) - Math.random() * 10);
      lastPrices[name] = close;
      const newOrdersCount = Math.floor(Math.random() * 2);

      // 2. DEFINE PRICE STEPS
      // Rounding to 5 or 10 ensures multiple orders hit the exact same price
      const priceStep = 10;

      for (let j = 0; j < newOrdersCount; j++) {
        const isShort = Math.random() > 0.5;
        const priceOffset = Math.random() * 300;

        const rawPrice = isShort ? close + priceOffset : close - priceOffset;
        // ROUND the price to the step to force stacking
        const snappedPrice = Math.round(rawPrice / priceStep) * priceStep;

        contractPool.push({
          price: snappedPrice,
          volume: Math.floor(Math.random() * 500), // Higher volume range
          type: snappedPrice > close ? "short" : "long",
        });
      }

      // 3. CLEAN UP (Optional)
      // Keep the pool from growing infinitely if it gets too slow
      if (contractPool.length > 1000) {
        contractPool = contractPool.slice(-1000);
      }

      data.push({
        coin: name,
        date,
        open,
        close,
        high,
        low: low > 0 ? low : 0,
        value: close,
        liquidations: [...contractPool], // Shallow copy of the pool
      });
    });
  }
  return data;
};

export default generateHeatmapData;
