import { useEffect, useRef } from "react";

import * as d3 from "d3";

import { Data } from "../timeLapsChart";

interface ChartInterface {
  data: Data[];
  height: number;
  width: number;
  x: d3.scaleTime<number, number>;
  y: d3.scaleLinear<number, number>;
}

const Chart = ({ data, height, width, x, y }: ChartInterface) => {
  const gRef = useRef(null);

  useEffect(() => {
    if (!gRef.current || !data) return;
    const g = d3.select(gRef.current);

    g.selectAll("*").remove();

    const line = d3
      .line()
      .x((d: Data) => x(new Date(d.date)))
      .y((d: Data) => y(d.value));

    const area = d3
      .area()
      .x((d: Data) => x(new Date(d.date)))
      .y0(height)
      .y1((d: Data) => y(d.value));

    // Line
    g.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "#093870")
      .attr("stroke-width", 1)
      .attr("d", line);

    // Area
    g.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area)
      .style("fill", "#013270")
      .style("opacity", 0.5);
  }, [data, gRef, height, width, x, y]);

  return <g className="pointer-events-none" ref={gRef} />;
};

export default Chart;
