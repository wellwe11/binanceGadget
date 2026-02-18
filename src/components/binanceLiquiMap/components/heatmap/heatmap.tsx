import * as d3 from "d3";
import useTrackContainerSize from "../../hooks/useTrackContainerSize";
import { useEffect, useRef } from "react";
import Axis from "./components/axis";

const BarChart = () => {};

const CandleChart = ({ data, x, y }) => {
  const gRef = useRef(null);

  useEffect(() => {
    if (!gRef.current) return;

    const g = d3.select(gRef.current);

    g.attr("stroke-linecap", "round")
      .attr("stroke", "black")
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", (d) => `translate(${x(d.date)},0)`);
  }, [data]);

  return <g ref={gRef}></g>;
};

const HeatMap = ({ data }) => {
  const containerRef = useRef(null);
  const [containerWidth, containersHeight] =
    useTrackContainerSize(containerRef);

  const max = d3.max(data, (d) => d.value);
  const min = d3.min(data, (d) => d.value);

  // x = time
  const x = d3
    .scaleTime()
    .range([30, containerWidth - 40])
    .domain(d3.extent(data, (d) => new Date(d.date)));

  // y (right side) price
  const y = d3
    .scaleLinear()
    .range([containersHeight - 40, 1])
    .domain([min, max]);

  console.log(data);

  return (
    <div ref={containerRef} style={{ width: "inherit", height: "inherit" }}>
      <Axis x={x} y={y} height={containersHeight} width={containerWidth}>
        <BarChart />
        <CandleChart data={data} x={x} y={y} />
      </Axis>
    </div>
  );
};

export default HeatMap;
