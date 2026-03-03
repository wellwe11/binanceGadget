import * as d3 from "d3";

const colorScale = (max: number, colorTheme) => {
  return d3
    .scaleSequential(d3[colorTheme || "interpolateViridis"])
    .domain([0, max]);
};

export default colorScale;
