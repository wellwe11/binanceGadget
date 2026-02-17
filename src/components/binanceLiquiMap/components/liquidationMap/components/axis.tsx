import { useRef } from "react";

const Axis = ({ children, height, width, margin, x, xBars, y }) => {
  const svgRef = useRef(null);
  const xAxisRef = useRef(null);
  const xBarAxisRef = useRef(null);
  const yAxisRef = useRef(null);

  return (
    <svg
      ref={svgRef}
      style={{
        width: `${width}`,
        height: `${height}`,
        border: "1px solid gray",
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
