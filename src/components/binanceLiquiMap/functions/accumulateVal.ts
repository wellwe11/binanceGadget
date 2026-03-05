import { AccumulatedVol, AggregatedBarType } from "../types";

// Accumulate data vol += vol
const accumulateVal = (d: AggregatedBarType[]) => {
  let totalVol = 0;
  const calcTotal: AccumulatedVol[] = [];

  d.forEach((i) => {
    const vol = i.volume;
    totalVol += vol;

    calcTotal.push({ ...i, accumulatedVol: totalVol });
  });

  return calcTotal;
};

export default accumulateVal;
