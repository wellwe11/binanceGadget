import { MoveGraphInterface } from "../timeLapsChart";

const moveGraph: MoveGraphInterface = (max, min, percentualClick, setter) => {
  setter((prev) => {
    // Return if user is clicking on the graph itself (Allows for more comfortable control)
    if (percentualClick > prev.start && percentualClick < prev.end) return prev;

    // Check if values have been reversed
    const leftValue = prev.end > prev.start ? prev.start : prev.end;
    const rightValue = prev.end > prev.start ? prev.end : prev.start;

    // To get correct values; User clicks on 50%. The prev.start and prev.end were 60 and 70, respectively.
    // This means that the difference is 10, so if user clicks on 50%, meaning start now must be 45, and end must be 55.
    const difference = rightValue - leftValue;
    let newMin = percentualClick - difference / 2,
      newMax = percentualClick + difference / 2;

    // Caps values at max graph and adds removes the difference so that moveable graph keeps its side.
    if (newMax > max) {
      const exceededAmount = newMax - max;
      newMax = max;
      newMin = newMin - exceededAmount;
    }

    // Same as previous comment.
    if (newMin < min) {
      const exceededAmount = newMin;
      newMin = min;
      newMax = newMax - exceededAmount;
    }

    return { start: newMin, end: newMax };
  });
};

export default moveGraph;
