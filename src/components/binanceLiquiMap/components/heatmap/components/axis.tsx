import { useEffect, useRef } from "react";

import * as d3 from "d3";

const Axis = ({ children, x, y }) => {
  // Change height and width to using [minPixels, maxPixels] = y.range()
  const xRef = useRef(null);
  const yRef = useRef(null);

  useEffect(() => {
    if (!xRef.current || !yRef.current) return;
    const xAxis = d3.select(xRef.current);
    const yAxis = d3.select(yRef.current);

    const xAxisTicks = x.domain().filter((d, i) => i % 50 === 0);

    xAxis.call(
      d3
        .axisBottom(x)
        .tickValues(xAxisTicks)
        .tickFormat(d3.timeFormat("%b %Y"))
        .tickSize(0),
    );

    yAxis.call(d3.axisRight(y).tickSize(0));

    xAxis.select(".domain").remove();
    yAxis.select(".domain").remove();
  }, [x, y]);

  return (
    <svg
      width={x.range()[1] > 0 ? x.range()[1] + 40 : 0}
      height={y.range()[0] > 0 ? y.range()[0] + 40 : 0}
      x={x.range()[0]}
      y={y.range()[1]}
    >
      <g
        ref={xRef}
        transform={`translate(0, ${y.range()[0]})`}
        className="text-white"
      />
      <g
        ref={yRef}
        transform={`translate(${x.range()[1]}, 0)`}
        className="text-white"
      />
      {children}
    </svg>
  );
};

export default Axis;
