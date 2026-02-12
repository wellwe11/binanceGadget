import { useEffect, useRef } from "react";

import * as d3 from "d3";

const Chart = ({ data, height, x, y, margins }) => {
  const gRef = useRef(null);

  useEffect(() => {
    if (!gRef.current || !data) return;
    const g = d3.select(gRef.current);

    g.selectAll("*").remove();

    const line = d3
      .line()
      .x((d) => x(new Date(d.date)))
      .y((d) => y(d.value));

    const area = d3
      .area()
      .x((d) => x(new Date(d.date)))
      .y0(height)
      .y1((d) => y(d.value));

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
  }, [data, gRef, margins]);

  return <g className="pointer-events-none" ref={gRef} />;
};

export default Chart;
