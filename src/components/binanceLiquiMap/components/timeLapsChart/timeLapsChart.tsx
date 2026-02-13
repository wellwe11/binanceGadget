import React, {
  Activity,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import * as d3 from "d3";

import Chart from "./components/chart";
import Axis from "./components/axis";
import InputRange from "./components/inputRange";
import trackDrag from "./functions/trackDrag";
import moveGraph from "./functions/moveGraph";
import useSetHighSetLow from "./hooks/useSetHighSetLow";

export type Data = {
  coin: string;
  date: Date;
  value: number;
  openInterest: number;
};

type GraphMargins = {
  start: number;
  end: number;
};

type SVGRectClickEvent = React.MouseEvent<SVGRectElement>;
export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;

export type SetGraphMargins = React.Dispatch<
  React.SetStateAction<GraphMargins>
>;

type SetBoolean = React.Dispatch<React.SetStateAction<boolean>>;

interface MainProps {
  data: Data[];
}

const MoveableGraph = ({
  data,
  x,
  y,
  height,
  width,
  sliceStart, // graphWidthStart
  sliceEnd, // graphWidthEnd
}: {
  data: Data[];
  x: d3.scaleTime<number, number>;
  y: d3.scaleLinear<number, number>;
  height: number;
  width: number;
  sliceStart: number;
  sliceEnd: number;
}) => {
  const [lowestVal, highestVal] = useSetHighSetLow(sliceStart, sliceEnd);

  const min = data.length - highestVal - 1;
  const max = data.length - lowestVal + 1;

  // Data that will adjust the width of top-chart
  const slicedData = useMemo(
    () => data.slice(min, max),
    [min, max, width, height],
  );

  return <Chart data={slicedData} x={x} y={y} height={height} width={width} />;
};
// This element covers the graphs, and calculates where and what the user is clicking on graph. It updates the moveable graphs location depending on where user clicks.
const MoveableGraphContainerRect = ({
  data,
  graphMargins,
  setGraphMargins,
  width,
  height,
  setHover,
}: {
  data: Data[];
  graphMargins: GraphMargins;
  setGraphMargins: SetGraphMargins;
  width: number;
  height: number;
  setHover: SetBoolean;
}) => {
  const max = data.length - 1;
  const calcWhereUserClicked = (e: SVGRectClickEvent) =>
    Math.round((data.length / width) * e.clientX) - 7.5;

  const start = graphMargins.start,
    end = graphMargins.end;
  const [lowestVal, highestVal] = useSetHighSetLow(start, end);

  const handleHoverTrue = () => setHover(true);
  const handleHoverFalse = () => setHover(false);

  // User clicks somewhere on the fixed sized graph, and it moved the smaller, moveable rect (which is where the moveable graph also goes)
  const handleClickGraph = (e: SVGRectClickEvent) => {
    const clickedVal = calcWhereUserClicked(e);
    moveGraph(max, 0, clickedVal, setGraphMargins);
  };

  // User drags the current moveable graph, which also moves the smaller moveable rect as well
  const handleMoveGraph = (e: SVGRectClickEvent) => {
    const clickedVal = calcWhereUserClicked(e);
    if (clickedVal > lowestVal && clickedVal < highestVal) {
      trackDrag(setGraphMargins, max, 1);
    }
  };

  const x = (lowestVal / (data.length - 1)) * width;
  const adaptedWidth = (width / (data.length - 1)) * (highestVal - lowestVal);

  return (
    <>
      <rect
        onClick={handleClickGraph}
        style={{ cursor: "pointer" }}
        x="0"
        width="100%"
        height={height}
        fill="transparent"
      />

      <rect
        onMouseEnter={handleHoverTrue}
        onMouseLeave={handleHoverFalse}
        onMouseDown={handleMoveGraph}
        width={`${adaptedWidth}px`}
        height={height}
        x={x}
        fill="transparent"
        style={{ cursor: "ew-resize" }}
      />
    </>
  );
};

// Component with axis x/y as well as the two viewed d3.js graphs.
const Charts = ({
  data,
  graphMargins,
  setGraphMargins,
  setDisplayText,
  height,
  width,
}: {
  data: Data[];
  graphMargins: GraphMargins;
  setGraphMargins: SetGraphMargins;
  setDisplayText: SetBoolean;
  height: number;
  width: number;
}) => {
  const x = useMemo(
    () =>
      d3
        .scaleTime()
        .range([0, width])
        .domain(d3.extent(data, (d: Data) => new Date(d.date))),
    [data, width, height],
  );

  const y = useMemo(
    () =>
      d3
        .scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data, (d: Data) => d.value)]),
    [data, height, width],
  );

  return (
    <Axis width={width}>
      <MoveableGraphContainerRect
        data={data}
        graphMargins={graphMargins}
        setGraphMargins={setGraphMargins}
        setHover={setDisplayText}
        width={width}
        height={height}
      />

      <MoveableGraph
        data={data}
        x={x}
        y={y}
        height={height}
        width={width}
        sliceStart={graphMargins.start}
        sliceEnd={graphMargins.end}
      />
      <Chart data={data} x={x} y={y} height={height} width={width} />
    </Axis>
  );
};

