import * as d3 from "d3";

const colorScale = (max: number) => {
  return d3.scaleSequential(d3.interpolateViridis).domain([0, max]);
};

export default colorScale;
