import * as d3 from "d3";
import { useRef, useMemo } from "react";

import Chart from "./components/chart";
import Axis from "./components/axis";

/**
     A simpler graph below the chart
     Simply displays price-point
     Is also dragable - end of highlighted area shows date & time-stamp
     */
/**
 * Zooming HeatMap also highlights the min/max time currently showed on Heatmap
 */

const MoveableGraph = ({ data, x, y, margins, innerHeight }) => {
  // Data that will adjust the width of top-chart
  const sliceMin = data.length - 17,
    sliceMax = 25;
  const slicedData = data.slice(sliceMax, sliceMin);
  // Create moveable graph

  return (
    <Chart
      data={slicedData}
      x={x}
      y={y}
      margins={margins}
      innerHeight={innerHeight}
    >
      {/* Create a slider like my previous gradient-slider, which can increase or decrease sliceMin/sliceMax */}
    </Chart>
  );
};

const TimeLapsChart = ({ data }) => {
  const margins = { top: 70, right: 60, bottom: 50, left: 80 };
  const height = 200;
  const width = 800;
  const innerWidth = width - margins.left - margins.right;
  const innerHeight = height - margins.top - margins.bottom;

  const x = useMemo(
    () =>
      d3
        .scaleTime()
        .range([0, innerWidth])
        .domain(d3.extent(data, (d) => new Date(d.date))),
    [data, innerWidth],
  );

  const y = useMemo(
    () =>
      d3
        .scaleLinear()
        .range([innerHeight, 0])
        .domain([0, d3.max(data, (d) => d.value)]),
    [data, innerHeight],
  );

  // Create group-axis

  return (
    <>
      <Axis data={data} margins={margins} width={width} height={height}>
        <Chart
          data={data}
          x={x}
          y={y}
          margins={margins}
          innerHeight={innerHeight}
        />

        <MoveableGraph
          data={data}
          x={x}
          y={y}
          margins={margins}
          innerHeight={innerHeight}
        />
      </Axis>
    </>
  );
};

export default TimeLapsChart;
