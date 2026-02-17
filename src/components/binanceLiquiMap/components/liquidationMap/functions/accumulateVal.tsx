import { List } from "../liquidationMap";

type accumulatedType = List & { accumulatedVol: number };

// Accumulate data vol += vol
const accumulateVal = (d: List[]) => {
  let totalVol = 0;
  const calcTotal: accumulatedType[] = [];

  d.forEach((i) => {
    const vol = i.vol;
    totalVol += vol;

    calcTotal.push({ ...i, accumulatedVol: totalVol });
  });

  return calcTotal;
};

export default accumulateVal;
