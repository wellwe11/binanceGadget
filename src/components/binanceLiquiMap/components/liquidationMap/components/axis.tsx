import * as d3 from "d3";
import { AxisType, DottedLineType, List } from "../Types";

const DottedLine = ({ data, x, height, opacity = "0.2" }: DottedLineType) => {
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

const Axis = ({ children, shorts, longs, xBars, height, width }: AxisType) => {
  const maxShorts = d3.max(shorts, (d: List) => d.vol);
  const averageShorts = Math.round(d3.mean(shorts, (d: List) => d.vol));

  const maxLongs = d3.max(longs, (d: List) => d.vol);
  const averageLongs = Math.round(d3.mean(longs, (d: List) => d.vol));

  return (
    <svg height={height} width={width}>
      {children}

      <DottedLine data={maxShorts} x={xBars} height={height} opacity="0.3" />
      <DottedLine data={averageShorts} x={xBars} height={height} />
      <DottedLine data={maxLongs} x={xBars} height={height} opacity="0.3" />
      <DottedLine data={averageLongs} x={xBars} height={height} />
      <DottedLine data={height} height={height} opacity="0.5" />
    </svg>
  );
};

export default Axis;
