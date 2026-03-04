type returnArray = [lowestVal: number, highestVal: number, isReversed: boolean];

const useSetHighSetLow = (low: number, high: number): returnArray => {
  const lowestVal = Math.min(low, high);
  const highestVal = Math.max(low, high);
  const isReversed = low > high;
  return [lowestVal, highestVal, isReversed];
};

export default useSetHighSetLow;
