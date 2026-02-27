import * as d3 from "d3";

const scaleColors = (max) =>
  d3
    .scaleLinear()
    .domain([0, max * 0.1, max * 0.2, max * 0.6, max])
    .range(["rgba(0,0,0,0)", "#00bcc695", "#00bcc699", "#ffff00", "#ffff00"]);

export default scaleColors;
