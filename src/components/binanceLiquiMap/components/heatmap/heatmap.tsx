import React, {
  Activity,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import * as d3 from "d3";

import Axis from "./components/axis";

import Tooltip from "./components/tooltip/tooltip";

import CandleChart from "./components/candleChart";
import ListeningRect from "./components/listeningRect";
import BarChart from "./components/barChart";
import Coin360Svg from "../../../../assets/coin360";
import {
  CoinOnDateType,
  ColorTheme,
  d3Date,
  d3LinearNumber,
  GeneratedDataType,
  HeatmapDataType,
} from "../../types";

const CandleAndHoverComponent = React.memo(
  ({
    heatmapData,
    candleData,
    x,
    y,
    min,
    max,
    mapMin,
    mapMax,
    numBuckets,
    maxVol,
    threshold,
    colorTheme,
    showCharts,
  }: {
    heatmapData: HeatmapDataType;
    candleData: GeneratedDataType[];
    x: d3Date;
    y: d3LinearNumber;
    min: number;
    max: number;
    mapMin: number;
    mapMax: number;
    numBuckets: number;
    maxVol: number;
    threshold: number;
    colorTheme: ColorTheme;
    showCharts: string[];
  }) => {
    const rafRef = useRef<number | null>(null);
    const activeCellRef = useRef<GeneratedDataType | CoinOnDateType | null>(
      null,
    );

    const [activeCell, setActiveCell] = useState<
      CoinOnDateType | GeneratedDataType | null
    >(null);

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const [hideHighlight, setHideHighlight] = useState(false);
    const [hideToolTip, setHideToolTip] = useState(false);
    const [mouseOut, setMouseOut] = useState(true);

    const xDomain = useMemo(() => x.domain(), [x, candleData.length, min, max]);
    const yDomain = useMemo(() => y.domain(), [min, max, y, candleData.length]);

    const handleHover = useCallback(
      (event: React.MouseEvent) => {
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

          // If user hovers a candle
          if (hideHighlight) {
            const cell = candleData[clampedIndex];

            if (cell !== activeCellRef.current) {
              activeCellRef.current = cell;

              setActiveCell(cell);
            }
          } else {
            const rawPrice = y.invert(mouseY);

            // If user is scrolling outside of CandleChart, we need to update price/date so that tooltip still shows some data
            if (rawPrice < mapMin || rawPrice > mapMax) {
              const customCell = {
                date: date,
                price: rawPrice,
              };

              setActiveCell(customCell);
            } else {
              const priceStep = (mapMax - mapMin) / numBuckets;
              const idx = Math.floor((rawPrice - mapMin) / priceStep);
              const clampedIdx = Math.max(0, Math.min(numBuckets - 1, idx));
              const snappedPrice = mapMin + clampedIdx * priceStep;
              const cell = heatmapData.get(
                `${date}-${snappedPrice.toFixed(4)}`,
              );

              if (cell) {
                const isNewDate = cell.date !== activeCellRef.current?.date;
                const isNewPrice =
                  activeCellRef.current?.price !== undefined &&
                  cell.price !== activeCellRef.current?.price;

                if (isNewDate || isNewPrice) {
                  activeCellRef.current = cell;
                  setActiveCell(cell);
                }
              }
            }
          }
        });
      },
      [heatmapData, yDomain, xDomain, numBuckets, min, max],
    );

    return (
      <g className="CandleAndHoverComponent">
        <Activity mode={showCharts.length > 0 ? "visible" : "hidden"}>
          <ListeningRect
            y={y}
            x={x}
            handleHover={handleHover}
            activeCell={activeCell}
            hideHighlight={hideHighlight}
            setMouseOut={setMouseOut}
            mouseOut={mouseOut}
            numBuckets={numBuckets}
            setHideToolTip={setHideToolTip}
            hideToolTip={hideToolTip}
          />
        </Activity>

        <Activity
          mode={showCharts.includes("Supercharts") ? "visible" : "hidden"}
        >
          <CandleChart
            data={candleData}
            x={x}
            y={y}
            handleHover={handleHover}
            setHideHighlight={setHideHighlight}
          />
        </Activity>

        <Activity
          mode={
            (mouseOut && !hideHighlight) || hideToolTip ? "hidden" : "visible"
          }
        >
          <Tooltip
            mousePos={mousePos}
            activeCell={activeCell}
            x={x}
            y={y}
            hideHighlight={hideHighlight}
            max={maxVol}
            threshold={threshold}
            colorTheme={colorTheme}
          />
        </Activity>
      </g>
    );
  },
);

