import * as d3 from "d3";

const generateHeatmapData = (names: string[], days = 600) => {
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

  for (let i = 0; i < amountOfData; i++) {
    const date = timeOffset(i);

    names.forEach((name) => {
      const priceClarity = Math.random() > 0.8 ? 2000 : 100;
      const val = Math.floor(Math.random() * 500) + priceClarity;

      data.push({
        coin: name,
        date: date,
        value: val,
        low: val * 0.7,
        high: val * 1.3,
        openInterest: Math.floor(Math.random() * 100000) + 50000,
        type: Math.random() > 0.5 ? "long" : "short",
        volume: Math.floor(Math.random() * 500) + priceClarity,
      });
    });
  }
  return data;
};

export default generateHeatmapData;
