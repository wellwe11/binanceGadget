import * as d3 from "d3";
import { useMemo, useState } from "react";

import Chart from "./components/chart";
import Axis from "./components/axis";
import InputRange from "./components/inputRange";

/**
     A simpler graph below the chart
     Simply displays price-point
     Is also dragable - end of highlighted area shows date & time-stamp
     */
/**
 * Zooming HeatMap also highlights the min/max time currently showed on Heatmap
 */

const MoveableGraph = ({
  data,
  x,
  y,
  margins,
  innerHeight,
  sliceStart,
  sliceEnd,
}) => {
  const start = sliceStart < sliceEnd ? sliceStart : sliceEnd;
  const end = sliceEnd > sliceStart ? sliceEnd : sliceStart;
  const min = data.length - end - 1;
  const max = data.length - start + 1;

  // Data that will adjust the width of top-chart
  const slicedData = data.slice(min, max);

  return (
    <Chart
      data={slicedData}
      x={x}
      y={y}
      margins={margins}
      innerHeight={innerHeight}
    />
  );
};

const TimeLapsChart = ({ data }) => {
  const margins = { top: 70, right: 60, bottom: 50, left: 80 };
  const height = 200;
  const width = 800;
  const innerWidth = width - margins.left - margins.right;
  const innerHeight = height - margins.top - margins.bottom;

  const [graphWidthStart, setGraphWidthStart] = useState(-1);
  const [graphWidthEnd, setGraphWidthEnd] = useState(data.length - 1);

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

  return (
    <>
      <div
        className="z-20 h-10"
        style={{
          transform: `translate(0, ${margins.top + 10}px)`,
          width: innerWidth,
        }}
      >
        <div>
          <InputRange
            val={graphWidthStart}
            setter={setGraphWidthStart}
            max={data.length}
          />
        </div>
        <div>
          <InputRange
            val={graphWidthEnd}
            setter={setGraphWidthEnd}
            max={data.length}
          />
        </div>
      </div>
      <Axis data={data} margins={margins} width={width} height={height}>
        <MoveableGraph
          data={data}
          x={x}
          y={y}
          margins={margins}
          innerHeight={innerHeight}
          sliceStart={graphWidthStart}
          sliceEnd={graphWidthEnd}
        />
        <Chart
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
