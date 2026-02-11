import { useEffect, useRef } from "react";
import * as d3 from "d3";

const Axis = ({ children, data, margins, width, height }) => {
  const svgRef = useRef(null);
  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svgRefElement = d3.select(svgRef.current);
    svgRefElement.selectAll(".axis").remove();

    svgRefElement.append("g").attr("class", "axis");

    svgRefElement.append("g").attr("class", "axis");
  }, [data, svgRef, margins]);

  return (
    <svg
      id="svgRef"
      ref={svgRef}
      style={{
        width,
        height,
        transform: `translate(${margins.left}, ${margins.top})`,
      }}
    >
      {children && children}
    </svg>
  );
};

export default Axis;
