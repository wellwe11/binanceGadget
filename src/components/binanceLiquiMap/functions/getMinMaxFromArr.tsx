const getMinMaxFromArr = (arr) => {
  if (arr.length === 0) return { min: undefined, max: undefined };

  let min = arr[0];
  let max = arr[0];

  for (let i = 0; i < arr.length; i++) {
    const obj = arr[i];

    if (obj.value < min.value) min = obj;
    if (obj.value > max.value) max = obj;
  }

  return { min, max };
};

export default getMinMaxFromArr;
