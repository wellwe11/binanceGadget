import { DataType, List } from "../liquidationMap";

const filterByType = (arr: DataType[]) => {
  const short: List[] = [];
  const long: List[] = [];

  const addToBucket = (item: DataType) => {
    const price = item.price;

    short.push({ price: price, vol: item.shortVol });
    long.push({ price: price, vol: item.longVol });
  };

  arr.forEach(addToBucket);

  return { short, long };
};

export default filterByType;
