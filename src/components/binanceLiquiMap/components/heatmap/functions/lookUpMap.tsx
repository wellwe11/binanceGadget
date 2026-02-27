const lookUpMap = (arr, keyOne, keyTwo) => {
  const map = new Map();

  arr.forEach((c) => {
    map.set(`${c[keyOne]}-${c[keyTwo].toFixed(4)}`, c);
  });

  return map;
};

export default lookUpMap;
