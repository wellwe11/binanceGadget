import * as d3 from "d3";
import useTrackContainerSize from "../../hooks/useTrackContainerSize";
import { useEffect, useRef } from "react";
import Axis from "./components/axis";

// Create barchart
// Inside of barchart, i need to calculate if value is the same as price during that time
// If so, make liquidation into 0

// Add a listening rect
// Inside of rect, I need a toolbox that shows
// Hovering CandleChart: Open, High, Low, Close
// Hovering barChart: Price, Liqudation Leverage

const BarChart = () => {};

const CandleChart = ({ data, x, y }) => {
  return (
    <g className="candle">
      {data.map((d, i) => (
        <g
          key={i}
          className="candleGroup"
          transform={`translate(${x(new Date(d.date).getTime())}, 0)`}
        >
          <line
            y1={y(d.low)}
            y2={y(d.high)}
            stroke={d.open > d.close ? "#ff3939" : "#65ff65"}
            strokeWidth="1"
          />
          <line
            y1={y(d.open)}
            y2={y(d.close)}
            stroke={d.open > d.close ? "#ff3939" : "#65ff65"}
            strokeWidth={x.bandwidth()}
          />
        </g>
      ))}
    </g>
  );
};

const HeatMap = ({ data }) => {
  const reveredData = data.toReversed();
  const containerRef = useRef(null);
  const [containerWidth, containersHeight] =
    useTrackContainerSize(containerRef);

  const max = d3.max(reveredData, (d) => d.value);
  const min = d3.min(reveredData, (d) => d.value);

  // x = time
  const x = d3
    .scaleBand()
    .range([30, containerWidth - 40])
    .domain(reveredData.map((d) => new Date(d.date)))
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
        <CandleChart data={reveredData} x={x} y={y} />
      </Axis>
    </div>
  );
};

export default HeatMap;
