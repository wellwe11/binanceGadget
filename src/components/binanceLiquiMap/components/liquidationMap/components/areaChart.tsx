import { useRef } from "react";

import * as d3 from "d3";

const AreaChart = ({ data, x, y }) => {
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
      <path d={area(data)} fill="#85bb65" opacity="0.2" />
      <path d={line(data)} fill="none" stroke="#85bb65" strokeWidth="1" />
    </g>
  );
};

export default AreaChart;
