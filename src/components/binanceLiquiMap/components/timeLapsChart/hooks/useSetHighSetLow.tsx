import { useEffect, useState } from "react";

const useSetHighSetLow = (low: number, high: number) => {
  const [lowestVal, setLowestVal] = useState<number>(low);
  const [highestVal, setHighestVal] = useState<number>(high);

  useEffect(() => {
    const highestVal = low > high ? low : high;
    const lowestVal = low < high ? low : high;

    setLowestVal(lowestVal);
    setHighestVal(highestVal);
  }, [low, high]);

  return [lowestVal, highestVal];
};

export default useSetHighSetLow;
