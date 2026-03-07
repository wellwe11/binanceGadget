import { Activity, useEffect, useMemo, useRef } from "react";

import * as d3 from "d3";
import {
  d3Band,
  d3Date,
  d3LinearNumber,
  GeneratedDataType,
} from "../../../types";

const DottedLine = ({
  data,
  x,
  y,
  opacity = "0.2",
}: {
  data: number;
  x: d3LinearNumber;
  y: d3Band;
  opacity?: string;
}) => {
  return (
    <line
      x1={0}
      x2={x.range()[1]}
      y1={y(data)}
      y2={y(data)}
      stroke="white"
      strokeWidth="1"
      strokeDasharray="4 4"
      opacity={opacity}
    />
  );
};

const Axis = ({
  children,
  data,
  x,
  y,
  zoomAmount,
  activeDays,
  displayLines,
}: {
  children: React.ReactNode;
  data: GeneratedDataType[];
  x: d3Date;
  y: d3LinearNumber;
  zoomAmount: number;
  activeDays: number;
  displayLines: boolean;
}) => {
  const d3TimeFormat =
    activeDays >= 180 ? "%b %Y" : activeDays >= 14 ? "%d %b" : "%m, %H:%M";
  const xRef = useRef(null);
  const yRef = useRef(null);
  const xAxisTicks = x
    .domain()
    .filter((_: Date, i: number) => i % zoomAmount === 0);
  const yTicks = useMemo(() => y.ticks(), [data]);

  const maxPrice = useMemo(
    () => Math.round(d3.max(data, (d: GeneratedDataType) => d.value)),
    [data],
  );
  const averagePrice = useMemo(
    () => Math.round(d3.mean(data, (d: GeneratedDataType) => d.value)),
    [data],
  );
  const lowPrice = useMemo(
    () => Math.round(d3.min(data, (d: GeneratedDataType) => d.value)),
    [data],
  );

  useEffect(() => {
    if (!xRef.current || !yRef.current) return;
    const xAxis = d3.select(xRef.current);
    const yAxis = d3.select(yRef.current);

    xAxis.call(
      d3
        .axisBottom(x)
        .tickValues(xAxisTicks)
        .tickFormat(d3.timeFormat(d3TimeFormat))
        .tickSize(0),
    );

    yAxis.call(d3.axisRight(y).tickSize(0));

    xAxis.select(".domain").remove();
    yAxis.select(".domain").remove();
  }, [x, y]);

  return (
    <svg
      width={x.range()[1] > 0 ? x.range()[1] + 30 : 0}
      height={y.range()[0] > 0 ? y.range()[0] + 10 : 0}
      x={x.range()[0]}
      y={y.range()[1]}
    >
      <g
        z="10"
        pointerEvents="none"
        ref={xRef}
        transform={`translate(0, ${y.range()[0]})`}
        className="text-white"
      />
      <g
        z="10"
        pointerEvents="none"
        ref={yRef}
        transform={`translate(${x.range()[1]}, 0)`}
        className="text-white"
      />
      {children}
      <Activity mode={displayLines ? "visible" : "hidden"}>
        <g id="heatMapDottedLineGroup">
          <DottedLine data={averagePrice} x={x} y={y} opacity="0.5" />
          <DottedLine data={maxPrice} x={x} y={y} opacity="0.5" />
          <DottedLine data={lowPrice} x={x} y={y} opacity="0.5" />

          {yTicks.map((tickValue: number) => (
            <DottedLine
              key={tickValue}
              data={tickValue}
              x={x}
              y={y}
              opacity="0.1"
            />
          ))}
        </g>
      </Activity>
    </svg>
  );
};

export default Axis;
