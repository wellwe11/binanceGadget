const lookUpMap = (arr, keyOne, keyTwo) => {
  const map = new Map();

  arr.forEach((c) => {
    const firstKey = c[keyOne];
    const secondKey = c[keyTwo].toFixed(4);
    map.set(`${firstKey}-${secondKey}`, c);
  });

  return map;
};

export default lookUpMap;
