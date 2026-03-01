import { act, Activity, useCallback, useMemo, useRef, useState } from "react";

import * as d3 from "d3";

import useTrackContainerSize from "../../hooks/useTrackContainerSize";

import Axis from "./components/axis";

import Tooltip from "./components/tooltip/tooltip";

import CandleChart from "./components/candleChart/candleChart";
import ListeningRect from "./components/listeningRect/listeningRect";
import BarChart from "./components/barChart/barChart";
import lookUpMap from "./functions/lookUpMap";

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
}) => {
  const rafRef = useRef(null);
  const activeCellRef = useRef(null);

  const [activeCell, setActiveCell] = useState(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [hideHighlight, setHideHighlight] = useState(() => false);
  const [mouseOut, setMouseOut] = useState(true);

  const maxVol = d3.max(heatmapData, (d) => d.volume);

  const lookUpHeatMap = useMemo(
    () => lookUpMap(heatmapData, "date", "price"),
    [heatmapData],
  );

  // {"Fri Nov 21 2025 09:47:54 GMT+0200 (Eastern European Standard Time)-289.6497" => Object}

  const xDomain = useMemo(() => x.domain(), [x, candleData]);
  const yDomain = useMemo(() => y.domain(), [min, max, y, candleData]);
  const [yMin, yMax] = useMemo(() => y.domain(), [yDomain]);

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
          Math.min(index, x.domain().length - 1),
        );

        const date = x.domain()[clampedIndex];

        if (!date) return;

        if (hideHighlight) {
          const cell = candleData[clampedIndex];

          if (cell !== activeCellRef.current) {
            activeCellRef.current = cell;

            setActiveCell(cell);
          }
        } else {
          const rawPrice = y.invert(mouseY);

          const priceStep = (yMin - yMax) / numBuckets;
          const snappedPrice =
            Math.floor((rawPrice - yMin) / priceStep) * priceStep + yMin;

          const cell = lookUpHeatMap.get(`${date}-${snappedPrice.toFixed(4)}`);
          // console.log(cell, `${date}-${snappedPrice.toFixed(4)}`);

          if (cell) {
            const isNewDate =
              cell.date.getTime() !== activeCellRef.current?.date?.getTime();
            const isNewPrice = cell.price !== activeCellRef.current?.price;
            if (isNewDate || isNewPrice) {
              activeCellRef.current = cell;
              setActiveCell(cell);
            }
          }
        }
      });
    },
    [lookUpHeatMap, yDomain, xDomain, numBuckets],
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

const HeatMap = ({ heatmapData, rawData, min, max, numBuckets }) => {
  const containerRef = useRef(null);
  const [containerWidth, containersHeight] =
    useTrackContainerSize(containerRef);

  // x = time
  const x = d3
    .scaleBand()
    .range([1, containerWidth - 40])
    .domain(rawData.map((d) => d.date));

  // y (right side) price
  const y = d3
    .scaleLinear()
    .range([containersHeight - 50, 0])
    .domain([min, max]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "inherit",
        height: "inherit",
        position: "relative",
      }}
    >
      <Axis x={x} y={y}>
        <rect
          fill="#440154"
          width={x.range()[1] > 0 ? x.range()[1] : 0}
          height={y.range()[0] > 0 ? y.range()[0] : 0}
          x={x.range()[0]}
          y={y.range()[1]}
        />

        <BarChart data={heatmapData} x={x} y={y} numBuckets={numBuckets} />
        <CandleAndHoverComponent
          candleData={rawData}
          heatmapData={heatmapData}
          x={x}
          y={y}
          min={min}
          max={max}
          numBuckets={numBuckets}
        />
      </Axis>
    </div>
  );
};

export default HeatMap;
