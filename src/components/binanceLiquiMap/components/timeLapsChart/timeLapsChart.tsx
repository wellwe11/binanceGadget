import * as d3 from "d3";
import { useEffect, useMemo, useRef, useState } from "react";

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

const trackDrag = (setter) => {
  let animationFrameId = null;
  let accumulatedDelta = 0;

  const handleMove = (moveEvent) => {
    accumulatedDelta += moveEvent.movementX * 0.135; // Adjust for increased/decreased acceleration of mouse-speed
    if (animationFrameId) return;

    animationFrameId = requestAnimationFrame(() => {
      const delta = accumulatedDelta;
      accumulatedDelta = 0;

      setter((prev) => {
        let newStart = prev.start + delta;
        let newEnd = prev.end + delta;

        // To avoid if width is full
        if (prev.start === 0 && prev.end === 89) return prev;

        if (newStart < 1) {
          newStart = 1;
          newEnd = prev.end;
        }

        if (newEnd > 89) {
          newEnd = 89;
          newStart = prev.start;
        }

        if (newStart > 89) {
          newStart = 89;
          newEnd = prev.end;
        }

        if (newEnd < 1) {
          newEnd = 1;
          newStart = prev.start;
        }

        return { start: newStart, end: newEnd };
      });

      animationFrameId = null;
    });
  };

  const handleUp = () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    window.removeEventListener("mousemove", handleMove);
    window.removeEventListener("mouseup", handleUp);
  };

  window.addEventListener("mousemove", handleMove);
  window.addEventListener("mouseup", handleUp);
};

const moveGraph = ({ max, percentualClick, setter }) => {
  setter((prev) => {
    // Return if user is clicking on the graph itself (Allows for more comfortable control)
    if (percentualClick > prev.start && percentualClick < prev.end) return prev;

    // Check if values have been reversed
    const leftValue = prev.end > prev.start ? prev.start : prev.end;
    const rightValue = prev.end > prev.start ? prev.end : prev.start;

    // To get correct values; User clicks on 50%. The prev.start and prev.end were 60 and 70, respectively.
    // This means that the difference is 10, so if user clicks on 50%, meaning start now must be 45, and end must be 55.
    const difference = rightValue - leftValue;
    let newMin = percentualClick - difference / 2,
      newMax = percentualClick + difference / 2;

    // Caps values at max graph and adds removes the difference so that moveable graph keeps its side.
    if (newMax > max) {
      const exceededAmount = newMax - max;
      newMax = max;
      newMin = newMin - exceededAmount;
    }

    // Same as previous comment.
    if (newMin < 1) {
      const exceededAmount = newMin;
      newMin = 1;
      newMax = newMax - exceededAmount;
    }

    console.log(newMin, newMax);

    return { start: newMin, end: newMax };
  });
};

const MoveableGraph = ({
  data,
  x,
  y,
  margins,
  innerHeight,
  sliceStart, // graphWidthStart
  sliceEnd, // graphWidthEnd
}) => {
  const start = sliceStart < sliceEnd ? sliceStart : sliceEnd;
  const end = sliceEnd > sliceStart ? sliceEnd : sliceStart;

  const [values, setValues] = useState({
    min: data.length - end - 1,
    max: data.length - start + 1,
  });

  // Data that will adjust the width of top-chart
  const slicedData = data.slice(values.min, values.max);

  useEffect(() => {
    setValues({
      min: data.length - end - 1,
      max: data.length - start + 1,
    });
  }, [start, end]);

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
  const rectRef = useRef(null);
  const margins = { top: 70, right: 60, bottom: 50, left: 80 };
  const height = 200;
  const width = 800;
  const innerWidth = width - margins.left - margins.right;
  const innerHeight = height - margins.top - margins.bottom;
  const dateFormat = d3.timeFormat("%-d %b %Y, %H:%M");

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

  // const firstObjectDate = data[Math.round(graphMargins.start)].date;
  // const lastObjectDate = data[Math.round(graphMargins.end)].date;
  const firstObjectDate = "";
  const lastObjectDate = "";

  return (
    <div className="ml-5">
      <div
        className="z-20 h-10 pointer-events-none"
        style={{
          transform: `translate(0, ${margins.top + 10}px)`,
          width: innerWidth,
        }}
      >
        <div>
          <InputRange
            val={graphMargins.start}
            setter={handleGraphStart}
            max={data.length}
          />
        </div>
        <div>
          <p
            className="absolute left-0 top-[10%] pointer-events-none whitespace-nowrap select-none"
            style={{
              left: `${(graphMargins.start / (data.length - 1)) * 100}%`,
              transform: `translateX(${graphMargins.end > graphMargins.start ? "-110" : "5"}%)`,
            }}
          >
            {dateFormat(lastObjectDate)}
          </p>
          <InputRange
            val={graphMargins.end}
            setter={handleGraphEnd}
            max={data.length}
          />
          <p
            className="absolute left-0 top-0 pointer-events-none whitespace-nowrap select-none"
            style={{
              left: `${(graphMargins.end / (data.length - 1)) * 100}%`,
              transform: `translateX(${graphMargins.end > graphMargins.start ? "5" : "-110"}%)`,
            }}
          >
            {dateFormat(firstObjectDate)}
          </p>
        </div>
      </div>
      <Axis data={data} margins={margins} width={width} height={height}>
        <rect
          onMouseDown={(e) => {
            const moveGraphArgs = {
              percentualClick:
                Math.round((data.length / innerWidth) * e.clientX) - 7.5, // Adjust to control chart relevant to cursor
              max: data.length - 1,
              setter: setGraphMargins,
            };
            moveGraph(moveGraphArgs);
            trackDrag(setGraphMargins);
          }}
          ref={rectRef}
          style={{ cursor: "grabbing" }}
          x="0"
          width={innerWidth}
          height={innerHeight}
          fill="transparent"
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
