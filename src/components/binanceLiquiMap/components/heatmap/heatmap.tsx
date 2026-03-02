import {
  Activity,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import * as d3 from "d3";

import useTrackContainerSize from "../../hooks/useTrackContainerSize";

import Axis from "./components/axis";

import Tooltip from "./components/tooltip/tooltip";

import CandleChart from "./components/candleChart/candleChart";
import ListeningRect from "./components/listeningRect/listeningRect";
import BarChart from "./components/barChart/barChart";

// Things to fix
// White highlight-square to be on top of mouse (currently in the middle
// Zoom

// Shared parent to allow easier use of mouse-events

const CandleAndHoverComponent = ({
  candleData,
  heatmapData,
  x,
  y,
  min,
  max,
  numBuckets,
  maxVol,
}) => {
  const rafRef = useRef(null);
  const activeCellRef = useRef(null);

  const [activeCell, setActiveCell] = useState(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [hideHighlight, setHideHighlight] = useState(() => false);
  const [mouseOut, setMouseOut] = useState(true);

  const xDomain = useMemo(() => x.domain(), [x, candleData]);
  const yDomain = useMemo(() => y.domain(), [min, max, y, candleData]);

  const handleHover = useCallback(
    (event) => {
      const [mouseX, mouseY] = d3.pointer(event);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        setMousePos({ x: mouseX, y: mouseY });

        const eachBand = x.step();
        const rangeStart = x.range()[0];

        const index = Math.round((mouseX - rangeStart) / eachBand);

        const clampedIndex = Math.max(
          0,
          Math.min(index, candleData.length - 1),
        );
        const date = candleData[clampedIndex].date;

        if (!date) return;

        if (hideHighlight) {
          const cell = candleData[clampedIndex];

          if (cell !== activeCellRef.current) {
            activeCellRef.current = cell;

            setActiveCell(cell);
          }
        } else {
          const rawPrice = y.invert(mouseY);

          const priceStep = (min - max) / numBuckets;
          const snappedPrice =
            Math.floor((rawPrice - min) / priceStep) * priceStep + min;

          const cell = heatmapData.get(`${date}-${snappedPrice.toFixed(4)}`);

          if (cell) {
            const isNewDate = cell.date !== activeCellRef.current?.date;
            const isNewPrice = cell.price !== activeCellRef.current?.price;
            if (isNewDate || isNewPrice) {
              activeCellRef.current = cell;
              setActiveCell(cell);
            }
          }
        }
      });
    },
    [heatmapData, yDomain, xDomain, numBuckets],
  );

  return (
    <g className="CandleAndHoverComponent">
      <ListeningRect
        y={y}
        x={x}
        handleHover={handleHover}
        activeCell={activeCell}
        hideHighlight={hideHighlight}
        setMouseOut={setMouseOut}
        mouseOut={mouseOut}
        numBuckets={numBuckets}
      />

      <CandleChart
        data={candleData}
        x={x}
        y={y}
        handleHover={handleHover}
        setHideHighlight={setHideHighlight}
      />
      <Activity mode={mouseOut && !hideHighlight ? "hidden" : "visible"}>
        <Tooltip
          mousePos={mousePos}
          activeCell={activeCell}
          x={x}
          y={y}
          hideHighlight={hideHighlight}
          max={maxVol}
        />
      </Activity>
    </g>
  );
};

const HeatMap = ({ heatmapData, rawData, min, max, numBuckets, maxVol }) => {
  const containerRef = useRef(null);
  const zoomRef = useRef(null);
  const [containerWidth, containersHeight] =
    useTrackContainerSize(containerRef);
  const [transform, setTransform] = useState(d3.zoomIdentity);

  const visibleCount = Math.max(10, Math.floor(rawData.length / transform.k));

  const scrollRatio = -transform.x / (containerWidth || 1);
  const startIdx = Math.max(
    0,
    Math.min(
      rawData.length - visibleCount,
      Math.floor(scrollRatio * rawData.length),
    ),
  );

  const visibleData = rawData.slice(startIdx, startIdx + visibleCount);

  // 3. X Scale uses the current slice
  const x = d3
    .scaleBand()
    .domain(visibleData.map((d) => d.date))
    .range([0, containerWidth - 40]);

  // 4. Y Scale stays fixed (No vertical zoom)
  const y = d3
    .scaleLinear()
    .domain([min, max])
    .range([containersHeight - 50, 0]);

  useEffect(() => {
    const zoom = d3
      .zoom()
      .scaleExtent([0, 4])
      .translateExtent([
        [-Infinity, 0],
        [Infinity, containersHeight],
      ])
      .on("zoom", (e) => setTransform(e.transform));

    d3.select(zoomRef.current).call(zoom);
  }, [containerWidth]);
  return (
    <div
      ref={containerRef}
      style={{
        width: "inherit",
        height: "inherit",
        position: "relative",
      }}
    >
      <Axis x={x} y={y} zoomRef={zoomRef}>
        <rect
          fill="#440154"
          width={x.range()[1] > 0 ? x.range()[1] : 0}
          height={y.range()[0] > 0 ? y.range()[0] : 0}
          x={x.range()[0]}
          y={y.range()[1]}
        />

        <BarChart
          data={heatmapData}
          x={x}
          y={y}
          numBuckets={numBuckets}
          maxVol={maxVol}
        />
        <CandleAndHoverComponent
          candleData={visibleData}
          heatmapData={heatmapData}
          x={x}
          y={y}
          min={min}
          max={max}
          numBuckets={numBuckets}
          maxVol={maxVol}
        />
      </Axis>
    </div>
  );
};

export default HeatMap;
