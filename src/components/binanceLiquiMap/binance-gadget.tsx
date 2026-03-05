import { useMemo, useState, Activity, useRef } from "react";

import * as d3 from "d3";

import Gradient from "./components/gradient";
import HeatMap from "./components/heatmap/heatmap";
import LiquidationMap from "./components/liquidationMap/liquidationMap";
import Nav from "./components/nav/nav";
import TimeLapsChart from "./components/timeLapsChart/timeLapsChart";
import generateHeatmapData from "./generateData";
import getMinMaxFromArr from "./functions/getMinMaxFromArr";
import getCombinedHeatmapData from "./functions/getCombinedHeatmapData";
import useZoom from "./hooks/useZoom";
import useTrackContainerSize from "./hooks/useTrackContainerSize";
import {
  NUM_BUCKETS,
  placeholderCurrencies,
  placeholderPairs,
  times,
} from "./constants";

// Tie timeLapsChart to heatmap
const BinanceGadget = () => {
  const [displayLiquidationMap, setDisplayLiquidationMap] = useState(
    () => false,
  );
  const [colorTheme, setColorTheme] = useState({
    name: "interpolateViridis",
    color: "#440154",
  });
  const [threshold, setThreshold] = useState(() => 60);
  const [showCharts, setShowCharts] = useState([
    "Liquidation Leverage",
    "Supercharts",
  ]);
  const [transform, setTransform] = useState(() => d3.zoomIdentity);
  const [refreshGraph, setRefreshGraph] = useState(0);

  const zoomSource = useRef(null);
  const [days, setDays] = useState(0);

  const containerRef = useRef(null);
  const [containerWidth, containersHeight] =
    useTrackContainerSize(containerRef);

  const [activeCoin, setActiveCoin] = useState(0);

  const zoomRef = useRef<SVGGElement | null>(null);

  const [pairOrSymbol, setPairOrSymbol] = useState(placeholderPairs);

  const handleActiveCoin = (n: number) => setActiveCoin(n);

  const handleSetPairOrSymbol = (n: number) => {
    const pairOrSymbolArr = [placeholderPairs, placeholderCurrencies];
    setActiveCoin(0);
    setPairOrSymbol(pairOrSymbolArr[n]);
  };

  const coin = pairOrSymbol[activeCoin];

  const activeDays = Object.values(times)[days];

  // IN future, update BITCOIN to be/fetch 'coin'
  const data = useMemo(
    () => generateHeatmapData(["BITCOIN"], activeDays),
    [placeholderCurrencies, refreshGraph, activeDays, coin],
  );

  const reversedData = useMemo(() => data.toReversed(), [data, activeDays]);

  // Min/Max values (value of coin)
  const { min, max } = useMemo(() => getMinMaxFromArr(data), [data]);

  // Controls data when zooming
  const { visibleData } = useZoom(
    data,
    zoomRef,
    containerWidth,
    containersHeight,
    transform,
    setTransform,
    zoomSource,
  );

  if (!min || !max) return;

  // Adjust max/min padding, so graph has some space between top/bottom and highest/lowest value
  const pricePadding = (max.value - min.value) * 0.3;
  const paddedMin = min.value - pricePadding;
  const paddedMax = max.value + pricePadding;

  const processedData = useMemo(
    () => getCombinedHeatmapData(data, paddedMin, paddedMax, NUM_BUCKETS),
    [data, paddedMin, paddedMax, activeDays],
  );

  console.log(processedData.aggregateBar, data);

  if (!data) return;

  return (
    <div className="flex flex-col pt-5 pl-1 h-250 min-w-10 min-h-10 w-full max-w-360  bg-black">
      <div className="bg-gray-950 flex" style={{ height: "35%" }}>
        <Nav
          times={Object.keys(times)}
          displayMap={setDisplayLiquidationMap}
          setColorTheme={setColorTheme}
          setThreshold={setThreshold}
          threshold={threshold}
          showCharts={showCharts}
          setShowCharts={setShowCharts}
          setRefreshGraph={setRefreshGraph}
          setDays={setDays}
          pairOrSymbol={pairOrSymbol}
          setPairOrSymbol={handleSetPairOrSymbol}
          setActiveCoin={handleActiveCoin}
          activeCoin={coin}
        />
      </div>

      <div style={{ height: "65%" }} className="flex flex-col justify-between ">
        <div className="flex gap-2.5" style={{ height: "95%" }}>
          <div
            className="mb-4 -mt-8.5"
            style={{ width: "5%", maxWidth: "50px" }}
          >
            <Gradient
              max={processedData.totalVolume}
              colorTheme={colorTheme.name}
            />
          </div>

          <div className="flex" style={{ width: "95%" }}>
            <div
              ref={containerRef}
              style={{
                width: !displayLiquidationMap ? "100%" : "74%",
                height: "100%",
              }}
            >
              <HeatMap
                heatmapData={processedData.cellGrid}
                visibleData={visibleData}
                min={paddedMin}
                max={paddedMax}
                numBuckets={NUM_BUCKETS}
                maxVol={processedData.maxVolume}
                colorTheme={colorTheme}
                threshold={threshold}
                showCharts={showCharts}
                zoomRef={zoomRef}
                containerWidth={containerWidth}
                containersHeight={containersHeight}
                activeDays={activeDays}
              />
            </div>

            <Activity mode={displayLiquidationMap ? "visible" : "hidden"}>
              <div style={{ width: "25%", height: "100%" }}>
                <LiquidationMap
                  colorTheme={colorTheme.name}
                  liquidationMapData={processedData.aggregateBar}
                  minPrice={paddedMin}
                  maxPrice={paddedMax}
                  currentPrice={processedData.currentPrice}
                />
              </div>
            </Activity>
          </div>
        </div>

        <div
          className="flex w-full gap-2.5"
          style={{ height: "10%" }}
          key={refreshGraph}
        >
          <div
            className="mb-4 -mt-8.5"
            style={{ height: "inherit", width: "5%", maxWidth: "50px" }}
          />

          <div style={{ width: "95%" }} className=" flex">
            <div style={{ width: !displayLiquidationMap ? "100%" : "74%" }}>
              <TimeLapsChart
                key={days + coin}
                data={reversedData}
                transform={transform}
                setTransform={setTransform}
                zoomSource={zoomSource}
              />
            </div>
            <div
              className=""
              style={{
                width: !displayLiquidationMap ? "0%" : "25%",
                height: "100%",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinanceGadget;
