import * as d3 from "d3";
import useTrackContainerSize from "../../hooks/useTrackContainerSize";
import { useMemo, useRef } from "react";
import Axis from "./components/axis";

const ToolBox = () => {
  // Create a tool-box
  // If hovering over Heatmap: displays Price and Liquidation Leverage
  // If hovering over CandleChart: Open, High, Low, Close
};

const Heatmap = ({ data, x, y, height }) => {
  const colorScale = d3
    .scaleSequential(d3.interpolateBlues)
    .domain([0, d3.max(data, (d) => d.volume) || 1]);

  const cellHeight = height / 100;

  return (
    <g>
      {data.map((cell, index) => (
        <rect
          key={index}
          x={x(cell.date)}
          y={y(cell.price)}
          width={x.bandwidth()}
          height={cellHeight}
          fill={cell.volume > 0 ? colorScale(cell.volume) : "transparent"}
          opacity="0.5"
          cursor="pointer"
          onMouseEnter={() => console.log(cell)}
          className="hover:stroke-white hover:stroke-1"
        />
      ))}
    </g>
  );
};

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
            stroke={d.open < d.close ? "#ff3939" : "#65ff65"}
            strokeWidth="1"
          />
          <line
            y1={y(d.open)}
            y2={y(d.close)}
            stroke={d.open < d.close ? "#ff3939" : "#65ff65"}
            strokeWidth={x.bandwidth() * 0.5}
          />
        </g>
      ))}
    </g>
  );
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
    .domain(data.map((d) => new Date(d.date)));

  const pricePadding = (max - min) * 0.3;

  // y (right side) price
  const y = d3
    .scaleLinear()
    .range([containersHeight - 20, 0])
    .domain([min - pricePadding, max + pricePadding]);

  const heatmapData = useMemo(() => {
    const [yMin, yMax] = y.domain();
    const numBuckets = 100; // Resolution of your Y-axis
    const priceStep = (yMax - yMin) / numBuckets;
    const grid = [];

    // Iterate through every date in your scale
    x.domain().forEach((date) => {
      const candle = data.find(
        (d) => new Date(d.date).getTime() === date.getTime(),
      );

      for (let i = 0; i < numBuckets; i++) {
        const bucketPrice = yMin + i * priceStep;

        // Look for data in the liquidations array for this candle
        const match = candle?.liquidations.find(
          (l) => Math.abs(l.price - bucketPrice) < priceStep / 2,
        );

        // Check if this cell should be "hidden" by the candle body
        const isLiquidated =
          candle && bucketPrice >= candle.low && bucketPrice <= candle.high;

        grid.push({
          date: date,
          price: bucketPrice,
          volume: isLiquidated ? 0 : match?.volume || 0,
          isVisible: !isLiquidated,
        });
      }
    });

    return grid;
  }, [data, x, min, max]);
  return (
    <div ref={containerRef} style={{ width: "inherit", height: "inherit" }}>
      <Axis x={x} y={y} height={containersHeight} width={containerWidth}>
        <Heatmap data={heatmapData} x={x} y={y} height={containersHeight} />

        <CandleChart data={data} x={x} y={y} />
      </Axis>
    </div>
  );
};

export default HeatMap;