const HeatMap = ({
  heatmapData,
  visibleData,
  min,
  max,
  mapMin,
  mapMax,
  numBuckets,
  maxVol,
  colorTheme,
  threshold,
  showCharts,
  zoomRef,
  containerWidth,
  containersHeight,
  activeDays,
  onYAxisDrag,
  transform,
}: {
  heatmapData: HeatmapDataType;
  visibleData: GeneratedDataType[];
  min: number;
  max: number;
  numBuckets: number;
  maxVol: number;
  colorTheme: ColorTheme;
  threshold: number;
  showCharts: string[];
  zoomRef: React.RefObject<SVGGElement | null>;
  containerWidth: number;
  containersHeight: number;
  activeDays: number;
  onYAxisDrag: (delta: number) => void;
}) => {
  const x = useMemo(() => {
    return d3
      .scaleBand()
      .domain(visibleData.map((d) => d.date))
      .range([0, containerWidth]);
  }, [visibleData, containerWidth, min, max]);

  const y = useMemo(() => {
    return d3.scaleLinear().domain([min, max]).range([containersHeight, 0]);
  }, [min, max, containersHeight]);

  if (!visibleData || visibleData.length < 1) return;

  return (
    <div
      style={{
        width: "inherit",
        height: "inherit",
        position: "relative",
      }}
    >
      <div
        className="w-50 pointer-events-none"
        style={{
          position: "absolute",
          left: `${containerWidth}px`,
          top: `${containersHeight}px`,
          transform: "translate(-13rem, -5rem)",
        }}
      >
        <Coin360Svg />
      </div>

      <Axis
        x={x}
        y={y}
        zoomAmount={Math.round(visibleData.length / 10)}
        activeDays={activeDays}
        data={visibleData}
        displayLines={!showCharts.includes("Liquidation Leverage")}
        onYAxisDrag={onYAxisDrag}
        transform={transform}
      >
        <g
          className="heatmapG"
          ref={zoomRef}
          width={x.range()[1] > 0 ? x.range()[1] : 0}
          height={y.range()[0] > 0 ? y.range()[0] : 0}
          x={x.range()[0]}
          y={y.range()[1]}
        >
          <Activity
            mode={
              showCharts.includes("Liquidation Leverage") ? "visible" : "hidden"
            }
          >
            <rect
              fill={colorTheme.color}
              width={x.range()[1] > 0 ? x.range()[1] : 0}
              height={y.range()[0] > 0 ? y.range()[0] : 0}
              x={x.range()[0]}
              y={y.range()[1]}
              z="-1"
            />

            <BarChart
              data={heatmapData}
              x={x}
              y={y}
              numBuckets={numBuckets}
              maxVol={maxVol}
              colorTheme={colorTheme}
              threshold={threshold}
            />

            <CandleAndHoverComponent
              candleData={visibleData}
              heatmapData={heatmapData}
              x={x}
              y={y}
              min={min}
              max={max}
              mapMin={mapMin}
              mapMax={mapMax}
              numBuckets={numBuckets}
              maxVol={maxVol}
              threshold={threshold}
              colorTheme={colorTheme}
              showCharts={showCharts}
            />
          </Activity>
        </g>
      </Axis>
    </div>
  );
};

export default HeatMap;
