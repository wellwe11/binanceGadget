import * as d3 from "d3";
import useTrackContainerSize from "../../hooks/useTrackContainerSize";
import { useEffect, useRef } from "react";
import Axis from "./components/axis";

const BarChart = () => {};

const CandleChart = ({ data, x, y }) => {
  const gRef = useRef(null);

  useEffect(() => {
    if (!gRef.current || !data) return;

    const g = d3.select(gRef.current);

    const candleGroups = g
      .selectAll("g.candle")
      .data(data)
      .join("g")
      .attr("class", "candle")
      .attr(
        "transform",
        (d) => `translate(${x(new Date(d.date).getTime())}, 0)`,
      );

    candleGroups
      .append("line")
      .attr("y1", (d) => y(d.low))
      .attr("y2", (d) => y(d.high))
      .attr("stroke", (d) => (d.low < d.high ? "#c90000" : "#22c55e"))
      .attr("stroke-width", 0.4);

    candleGroups
      .append("line")
      .attr("y1", (d) => y(d.open))
      .attr("y2", (d) => y(d.close))
      .attr("stroke-width", x.bandwidth() * 1)
      .attr("stroke", (d) => (d.open > d.close ? "#c90000" : "#22c55e"));
  }, [data, x, y]);

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
    .scaleBand()
    .range([30, containerWidth - 40])
    .domain(data.map((d) => new Date(d.date)))
    .padding(0.4);

  // y (right side) price
  const y = d3
    .scaleLinear()
    .range([containersHeight - 40, 1])
    .domain([min > 0 ? min - min : 0, max * 1.5]);

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
