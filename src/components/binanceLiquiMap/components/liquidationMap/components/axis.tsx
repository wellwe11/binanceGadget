import * as d3 from "d3";

import { AggregatedBarType, d3LinearNumber } from "../../../types";

const DottedLine = ({
  data,
  x,
  height,
  opacity = "0.2",
}: {
  data: number;
  x: d3LinearNumber;
  height: number;
  opacity?: string;
}) => {
  return (
    <line
      x1={x ? x(data) : data}
      x2={x ? x(data) : data}
      y1={0}
      y2={height}
      stroke="white"
      strokeWidth="1"
      strokeDasharray="4 4"
      opacity={opacity}
    />
  );
};

const Axis = ({
  children,
  shorts,
  longs,
  xBars,
  y,
  x,
}: {
  children: React.ReactNode;
  shorts: AggregatedBarType[];
  longs: AggregatedBarType[];
  xBars: d3LinearNumber;
  x: d3LinearNumber;
  y: d3LinearNumber;
}) => {
  const maxShorts = d3.max(shorts, (d: AggregatedBarType) => d.volume);
  const averageShorts = Math.round(
    d3.mean(shorts, (d: AggregatedBarType) => d.volume),
  );

  const maxLongs = d3.max(longs, (d: AggregatedBarType) => d.volume);
  const averageLongs = Math.round(
    d3.mean(longs, (d: AggregatedBarType) => d.volume),
  );

  const [maxYPixels] = y.range();
  const [minXPixels, maxXPixels] = x.range();

  return (
    <svg height={maxYPixels > 0 ? maxYPixels : 0} width={maxXPixels}>
      <DottedLine
        data={maxShorts}
        x={xBars}
        height={maxYPixels}
        opacity="0.3"
      />
      <g id="dottedLinesGroup">
        <DottedLine data={averageShorts} x={xBars} height={maxYPixels} />
        <DottedLine
          data={maxLongs}
          x={xBars}
          height={maxYPixels}
          opacity="0.3"
        />
        <DottedLine data={averageLongs} x={xBars} height={maxYPixels} />
        <DottedLine
          data={maxYPixels}
          x={xBars}
          height={maxYPixels}
          opacity="0.5"
        />
      </g>
      {children}
    </svg>
  );
};

export default Axis;
