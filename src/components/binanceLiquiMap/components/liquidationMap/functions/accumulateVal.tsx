// Accumulate data vol += vol
const accumulateVal = (d) => {
  let totalVol = 0;
  const calcTotal = [];

  d.forEach((i) => {
    const vol = i.vol;
    totalVol += vol;

    calcTotal.push({ ...i, accumulatedVol: totalVol });
  });

  return calcTotal;
};

export default accumulateVal;
