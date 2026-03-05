import { DataType, List } from "../Types";

const filterByType = (arr: DataType[], currentPrice) => {
  const short: List[] = [];
  const long: List[] = [];

  const addToBucket = (item: DataType) => {
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
