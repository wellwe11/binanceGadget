const filterByType = (arr) => {
  const short = {};
  const long = {};

  const addToBucket = (item) => {
    const price = item.price;

    short[price] = { price: price, vol: item.shortVol };
    long[price] = { price: price, vol: item.longVol };
  };

  arr.forEach(addToBucket);

  return { short, long };
};

export default filterByType;
