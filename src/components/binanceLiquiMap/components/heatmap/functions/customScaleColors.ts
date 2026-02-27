import * as d3 from "d3";

const scaleColors = (max) =>
  d3
    .scaleLinear()
    .domain([0, max * 0.1, max * 0.6, max])
    .range(["#800080", "#00ced1", "#81ff7f", "#d9ff00"]);

export default scaleColors;
