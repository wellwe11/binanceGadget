import { useEffect } from "react";
import * as d3 from "d3";

const useAxis = (svgRef, data, margins, childNodes) => {
  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svgRefElement = d3.select(svgRef.current);
    svgRefElement.selectAll(".axis").remove();

    svgRefElement
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${innerHeight})`);

    svgRefElement
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${innerWidth},0)`);
  }, [data, svgRef, margins, childNodes]);
};

export default useAxis;
