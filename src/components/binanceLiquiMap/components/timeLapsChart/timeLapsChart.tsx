import * as d3 from "d3";
import { Activity, useEffect, useMemo, useRef, useState } from "react";

import Chart from "./components/chart";
import Axis from "./components/axis";
import InputRange from "./components/inputRange";
import trackDrag from "./functions/trackDrag";
import moveGraph from "./functions/moveGraph";

const MoveableGraph = ({
  data,
  x,
  y,
  margins,
  innerHeight,
  sliceStart, // graphWidthStart
  sliceEnd, // graphWidthEnd
}) => {
  const start = sliceStart > sliceEnd ? sliceEnd : sliceStart;
  const end = sliceEnd > sliceStart ? sliceEnd : sliceStart;
  const min = data.length - end - 1;
  const max = data.length - start + 1;

  // Data that will adjust the width of top-chart
  const slicedData = useMemo(() => data.slice(min, max), [min, max]);

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
// This element covers the graphs, and calculates where and what the user is clicking on graph. It then calculates, and controls measures, which moves
// the moveable graph
const MoveableGraphContainerRect = ({
  data,
  graphMargins,
  setGraphMargins,
  innerWidth,
  innerHeight,
}) => {
  const max = data.length - 1;
  const calcWhereUserClicked = (e) =>
    Math.round((data.length / innerWidth) * e.clientX) - 7.5;

  return (
    <>
      <rect
        onMouseDown={(e) => {
          console.log("asasdasdd");
          const clickedVal = calcWhereUserClicked(e);

          moveGraph(max, 0, clickedVal, setGraphMargins);
        }}
        style={{ cursor: "pointer" }}
        x="0"
        width={innerWidth}
        height={innerHeight}
        fill="transparent"
      />

      <rect
        width={`${graphMargins.end - graphMargins.start - 1}%`}
        height={innerHeight}
        fill="transparent"
        style={{ cursor: "ew-resize" }}
        onMouseDown={(e) => {
          const clickedVal = calcWhereUserClicked(e);
          if (
            clickedVal > graphMargins.start &&
            clickedVal < graphMargins.end
          ) {
            trackDrag(setGraphMargins, max, 1);
          }
        }}
        x={(graphMargins.start / (data.length - 1)) * innerWidth}
      />
    </>
  );
};

const TimeLapsChart = ({ data }) => {
  const margins = { top: 70, right: 60, bottom: 50, left: 80 };
  const height = 200;
  const width = 800;
  const innerWidth = width - margins.left - margins.right;
  const innerHeight = height - margins.top - margins.bottom;
  const dateFormat = d3.timeFormat("%-d %b %Y, %H:%M");
  const [displayText, setDisplayText] = useState(false);

  const [graphMargins, setGraphMargins] = useState({
    start: 1,
    end: data.length - 1,
  });

  const handleGraphStart = (e) => {
    const value = +e.target.value;
    setGraphMargins((prev) => ({ ...prev, start: value }));
  };

  const handleGraphEnd = (e) => {
    const value = +e.target.value;
    setGraphMargins((prev) => ({ ...prev, end: value }));
  };

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

  const firstObjectDate =
    data[data.length - 1 - Math.round(graphMargins.start)]?.date;
  const lastObjectDate =
    data[data.length - 1 - Math.round(graphMargins.end)]?.date;

  return (
    <div
      className="ml-5 overflow-hidden"
      onMouseEnter={() => setDisplayText(true)}
      onMouseLeave={() => setDisplayText(false)}
    >
      <div
        className="z-20 h-10 cursor-copy pointer-events-none "
        style={{
          transform: `translate(0, ${margins.top + 10}px)`,
          width: innerWidth,
        }}
        onMouseEnter={() => console.log("asd")}
      >
        <>
          <InputRange
            val={graphMargins.start}
            setter={handleGraphStart}
            max={data.length}
          />
          <Activity mode={displayText ? "visible" : "hidden"}>
            <p
              className="absolute left-0 top-[-16%] pointer-events-none whitespace-nowrap select-none text-white"
              style={{
                left: `calc(${(graphMargins.start / (data.length - 1)) * 100}% - 5px)`,
                transform: `translateX(${graphMargins.end < graphMargins.start ? "5" : "-110"}%)`,
              }}
            >
              {dateFormat(firstObjectDate)}
            </p>
          </Activity>
        </>

        <>
          <InputRange
            val={graphMargins.end}
            setter={handleGraphEnd}
            max={data.length}
          />

          <Activity mode={displayText ? "visible" : "hidden"}>
            <p
              className="absolute left-0 top-[-16%] pointer-events-none whitespace-nowrap select-none text-white"
              style={{
                left: `calc(${(graphMargins.end / (data.length - 1)) * 100}% + 5px)`,
                transform: `translateX(${graphMargins.end < graphMargins.start ? "-110" : "5"}%)`,
              }}
            >
              {dateFormat(lastObjectDate)}
            </p>
          </Activity>
        </>
      </div>

      <Axis data={data} margins={margins} width={width} height={height}>
        <MoveableGraphContainerRect
          data={data}
          graphMargins={graphMargins}
          setGraphMargins={setGraphMargins}
          innerWidth={innerWidth}
          innerHeight={innerHeight}
        />

        <MoveableGraph
          data={data}
          x={x}
          y={y}
          margins={margins}
          innerHeight={innerHeight}
          sliceStart={graphMargins.start}
          sliceEnd={graphMargins.end}
        />
        <Chart
          data={data}
          x={x}
          y={y}
          margins={margins}
          innerHeight={innerHeight}
        />
      </Axis>
    </div>
  );
};

export default TimeLapsChart;