// Controlller wrapper - Left and right mouse-controllers which increases/decreases or moves the moveable chart.
const Controllers = ({
  data,
  graphMargins,
  setGraphMargins,
  displayText,
  setDisplayText,
}: {
  data: Data[];
  graphMargins: GraphMargins;
  setGraphMargins: SetGraphMargins;
  displayText: boolean;
  setDisplayText: SetBoolean;
}) => {
  // Used for texts that follow left and right handlers, that resize one of the graphs. Displays left and right active date.
  const dateFormat = d3.timeFormat("%-d %b %Y, %H:%M");

  const handleGraphStart = (e: InputChangeEvent) => {
    const value = +e.target.value;
    setGraphMargins((prev) => ({ ...prev, start: value }));
  };

  const handleGraphEnd = (e: InputChangeEvent) => {
    const value = +e.target.value;
    setGraphMargins((prev) => ({ ...prev, end: value }));
  };

  const start = graphMargins.start;
  const end = graphMargins.end;

  const [lowestVal, highestVal] = useSetHighSetLow(start, end);

  // This is the actual text that is shown on left and right handler (The ones that control the size of the movable graph).
  const firstObjectDate = data[data.length - 1 - Math.round(lowestVal)]?.date;
  const lastObjectDate = data[data.length - 1 - Math.round(highestVal)]?.date;

  // <p> for left and right handle style.
  const textStyle =
    "absolute left-0 top-[-16%] pointer-events-none whitespace-nowrap select-none text-white";

  // Checks if text should be on the right side or left side of the handlers

  const maxRange = data.length;

  return (
    <div
      className="z-20 cursor-copy pointer-events-none"
      style={{
        transform: `translate(0, 30px)`,
      }}
      onMouseEnter={() => setDisplayText(true)}
    >
      <>
        <InputRange
          val={graphMargins.start}
          setter={handleGraphStart}
          max={maxRange}
          min={0}
        />
        <Activity mode={displayText ? "visible" : "hidden"}>
          <p
            className={textStyle}
            style={{
              left: `calc(${(lowestVal / (data.length - 1)) * 100}% - 5px)`,
              transform: `translateX(-110%)`,
            }}
          >
            {dateFormat(firstObjectDate)}
          </p>
        </Activity>
      </>

      <div>
        <InputRange
          val={graphMargins.end}
          setter={handleGraphEnd}
          max={maxRange - 1}
          min={1}
        />

        <Activity mode={displayText ? "visible" : "hidden"}>
          <p
            className={textStyle}
            style={{
              left: `calc(${(highestVal / (data.length - 1)) * 100}% + 5px)`,
              transform: `translateX(10%)`,
            }}
          >
            {dateFormat(lastObjectDate)}
          </p>
        </Activity>
      </div>
    </div>
  );
};

// Parent wrapper.
const TimeLapsChart = ({ data }: MainProps) => {
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [containersHeight, setContainersHeight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Shows/hides text when user hovers the component.
  const [displayText, setDisplayText] = useState<boolean>(false);

  // Adjusts smaller graphs size
  const [graphMargins, setGraphMargins] = useState<GraphMargins>({
    start: 1,
    end: data.length - 1,
  });

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const containersSize = containerRef.current.getBoundingClientRect();
    const width = containersSize.width as number,
      height = containersSize.height as number;

    if (width !== containerWidth) {
      setContainerWidth(width);
    }

    if (height !== containersHeight) {
      setContainersHeight(height);
    }
  }, [containerRef, data]);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden"
      style={{ width: "inherit", height: "inherit" }}
    >
      <Controllers
        data={data}
        graphMargins={graphMargins}
        setGraphMargins={setGraphMargins}
        displayText={displayText}
        setDisplayText={setDisplayText}
      />

      <Charts
        data={data}
        graphMargins={graphMargins}
        setGraphMargins={setGraphMargins}
        setDisplayText={setDisplayText}
        height={containersHeight}
        width={containerWidth}
      />
    </div>
  );
};

export default TimeLapsChart;
