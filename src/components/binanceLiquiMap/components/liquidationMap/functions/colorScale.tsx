import * as d3 from "d3";

const colorScale = (max: number) => {
  const low = max * 0.2;
  const normal = max * 0.4;
  const high = max * 0.7;

  return d3
    .scaleLinear()
    .domain([low, normal, high, max])
    .range(["#5600bf", "#00bcc6", "#00960a", "#b7b700"]);
};

export default colorScale;
