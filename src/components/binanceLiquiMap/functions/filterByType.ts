import { AggregatedBarType } from "../types";

const filterByType = (arr: AggregatedBarType[], currentPrice: number) => {
  const short: AggregatedBarType[] = [];
  const long: AggregatedBarType[] = [];

  const addToBucket = (item: AggregatedBarType) => {
    const price = item.price;

    if (price > currentPrice) {
      short.push({ price: price, volume: item.volume });
    } else {
      long.push({ price: price, volume: item.volume });
    }
  };

  arr.forEach(addToBucket);

  return { short, long };
};

export default filterByType;
