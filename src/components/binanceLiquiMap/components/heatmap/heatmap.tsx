import { Activity, useCallback, useMemo, useRef, useState } from "react";

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
  containerWidth,
  containersHeight,
  min,
  max,
  pricePadding,
}) => {
  const rafRef = useRef(null);
  const activeCellRef = useRef(null);

  const [activeCell, setActiveCell] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hideHighlight, setHideHighlight] = useState(() => false);

  const maxVol = d3.max(heatmapData, (d) => d.volume);

  const lookUpHeatMap = useMemo(
    () => lookUpMap(heatmapData, "date", "price"),
    [heatmapData],
  );

  const xDomain = useMemo(() => x.domain(), [containerWidth, heatmapData]);
  const yDomain = useMemo(
    () => y.domain(),
    [min, max, pricePadding, containersHeight],
  );

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
          const [yMin, yMax] = y.domain();
          const priceStep = (yMax - yMin) / 100;

          const snappedPrice =
            Math.floor((rawPrice - yMin) / priceStep) * priceStep + yMin;

          const cell = lookUpHeatMap.get(`${date}-${snappedPrice.toFixed(4)}`);

          if (
            cell?.date.getTime() !== activeCellRef.current?.date.getTime() ||
            cell?.price !== activeCellRef.current?.price
          ) {
            activeCellRef.current = cell;
            setActiveCell(cell);
          }
        }
      });
    },
    [lookUpHeatMap, yDomain, xDomain],
  );

  return (
    <g onMouseLeave={() => setActiveCell(null)}>
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
      <Activity mode={activeCell ? "visible" : "hidden"}>
        <Tooltip
          mousePos={mousePos}
          activeCell={activeCell}
          width={containerWidth}
          height={containersHeight}
          hideHighlight={hideHighlight}
          max={maxVol}
        />
      </Activity>
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
    .domain(data.map((d) => new Date(d.date)))
    .padding(0);

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

    data.forEach((obj) => {
      for (let i = 0; i < numBuckets; i++) {
        const bucketPrice = yMin + i * priceStep;

        const totalVolume =
          obj?.liquidations.reduce((sum, l) => {
            const isMatch =
              l.price >= bucketPrice && l.price < bucketPrice + priceStep;
            return isMatch ? sum + l.volume : sum;
          }, 0) || 0;

        const isLiquidated =
          obj && bucketPrice >= obj.low && bucketPrice <= obj.high;

        grid.push({
          date: obj.date,
          price: bucketPrice,
          volume: isLiquidated ? 0 : totalVolume,
          high: obj.high,
          low: obj.low,
          open: obj.open,
          close: obj.close,
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
        <rect
          fill="#440154"
          height={containersHeight > 0 ? containersHeight - 50 : 0}
          width={containerWidth > 0 ? containerWidth - 40 : 0}
        />

        <BarChart
          data={heatmapData}
          x={x}
          y={y}
          width={containerWidth}
          height={containersHeight}
        />
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
