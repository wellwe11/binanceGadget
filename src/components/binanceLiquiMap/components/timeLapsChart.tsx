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

const useChart = (gRef, data, innerHeight, x, y, margins) => {
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
  }, [data, gRef, margins]);
};

const TimeLapsChart = ({ data }) => {
  const svgRef = useRef(null);
  const gRefStale = useRef(null);
  const gRefMoveable = useRef(null);

  const margins = { top: 70, right: 60, bottom: 50, left: 80 };
  const height = 250;
  const width = 1100;
  const innerWidth = width - margins.left - margins.right;
  const innerHeight = height - margins.top - margins.bottom;

  const x = d3
    .scaleTime()
    .range([0, innerWidth])
    .domain(d3.extent(data, (d) => new Date(d.date)));

  const y = d3
    .scaleLinear()
    .range([innerHeight, 0])
    .domain([0, d3.max(data, (d) => d.value)]);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svgRefElement = d3.select(svgRef.current);
    svgRefElement.selectAll(".axis").remove();

    svgRefElement
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${innerHeight})`);

    svgRefElement
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${innerWidth},0)`);
  }, [data, svgRef, margins, gRefStale, gRefMoveable]);

  useChart(gRefStale, data, innerHeight, x, y, margins);

  // Data that will adjust the width of top-chart
  const sliceMin = data.length - 16,
    sliceMax = 16;

  const slicedData = data.slice(sliceMax, sliceMin);

  useChart(gRefMoveable, slicedData, innerHeight, x, y, margins);

  return (
    <>
      <svg
        id="svgRef"
        ref={svgRef}
        style={{
          width,
          height,
          transform: `translate(${margins.left}, ${margins.top})`,
        }}
      >
        <g
          ref={gRefStale}
          style={{ transform: `translate(${(margins.left, margins.top)})` }}
        />
        <g
          ref={gRefMoveable}
          style={{ transform: `translate(${(margins.left, margins.top)})` }}
        />
      </svg>
    </>
  );
};

export default TimeLapsChart;
