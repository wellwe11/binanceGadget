import * as d3 from "d3";

const colorScale = (max: number, colorTheme, threshhold) => {
  const interpolator = d3[colorTheme || "interpolateViridis"];

  let maxNum = max;

  if (threshhold) {
    maxNum = (max / 100) * threshhold;
  }

  return d3
    .scaleLinear()
    .domain([0, maxNum * 0.4, maxNum * 0.6, maxNum])
    .range([
      interpolator(0),
      interpolator(0.33),
      interpolator(0.66),
      interpolator(1),
    ]);
};

export default colorScale;
