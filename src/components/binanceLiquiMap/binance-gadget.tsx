import { useMemo, useState, Activity, useRef, useEffect } from "react";

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

// Add dotted lines to heatmap so when liquidation leverage is disabled, you see them for each price

// hide white dot on drag
// hide tooltip on drag

// fix so squares dont look so 'squary' - currently have some outline on them. (barChart)

// fix white square so it hovers on mouse-top

// timelapschart 'lags' when you open liquidation map,
// Tie timeLapsChart to heatmap ??

// Add zoom to y-axis (check jens graph)

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

  useEffect(() => {
    setTransform({ x: 1, y: 0, k: 0 });
  }, [data]);

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

  if (!data) return;

  return (
    <div className="flex flex-col pt-5 pl-1 h-250 min-w-10 min-h-10 w-full max-w-360 bg-black overflow-hidden select-none">
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
        <div className="flex gap-5" style={{ height: "90%" }}>
          <div
            style={{
              width: "5%",
              maxWidth: "50px",
              marginBottom: "-17px",
              marginTop: "-17px",
            }}
          >
            <Gradient
              max={processedData.totalVolume}
              colorTheme={colorTheme.name}
            />
          </div>

          <div className="flex gap-10" style={{ width: "90%", height: "100%" }}>
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
          className="flex w-full gap-5 "
          style={{ height: "10%" }}
          key={refreshGraph}
        >
          <div
            className="mb-4 -mt-8.5"
            style={{ height: "inherit", width: "5%", maxWidth: "50px" }}
          />

          <div className="flex" style={{ width: "90%" }}>
            <div
              style={{
                width: !displayLiquidationMap ? "100%" : "74%",
              }}
            >
              <Activity
                mode={showCharts.includes("Supercharts") ? "visible" : "hidden"}
              >
                <TimeLapsChart
                  key={days + coin}
                  data={reversedData}
                  transform={transform}
                  setTransform={setTransform}
                  zoomSource={zoomSource}
                />
              </Activity>
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
