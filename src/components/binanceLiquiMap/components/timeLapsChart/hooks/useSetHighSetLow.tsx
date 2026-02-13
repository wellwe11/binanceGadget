import { useEffect, useState } from "react";

type returnArray = [lowestVal: number, highestVal: number, isReversed: boolean];

const useSetHighSetLow = (low: number, high: number): returnArray => {
  const [lowestVal, setLowestVal] = useState<number>(low);
  const [highestVal, setHighestVal] = useState<number>(high);
  const [isReversed, setIsReversed] = useState<boolean>(false);

  useEffect(() => {
    const highestVal = low > high ? low : high;
    const lowestVal = low < high ? low : high;

    if (low > high) {
      setIsReversed(true);
    } else {
      setIsReversed(false);
    }

    setLowestVal(lowestVal);
    setHighestVal(highestVal);
  }, [low, high]);

  return [lowestVal, highestVal, isReversed];
};

export default useSetHighSetLow;
