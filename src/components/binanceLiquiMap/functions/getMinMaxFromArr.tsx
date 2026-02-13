const getMinMaxFromArr = (arr) => {
  if (arr.length === 0) return { min: undefined, max: undefined };

  let min = arr[0];
  let max = arr[0];

  for (let i = 0; i < arr.length; i++) {
    const value = arr[i];
    if (value < min) min = value;
    if (value > max) max = value;
  }

  return { min, max };
};

export default getMinMaxFromArr;
