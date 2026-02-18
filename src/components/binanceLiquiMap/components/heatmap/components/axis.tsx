import { useEffect, useRef } from "react";

import * as d3 from "d3";

const Axis = ({ children, x, y, data, height, width }) => {
  const xRef = useRef(null);
  const yRef = useRef(null);

  useEffect(() => {
    if (!xRef.current || !yRef.current) return;
    const xAxis = d3.select(xRef.current);
    const yAxis = d3.select(yRef.current);

    xAxis.call(
      d3
        .axisBottom(x)
        .ticks(d3.timeMonth.every(3))
        .tickFormat(d3.timeFormat("%b %Y")),
    );

    yAxis.call(d3.axisRight(y));
  }, [x, y]);

  return (
    <svg width={width} height={height}>
      <g
        ref={xRef}
        transform={`translate(0, ${height - 40})`}
        className="text-white"
      />
      <g
        ref={yRef}
        transform={`translate(${width - 40}, 0)`}
        className="text-white"
      />
      {children}
    </svg>
  );
};

export default Axis;
