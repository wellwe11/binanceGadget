import * as d3 from "d3";
import { useEffect, useState } from "react";

const AreaChart = ({ data, x, y, color = "green" }) => {
  const line = d3
    .line()
    .y((d) => y(d.price) + y.bandwidth() / 2)
    .x((d) => x(d.accumulatedVol) + 40)
    .curve(d3.curveBasis);

  const area = d3
    .area()
    .y((d) => y(d.price) + y.bandwidth() / 2)
    .x0(40)
    .x1((d) => x(d.accumulatedVol) + 40)
    .curve(d3.curveBasis);

  return (
    <g>
      <path d={area(data)} fill={color} opacity="0.12" />
      <path
        d={line(data)}
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeDasharray={"100%"}
        strokeDashoffset={"100%"}
        style={{
          animation: "draw 3.5s forwards ease-out",
        }}
      />
      <style>
        {`
          @keyframes draw {
            from { stroke-dashoffset: 100%; }
            to { stroke-dashoffset: 0%; }
          }
        `}
      </style>
    </g>
  );
};

export default AreaChart;
