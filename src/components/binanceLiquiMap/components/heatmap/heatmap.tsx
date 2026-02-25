import * as d3 from "d3";
import useTrackContainerSize from "../../hooks/useTrackContainerSize";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Axis from "./components/axis";

const ToolBox = ({ hoveringObj }) => {
  // Create a tool-box
  // If hovering over Heatmap: displays Price and Liquidation Leverage
  // If hovering over CandleChart: Open, High, Low, Close
  console.log(hoveringObj);
};

const ListeningRect = ({
  data,
  y,
  x,
  width,
  height,
  min,
  max,
  pricePadding,
}) => {
  const [activeCell, setActiveCell] = useState(null);
  const xDomain = useMemo(() => x.domain(), [width, data]);
  const yDomain = useMemo(() => y.domain(), [min, max, pricePadding]);
  const handleHover = useCallback(
    (event) => {
      const [mouseX, mouseY] = d3.pointer(event);
      const eachBand = x.step();
      const index = Math.floor((mouseX - x.range()[0]) / eachBand);
      const date = x.domain()[index];

      if (!date) return;

      const rawPrice = y.invert(mouseY);
      const [yMin, yMax] = y.domain();
      const priceStep = (yMax - yMin) / 100;

      const snappedPrice =
        Math.floor((rawPrice - yMin) / priceStep) * priceStep + yMin;

      const cell = data.find(
        (c) =>
          c.date.getTime() === date.getTime() &&
          Math.abs(c.price - snappedPrice) < priceStep / 2,
      );

      setActiveCell({
        date,
        price: snappedPrice,
        volume: cell?.volume || 0,
        isVisible: cell?.isVisible,
      });
    },
    [data, xDomain, yDomain, x, y],
  );

  return (
    <g>
      <rect
        width={width}
        height={height}
        fill="transparent"
        onMouseMove={(e) => handleHover(e)}
      />
      {activeCell && (
        <rect
          x={x(activeCell.date)}
          y={y(activeCell.price)}
          width={x.bandwidth()}
          height={5}
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          style={{ pointerEvents: "none" }}
        />
      )}
    </g>
  );
};

const Heatmap = ({ data, x, y, width, height }) => {
  const canvasRef = useRef(null);

  const maxVol = useMemo(() => {
    return d3.max(data, (liq) => liq.volume) || 1;
  }, [data]);

  const colorScale = d3
    .scaleLinear()
    .domain([0, maxVol * 0.2, maxVol * 0.3, maxVol * 0.4, maxVol * 0.6, maxVol])
    .range([
      "rgba(0,0,0,0)",
      "#0095ff",
      "#00960a",
      "#65ff65",
      "#65ff65",
      "#e7e700",
    ]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width * dpr, height * dpr);
    ctx.scale(dpr, dpr);

    const cellW = x.bandwidth();
    const cellH = height / 100;

    data.forEach((cell) => {
      if (cell.volume === 0) return;

      ctx.fillStyle = colorScale(cell.volume);
      ctx.globalAlpha = 0.7;

      ctx.fillRect(x(cell.date), y(cell.price), cellW, cellH);
    });
  }, [data, x, y, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
    />
  );
};

const CandleChart = ({ data, x, y }) => {
  return (
    <g className="candle">
      {data.map((d, i) => (
        <g
          key={i}
          className="candleGroup"
          transform={`translate(${x(d.date)}, 0)`}
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
  const pricePadding = (max - min) * 0.3;

  // x = time
  const x = d3
    .scaleBand()
    .range([30, containerWidth - 40])
    .domain(data.map((d) => new Date(d.date)));

  // y (right side) price
  const y = d3
    .scaleLinear()
    .range([containersHeight - 20, 0])
    .domain([min - pricePadding, max + pricePadding]);

  const heatmapData = useMemo(() => {
    const [yMin, yMax] = y.domain();
    const numBuckets = 100;
    const priceStep = (yMax - yMin) / numBuckets;
    const grid = [];

    x.domain().forEach((date) => {
      const candle = data.find(
        (d) => new Date(d.date).getTime() === date.getTime(),
      );

      for (let i = 0; i < numBuckets; i++) {
        const bucketPrice = yMin + i * priceStep;

        // SUM all volumes in this price bucket
        const totalVolume =
          candle?.liquidations.reduce((sum, l) => {
            const isMatch = Math.abs(l.price - bucketPrice) < priceStep / 2;
            return isMatch ? sum + l.volume : sum;
          }, 0) || 0;

        const isLiquidated =
          candle && bucketPrice >= candle.low && bucketPrice <= candle.high;

        grid.push({
          date,
          price: bucketPrice,
          volume: isLiquidated ? 0 : totalVolume, // Now contains the sum
          isVisible: !isLiquidated,
        });
      }
    });

    return grid;
  }, [data, x.domain(), y.domain()]);
  return (
    <div
      ref={containerRef}
      style={{
        width: "inherit",
        height: "inherit",
        position: "relative",
      }}
    >
      <div
        style={{
          backgroundColor: "#46009b65",
          height: "90%",
          position: "absolute",
          width: "95%",
        }}
      >
        <Heatmap
          data={heatmapData}
          x={x}
          y={y}
          height={containersHeight}
          width={containerWidth}
        />

        <Axis x={x} y={y} height={containersHeight} width={containerWidth}>
          <ListeningRect
            data={heatmapData}
            y={y}
            x={x}
            width={containerWidth}
            height={containersHeight}
            min={min}
            max={max}
            pricePadding={pricePadding}
          />
          <CandleChart data={data} x={x} y={y} />
        </Axis>
      </div>
    </div>
  );
};

export default HeatMap;
