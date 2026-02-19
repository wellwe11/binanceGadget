import { DataType, List } from "../Types";

const filterByType = (arr: DataType[]) => {
  const short: List[] = [];
  const long: List[] = [];

  const addToBucket = (item: DataType) => {
    const price = item.value;

    if (item.type === "short") {
      short.push({ price: price, vol: item.volume });
    } else {
      long.push({ price: price, vol: item.volume });
    }
  };

  arr.forEach(addToBucket);

  return { short, long };
};

export default filterByType;
