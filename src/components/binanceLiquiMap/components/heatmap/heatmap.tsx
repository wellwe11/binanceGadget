import * as d3 from "d3";
import useTrackContainerSize from "../../hooks/useTrackContainerSize";
import { useMemo, useRef } from "react";
import Axis from "./components/axis";

const ListeningRect = ({ data }) => {
  // A listeningRect that displays a square of cell-width and cell-height
  // Shows a white border wherever mouse is
  // Should be below Candlechart, and above Heatmap
};

const ToolBox = () => {
  // Create a tool-box
  // If hovering over Heatmap: displays Price and Liquidation Leverage
  // If hovering over CandleChart: Open, High, Low, Close
};

const Heatmap = ({ data, x, y }) => {
  const colorScale = d3
    .scaleSequential(d3.interpolateBlues)
    .domain([0, d3.max(data, (d) => d.volume) || 1]);

  return (
    <g>
      {data.map((obj, index) => (
        <rect
          key={index}
          x={x(obj.date)}
          y={y(obj.price)}
          width={x.bandwidth()}
          height="2.5"
          fill={colorScale(obj.volume)}
          opacity="0.5"
          cursor="pointer"
          onMouseEnter={() => console.log(obj)}
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

  // Removes liquidations that clash with price (CnadleChart)
  // Filter out all liqudations that arent visible on the graph (below min and above max)
  const heatmapData = useMemo(() => {
    return data.flatMap((candle) => {
      const validLiqs = candle.liquidations.filter((obj) => {
        if (!obj) return false;

        // Removes objects that are not visible in graph
        const isWithinBounds =
          obj.price >= min - pricePadding && obj.price <= max + pricePadding;

        // Price that clashes with candles price
        const isLiquidatedToday =
          obj.price >= candle.low && obj.price <= candle.high;

        // Removes longs above price and shorts below price
        const isWrongSide =
          (obj.type === "short" && obj.price > candle.value) ||
          (obj.type === "long" && obj.price < candle.value);

        return isWithinBounds && !isLiquidatedToday && isWrongSide;
      });

      return validLiqs.map((obj) => ({
        date: new Date(candle.date),
        price: obj.price,
        volume: obj.volume,
        type: obj.type,
      }));
    });
  }, [data, min, max]);

  return (
    <div ref={containerRef} style={{ width: "inherit", height: "inherit" }}>
      <Axis x={x} y={y} height={containersHeight} width={containerWidth}>
        <Heatmap data={heatmapData} x={x} y={y} />
        <CandleChart data={data} x={x} y={y} />
      </Axis>
    </div>
  );
};

export default HeatMap;
