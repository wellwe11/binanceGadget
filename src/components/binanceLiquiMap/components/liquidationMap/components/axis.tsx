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

const Axis = ({ children, shorts, longs, xBars, y, x }: AxisType) => {
  const maxShorts = d3.max(shorts, (d: List) => d.vol);
  const averageShorts = Math.round(d3.mean(shorts, (d: List) => d.vol));

  const maxLongs = d3.max(longs, (d: List) => d.vol);
  const averageLongs = Math.round(d3.mean(longs, (d: List) => d.vol));

  const [maxYPixels] = y.range();
  const [minXPixels, maxXPixels] = x.range();

  return (
    <svg height={maxYPixels > 0 ? maxYPixels : 0} width={maxXPixels + 50}>
      <DottedLine
        data={maxShorts}
        x={xBars}
        height={maxYPixels}
        opacity="0.3"
      />
      <DottedLine data={averageShorts} x={xBars} height={maxYPixels} />
      <DottedLine data={maxLongs} x={xBars} height={maxYPixels} opacity="0.3" />
      <DottedLine data={averageLongs} x={xBars} height={maxYPixels} />
      <DottedLine
        data={maxYPixels}
        x={xBars}
        height={maxYPixels}
        opacity="0.5"
      />
      {children}
    </svg>
  );
};

export default Axis;
