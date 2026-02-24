import * as d3 from "d3";
import useTrackContainerSize from "../../hooks/useTrackContainerSize";
import { useMemo, useRef } from "react";
import Axis from "./components/axis";

const Heatmap = ({ data, x, y, width, height }) => {
  const colorScale = d3
    .scaleSequential(d3.interpolateBlues)
    .domain([0, d3.max(data, (d) => d.volume) || 1]);

  const cellWidth = width;
  const cellHeight = 1;

  return (
    <g>
      {data.map((obj, index) => (
        <rect
          key={index}
          x={x(obj.date)}
          y={y(obj.price)}
          width={cellWidth}
          height={cellHeight}
          fill={colorScale(obj.volume)}
          opacity="0.8"
          cursor="pointer"
          onMouseEnter={() => console.log(obj.price + " " + obj.volume)}
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
            strokeWidth={x.bandwidth()}
          />
        </g>
      ))}
    </g>
  );
};

const HeatMap = ({ data }) => {
  // Need to filter data, so it only displays longs below current price, shorts above current price
  const reveredData = data.toReversed();

  const containerRef = useRef(null);
  const [containerWidth, containersHeight] =
    useTrackContainerSize(containerRef);

  const max = d3.max(data, (d) => d.value);
  const min = d3.min(data, (d) => d.value);

  // x = time
  const x = d3
    .scaleBand()
    .range([30, containerWidth - 40])
    .domain(reveredData.map((d) => new Date(d.date)))
    .padding(0.4);

  const pricePadding = (max - min) * 0.3;

  // y (right side) price
  const y = d3
    .scaleLinear()
    .range([containersHeight, 0])
    .domain([min - pricePadding, max + pricePadding]);

  const heatmapData = useMemo(() => {
    return data.flatMap((candle) =>
      candle.liquidations.map((liq) => ({
        date: new Date(candle.date),
        price: liq.price,
        volume: liq.volume,
      })),
    );
  }, [data]);

  return (
    <div ref={containerRef} style={{ width: "inherit", height: "inherit" }}>
      <Axis x={x} y={y} height={containersHeight} width={containerWidth}>
        <Heatmap
          data={heatmapData}
          x={x}
          y={y}
          width={containerWidth}
          height={containersHeight}
        />
        <CandleChart data={reveredData} x={x} y={y} />
      </Axis>
    </div>
  );
};

export default HeatMap;
