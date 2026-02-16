import { useRef } from "react";

import * as d3 from "d3";

const AreaChart = ({ data, x, y }) => {
  const gRef = useRef(null);
  const pathRef = useRef(null);
  const line = d3
    .line()
    .x((d) => x(d.price))
    .y((d) => y(d.vol));

  const area = d3
    .area()
    .y((d) => y(d.price) + y.bandwidth() / 2)
    .x0(40)
    .x1((d) => x(d.accumulatedVol) + 40)
    .curve(d3.curveBasis);

  return (
    <g ref={gRef}>
      <path ref={pathRef} d={area(data)} fill="#85bb65" opacity="0.5" />
    </g>
  );
};

export default AreaChart;
