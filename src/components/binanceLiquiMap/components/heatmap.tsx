import * as d3 from "d3";
import useTrackContainerSize from "../hooks/useTrackContainerSize";
import { useEffect, useRef } from "react";

const BarChart = () => {};

const CandleChart = () => {};

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

const HeatMap = ({ data }) => {
  const containerRef = useRef(null);
  const [containerWidth, containersHeight] =
    useTrackContainerSize(containerRef);

  // Define a max point in price
  const max = d3.max(data, (d) => d.value);
  // Define a bottom point in price
  const min = d3.min(data, (d) => d.value);
  // A starting time
  const startTime = data[0].date;
  // End time
  const endTIme = data[data.length - 1].date;

  console.log(containersHeight);

  // Define a generic x and y-axos
  // x = time
  const x = d3
    .scaleTime()
    .range([30, containerWidth - 40])
    .domain(d3.extent(data, (d) => new Date(d.date)));
  // y (right side) price
  const y = d3
    .scaleLinear()
    .range([containersHeight - 40, 1])
    .domain([0, max]);

  console.log(data);

  return (
    <div ref={containerRef} style={{ width: "inherit", height: "inherit" }}>
      <Axis x={x} y={y} height={containersHeight} width={containerWidth}>
        <BarChart />
        <CandleChart />
      </Axis>
    </div>
  );
};

export default HeatMap;
