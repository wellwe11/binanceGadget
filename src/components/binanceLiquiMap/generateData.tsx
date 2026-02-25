import * as d3 from "d3";

const generateHeatmapData = (names: string[], days = 50) => {
  const data = [];
  const today = new Date();
  let contractPool = []; // The "memory" of active contracts

  let lowestPrice = 0;
  let highestPrice = 0;
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

      // 1. ADD NEW CONTRACTS
      const newOrdersCount = Math.floor(Math.random() * 5);
      for (let j = 0; j < newOrdersCount; j++) {
        const isShort = Math.random() > 0.5;
        // Shorts above price, Longs below price
        const price = isShort
          ? close + Math.random() * 200
          : Math.max(0, close - Math.random() * 200);

        contractPool.push({
          price: Math.round(price),
          volume: Math.floor(Math.random() * 500),
          type: isShort ? "short" : "long",
        });
      }

      // 3. AGGREGATE (Optional: combine volumes at same price for cleaner chart)
      const currentLiquidations = contractPool.map((c) => ({ ...c }));

      data.push({
        coin: name,
        date,
        open,
        close,
        high,
        low,
        value: close,
        liquidations: currentLiquidations,
      });
    });
  }
  return data;
};

export default generateHeatmapData;
