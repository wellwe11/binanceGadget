import * as d3 from "d3";
import useTrackContainerSize from "../../hooks/useTrackContainerSize";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Axis from "./components/axis";

const ListeningRect = ({
  y,
  x,
  width,
  height,
  handleHover,
  activeCell,
  hideHighlight,
}) => {
  const cellH = height / 100;

  return (
    <g cursor="pointer">
      <rect
        width={width}
        height={height}
        fill="transparent"
        onMouseMove={handleHover}
        className="pointer-events-auto"
      />

      {activeCell && (
        <rect
          x={x(activeCell.date)}
          y={y(activeCell.price)}
          width={x.bandwidth()}
          height={cellH}
          fill="none"
          stroke="white"
          strokeWidth="0.5"
          className="pointer-events-none"
          style={{ opacity: hideHighlight ? "0" : "1" }}
        />
      )}
    </g>
  );
};

const Tooltip = ({ mousePos, activeCell, width, height }) => {
  const toolTipRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [adjustPos, setAdjustPos] = useState({ up: false, left: false });

  if (
    !activeCell ||
    activeCell.high === undefined ||
    activeCell.low === undefined
  )
    return null;

  useLayoutEffect(() => {
    if (!toolTipRef.current) return;

    const { width, height } = toolTipRef.current.getBoundingClientRect();

    setSize({ width, height });
  }, []);

  useEffect(() => {
    const toolTipEl = d3.select(toolTipRef.current);

    const marginHeight = size.height + mousePos.y;
    const marginWidth = size.width + mousePos.x;

    setAdjustPos({
      up: marginHeight >= height ? true : false,
      left: marginWidth >= width ? true : false,
    });

    toolTipEl
      .transition()
      .duration(200)
      .ease(d3.easeCubicOut)
      .attr("x", mousePos.x)
      .attr("y", mousePos.y);
  }, [mousePos]);

  return (
    <foreignObject
      ref={toolTipRef}
      width="200"
      height="150"
      className="pointer-events-none"
      style={{
        transform: `translate(${adjustPos.left ? `-${size.width + 20}px` : "20px"}, ${adjustPos.up ? `-${size.height + 20}px` : "0"})`,
        transition: "transform 0.3s ease",
      }}
    >
      <div className="bg-black w-full h-full text-white pointer-events-none py-2 z-30">
        <p>{`${activeCell.high}, ${activeCell.low}`}</p>
      </div>
    </foreignObject>
  );
};

const CandleChart = ({ data, x, y, handleHover, setHideHighlight }) => {
  return (
    <g
      className="candle"
      onMouseMove={handleHover}
      onMouseEnter={() => setHideHighlight(true)}
      onMouseLeave={() => setHideHighlight(false)}
    >
      {data.map((d, i) => (
        <g
          cursor="pointer"
          key={i}
          className="group transition-transform duration-150 ease-in-out hover:scale-x-150"
          transform={`translate(${x(d.date)}, 0)`}
          style={{
            transformOrigin: `${x(d.date)}px center`,
            transformBox: "fill-box",
          }}
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

// Shared parent to allow easier use of mouse-events
const CandleAndHoverComponent = ({
  candleData,
  heatmapData,
  x,
  y,
  containerWidth,
  containersHeight,
  min,
  max,
  pricePadding,
}) => {
  const [activeCell, setActiveCell] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hideHighlight, setHideHighlight] = useState(false);

  const lookUpMap = useMemo(() => {
    const map = new Map();

    heatmapData.forEach((c) => {
      map.set(`${c.date}-${c.price.toFixed(4)}`, c);
    });

    return map;
  }, [heatmapData]);

  const xDomain = useMemo(() => x.domain(), [containerWidth, heatmapData]);
  const yDomain = useMemo(
    () => y.domain(),
    [min, max, pricePadding, containersHeight],
  );

  const handleHover = useCallback(
    (event) => {
      const [mouseX, mouseY] = d3.pointer(event);
      setMousePos((prev) => {
        if (prev.x === mouseX && prev.y === mouseY) return prev;
        return { x: mouseX, y: mouseY };
      });

      const eachBand = x.step();
      const index = Math.floor((mouseX - x.range()[0]) / eachBand);
      const date = x.domain()[index];

      if (!date) return;

      const rawPrice = y.invert(mouseY);
      const [yMin, yMax] = y.domain();
      const priceStep = (yMax - yMin) / 100;

      const snappedPrice =
        Math.floor((rawPrice - yMin) / priceStep) * priceStep + yMin;

      const cell = lookUpMap.get(`${date}-${snappedPrice.toFixed(4)}`);

      if (cell && cell.price !== activeCell?.price) {
        setActiveCell({
          date,
          price: snappedPrice,
          volume: cell?.volume || 0,
          isVisible: cell?.isVisible,
          high: cell.high,
          low: cell.low,
        });
      }
    },
    [activeCell, lookUpMap, xDomain, yDomain],
  );
  return (
    <>
      <ListeningRect
        y={y}
        x={x}
        width={containerWidth}
        height={containersHeight}
        handleHover={handleHover}
        activeCell={activeCell}
        hideHighlight={hideHighlight}
      />
      <CandleChart
        data={candleData}
        x={x}
        y={y}
        handleHover={handleHover}
        setHideHighlight={setHideHighlight}
      />
      {activeCell && (
        <Tooltip
          mousePos={mousePos}
          activeCell={activeCell}
          width={containerWidth}
          height={containersHeight}
        />
      )}
    </>
  );
};

const BarMap = React.memo(({ data, x, y, width, height }) => {
  const canvasRef = useRef(null);

  const maxVol = useMemo(() => {
    return d3.max(data, (liq) => liq.volume) || 1;
  }, [data]);

  const colorScale = useMemo(
    () =>
      d3
        .scaleLinear()
        .domain([0, maxVol * 0.1, maxVol * 0.2, maxVol * 0.6, maxVol])
        .range([
          "rgba(0,0,0,0)",
          "#00bcc695",
          "#00bcc699",
          "#ffff00",
          "#ffff00",
        ]),
    [maxVol],
  );

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
});

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
    .range([containersHeight - 50, 0])
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
          volume: isLiquidated ? 0 : totalVolume,
          isVisible: !isLiquidated,
          high: candle.high,
          low: candle.low,
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
      <Axis x={x} y={y} height={containersHeight} width={containerWidth}>
        <foreignObject style={{ width: "100%", height: "100%" }}>
          <BarMap
            data={heatmapData}
            x={x}
            y={y}
            height={containersHeight}
            width={containerWidth}
          />
        </foreignObject>
        <CandleAndHoverComponent
          candleData={data}
          heatmapData={heatmapData}
          x={x}
          y={y}
          containerWidth={containerWidth}
          containersHeight={containersHeight}
          min={min}
          max={max}
          pricePadding={pricePadding}
        />
      </Axis>
    </div>
  );
};

export default HeatMap;
