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
// This element covers the graphs, and calculates where and what the user is clicking on graph. It updates the moveable graphs location depending on where user clicks.
const MoveableGraphContainerRect = ({
  data,
  graphMargins,
  setGraphMargins,
  innerWidth,
  innerHeight,
  setHover,
}) => {
  const max = data.length - 1;
  const calcWhereUserClicked = (e) =>
    Math.round((data.length / innerWidth) * e.clientX) - 7.5;

  const x = (graphMargins.start / (data.length - 1)) * innerWidth;

  return (
    <>
      <rect
        onMouseDown={(e) => {
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
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
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
        x={x}
      />
    </>
  );
};

// Component with axis x/y as well as the two viewed d3.js graphs.
const Charts = ({
  data,
  margins,
  width,
  height,
  graphMargins,
  setGraphMargins,
  setDisplayText,
  innerWidth,
  innerHeight,
}) => {
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
    <Axis data={data} margins={margins} width={width} height={height}>
      <MoveableGraphContainerRect
        data={data}
        graphMargins={graphMargins}
        setGraphMargins={setGraphMargins}
        innerWidth={innerWidth}
        innerHeight={innerHeight}
        setHover={setDisplayText}
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
  );
};

// Controlller wrapper - Left and right mouse-controllers which increases/decreases or moves the moveable chart.
const Controllers = ({
  data,
  margins,
  graphMargins,
  setGraphMargins,
  displayText,
  setDisplayText,
  innerWidth,
}) => {
  // Used for texts that follow left and right handlers, that resize one of the graphs. Displays left and right active date.
  const dateFormat = d3.timeFormat("%-d %b %Y, %H:%M");

  const handleGraphStart = (e) => {
    const value = +e.target.value;
    setGraphMargins((prev) => ({ ...prev, start: value }));
  };

  const handleGraphEnd = (e) => {
    const value = +e.target.value;
    setGraphMargins((prev) => ({ ...prev, end: value }));
  };

  // This is the actual text that is shown on left and right handler (The ones that control the size of the movable graph).
  const firstObjectDate =
    data[data.length - 1 - Math.round(graphMargins.start)]?.date;
  const lastObjectDate =
    data[data.length - 1 - Math.round(graphMargins.end)]?.date;

  // <p> for left and right handle style.
  const textStyle =
    "absolute left-0 top-[-16%] pointer-events-none whitespace-nowrap select-none text-white";

  // Checks if text should be on the right side or left side of the handlers
  const isHandleOnOppositeSide = graphMargins.end < graphMargins.start;

  const maxRange = data.length;

  return (
    <div
      className="z-20 h-10 cursor-copy pointer-events-none "
      style={{
        transform: `translate(0, ${margins.top + 10}px)`,
        width: innerWidth,
      }}
      onMouseEnter={() => setDisplayText(true)}
    >
      <>
        <InputRange
          val={graphMargins.start}
          setter={handleGraphStart}
          max={maxRange}
        />
        <Activity mode={displayText ? "visible" : "hidden"}>
          <p
            className={textStyle}
            style={{
              left: `calc(${(graphMargins.start / (data.length - 1)) * 100}% - 5px)`,
              transform: `translateX(${isHandleOnOppositeSide ? "5" : "-110"}%)`,
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
          max={maxRange}
        />

        <Activity mode={displayText ? "visible" : "hidden"}>
          <p
            className={textStyle}
            style={{
              left: `calc(${(graphMargins.end / (data.length - 1)) * 100}% + 5px)`,
              transform: `translateX(${isHandleOnOppositeSide ? "-110" : "5"}%)`,
            }}
          >
            {dateFormat(lastObjectDate)}
          </p>
        </Activity>
      </>
    </div>
  );
};

// Parent wrapper.
const TimeLapsChart = ({ data }) => {
  // Charts fixed size. Will make more dynamic in future.
  // They are passed to children all over the place, so they need to be in this component. Ideally, when component
  // works more dynamically, they will be removed.
  const margins = { top: 70, right: 60, bottom: 50, left: 80 };
  const height = 200;
  const width = 800;
  const innerWidth = width - margins.left - margins.right;
  const innerHeight = height - margins.top - margins.bottom;

  // Shows/hides text when user hovers the component.
  const [displayText, setDisplayText] = useState(false);

  // Adjusts smaller graphs size
  const [graphMargins, setGraphMargins] = useState({
    start: 1,
    end: data.length - 1,
  });

  return (
    <div className="ml-5 overflow-hidden">
      <Controllers
        data={data}
        margins={margins}
        graphMargins={graphMargins}
        setGraphMargins={setGraphMargins}
        displayText={displayText}
        setDisplayText={setDisplayText}
        innerWidth={innerWidth}
      />

      <Charts
        data={data}
        margins={margins}
        width={width}
        height={height}
        graphMargins={graphMargins}
        setGraphMargins={setGraphMargins}
        setDisplayText={setDisplayText}
        innerWidth={innerWidth}
        innerHeight={innerHeight}
      />
    </div>
  );
};

export default TimeLapsChart;
