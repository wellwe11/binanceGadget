import * as d3 from "d3";

const generateHeatmapData = (names: string[], days = 100) => {
  const data = [];
  const today = new Date();

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

  for (let i = 0; i < amountOfData; i++) {
    const date = timeOffset(i);

    names.forEach((name) => {
      const isUp = Math.random() > 0.5;
      const volatility = Math.random() * 50;

      // 2. Open is previous Close
      const open = lastPrices[name];
      const close = isUp
        ? open + volatility
        : open - volatility < 0
          ? open + volatility / 2
          : open - volatility;

      // 3. Ensure High/Low envelop Open/Close
      const high = Math.max(open, close) + Math.random() * 30;
      const low = Math.min(open, close) - Math.random() * 30;

      // 4. Update tracker for next iteration
      lastPrices[name] = close;
      const boolean = Math.random() > 0.5;
      const priceClarity = Math.random() > 0.8 ? 3000 : 200;

      data.push({
        coin: name,
        date: date,
        open,
        close,
        high,
        low,
        value: close,
        openInterest: Math.floor(Math.random() * 100) + 1000,
        type: boolean ? "long" : "short",
        volume: Math.floor(Math.random() * 20) + priceClarity,
      });
    });
  }
  return data;
};

export default generateHeatmapData;
