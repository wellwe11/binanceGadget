import * as d3 from "d3";
import { useEffect, useRef } from "react";

/**
     A simpler graph below the chart
     Simply displays price-point
     Is also dragable - end of highlighted area shows date & time-stamp
     */
/**
 * Zooming HeatMap also highlights the min/max time currently showed on Heatmap
 */

const TimeLapsChart = ({ data }) => {
  const svgRef = useRef(null);

  const margins = { top: 70, right: 60, bottom: 50, left: 80 };
  const height = 500;
  const width = 1100;
  const innerWidth = width - margins.left - margins.right;
  const innerHeight = height - margins.top - margins.bottom;

  const dateParser = d3.timeParse("%Y %m %d");

  useEffect(() => {
    if (!svgRef.current || !data) return;
    const svgElement = d3.select(svgRef.current);
    svgElement.selectAll("*").remove();

    const x = d3
      .scaleTime()
      .range([0, innerWidth])
      .domain(d3.extent(data, (d) => new Date(d.date)));

    const y = d3
      .scaleLinear()
      .range([innerHeight, 0])
      .domain([0, d3.max(data, (d) => d.value)]);

    const g = svgElement
      .append("g")
      .attr("transform", `translate(${margins.left},${margins.top})`);

    console.log(data);

    g.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(x));

    g.append("g")
      .attr("transform", `translate(${innerWidth},0)`)
      .call(
        d3.axisRight(y).tickFormat((d) => (isNaN(d) ? "" : `${d.toFixed(2)}`)),
      );

    const line = d3
      .line()
      .x((d) => x(new Date(d.date)))
      .y((d) => y(d.value));

    const area = d3
      .area()
      .x((d) => x(new Date(d.date)))
      .y0(innerHeight)
      .y1((d) => y(d.value));

    g.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area)
      .style("fill", "#002570")
      .style("opacity", 0.5);

    g.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "#002570")
      .attr("stroke-width", 1)
      .attr("d", line);

    const dragAreaStart = data.slice(50);

    console.log(dragAreaStart);

    g.append("path")
      .datum(dragAreaStart)
      .attr("class", "area")
      .attr("d", area)
      .style("fill", "#003eb9")
      .style("opacity", 0.5);

    g.append("path")
      .datum(dragAreaStart)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "#003eb9")
      .attr("stroke-width", 1)
      .attr("d", line);
  }, [data]);

  return <svg id="svgRef" ref={svgRef} style={{ width, height }} />;
};

export default TimeLapsChart;
