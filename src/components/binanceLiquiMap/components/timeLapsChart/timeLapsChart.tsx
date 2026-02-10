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
    <>
      <Chart
        data={slicedData}
        x={x}
        y={y}
        margins={margins}
        innerHeight={innerHeight}
      />
    </>
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

  useEffect(() => {
    trackDrag(setGraphMargins);
  }, []);

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

  // FIX BUG:
  // DATES ARE REVERSED: RIGHT CONTROLLER SHOWS END DATE
  const firstObjectDate = data[Math.round(graphMargins.start)].date;
  const lastObjectDate = data[Math.round(graphMargins.end)].date;

  console.log(graphMargins);

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
            {dateFormat(firstObjectDate)}
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
            {dateFormat(lastObjectDate)}
          </p>
        </div>
      </div>
      <Axis data={data} margins={margins} width={width} height={height}>
        <rect
          onMouseDown={() => trackDrag(setGraphMargins)}
          ref={rectRef}
          style={{ zIndex: 10 }}
          x="0"
          width="100%"
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
