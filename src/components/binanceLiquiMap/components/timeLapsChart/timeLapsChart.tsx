import * as d3 from "d3";
import { useRef } from "react";
import useChart from "./hooks/useChart";
import useAxis from "./hooks/useAxis";

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

  // Create group-axis
  useAxis(svgRef, data, margins, [gRefStale, gRefMoveable]);

  // Create base-graph (Is visible as background)
  useChart(gRefStale, data, innerHeight, x, y, margins);

  // Data that will adjust the width of top-chart
  const sliceMin = data.length - 16,
    sliceMax = 16;
  const slicedData = data.slice(sliceMax, sliceMin);
  // Create moveable graph
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
          transform={`translate(${(margins.left, margins.top)})`}
        >
          {/* Create a slider like my previous gradient-slider, which can increase or decrease sliceMin/sliceMax */}
        </g>
        <g
          ref={gRefMoveable}
          transform={`translate(${(margins.left, margins.top)})`}
        />
      </svg>
    </>
  );
};

export default TimeLapsChart;
