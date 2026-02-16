import { useEffect, useRef } from "react";

import * as d3 from "d3";

const Axis = ({ children, height, width, margin, x, xBars, y }) => {
  const svgRef = useRef(null);
  const xAxisRef = useRef(null);
  const xBarAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  const xAxis = d3
    .axisBottom(x)
    .tickValues(x.domain().filter((d, i) => i % 1 === 0));

  const xBarAxis = d3.axisBottom(xBars).tickValues(xBars.domain());

  const yAxis = d3
    .axisLeft(y)
    .tickValues(y.domain().filter((d, i) => i % 5 === 0));

  useEffect(() => {
    if (
      !svgRef.current ||
      !xAxisRef.current ||
      !xBarAxisRef.current ||
      !yAxisRef.current
    )
      return;

    const xAxisEl = d3.select(xAxisRef.current);
    const xBarAxisEl = d3.select(xBarAxisRef.current);
    const yAxisEl = d3.select(yAxisRef.current);

    xAxisEl.call(xAxis);
    xBarAxisEl.call(xBarAxis);
    yAxisEl.call(yAxis);
  }, [svgRef, xAxisRef, xBarAxisRef, yAxisRef]);
  return (
    <svg
      ref={svgRef}
      className="bg-amber-100"
      style={{
        width: `${width + margin.left + margin.right}`,
        height: `${height + margin.top + margin.bottom}`,
      }}
    >
      {children}
      <g ref={yAxisRef} transform="translate(40, 0)" />
      <g ref={xAxisRef} transform={`translate(40, ${height})`} />
      <g ref={xBarAxisRef} transform={`translate(40, ${height})`} />
    </svg>
  );
};

export default Axis;
