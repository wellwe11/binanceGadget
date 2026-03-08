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

const BinanceGadget = () => {
  const [displayLiquidationMap, setDisplayLiquidationMap] = useState(false);
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
  const [refreshGraph, setRefreshGraph] = useState(() => 0);
  const [days, setDays] = useState(0);
  const [activeCoin, setActiveCoin] = useState(0);
  const [pairOrSymbol, setPairOrSymbol] = useState(placeholderPairs);
  const [allowYDrag, setAllowYDrag] = useState(false);
  const [yMin, setYMin] = useState(0);
  const [yMax, setYMax] = useState(0);

  const zoomSource = useRef(null);
  const containerRef = useRef(null);
  const zoomRef = useRef<SVGGElement | null>(null);

  const [containerWidth, containersHeight] =
    useTrackContainerSize(containerRef);

  const coin = pairOrSymbol[activeCoin];
  const activeDays = Object.values(times)[days];

  const handleActiveCoin = (n: number) => setActiveCoin(n);

  const handleSetPairOrSymbol = (n: number) => {
    const pairOrSymbolArr = [placeholderPairs, placeholderCurrencies];
    setActiveCoin(0);
    setPairOrSymbol(pairOrSymbolArr[n]);
  };

  // IN future, update BITCOIN to be/fetch 'coin'
  const data = useMemo(
    () => generateHeatmapData(["BITCOIN"], activeDays),
    [placeholderCurrencies, days, coin],
  );

  // Min/Max values (value of coin)
  const { min, max } = useMemo(() => getMinMaxFromArr(data), [data]);

  const pricePadding = min && max ? (max.value - min.value) * 0.3 : 0;
  const paddedMin = min ? Math.max(1, min.value - pricePadding) : 0;
  const paddedMax = max ? max.value + pricePadding : 0;

  useEffect(() => {
    if (!paddedMin || !paddedMax) return;

    setTransform(d3.zoomIdentity);

    if (zoomRef.current) {
      d3.select(zoomRef.current).call(d3.zoom().transform, d3.zoomIdentity);
    }

    setYMin(paddedMin);
    setYMax(paddedMax);

    setAllowYDrag(false);
    setThreshold(60);
  }, [refreshGraph, days]);

  const handleGraphPanY = (deltaY: number) => {
    if (!allowYDrag) return;

    const priceRange = yMax - yMin;
    const pricePerPixel = priceRange / containersHeight;
    const priceChange = deltaY * pricePerPixel;

    setYMin((prev) => prev + priceChange);
    setYMax((prev) => prev + priceChange);
  };

  const onYAxisDrag = (deltaY) => {
    setAllowYDrag(true);
    const priceRange = yMax - yMin;
    const pricePerPixel = priceRange / containersHeight;
    const priceChange = deltaY * pricePerPixel;

    setYMin((prev) => prev + priceChange / 2);
    setYMax((prev) => prev - priceChange / 2);
  };

  // Controls data when zooming
  const { visibleData } = useZoom(
    data,
    zoomRef,
    containerWidth,
    containersHeight,
    transform,
    setTransform,
    zoomSource,
    handleGraphPanY,
    allowYDrag,
  );

  const processedData = useMemo(
    () => getCombinedHeatmapData(data, paddedMin, paddedMax, NUM_BUCKETS),
    [data, days],
  );

  const reversedData = useMemo(() => data.toReversed(), [data]);

  if (!paddedMin || !paddedMax || !data || !visibleData || !processedData)
    return null;

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

      <div style={{ height: "65%" }} className="flex flex-col justify-between">
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
                min={yMin}
                max={yMax}
                mapMin={paddedMin}
                mapMax={paddedMax}
                numBuckets={NUM_BUCKETS}
                maxVol={processedData.maxVolume}
                colorTheme={colorTheme}
                threshold={threshold}
                showCharts={showCharts}
                zoomRef={zoomRef}
                containerWidth={containerWidth}
                containersHeight={containersHeight}
                activeDays={activeDays}
                transform={transform}
                onYAxisDrag={onYAxisDrag}
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

        <div className="flex w-full gap-5 " style={{ height: "10%" }}>
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
                  key={coin + activeDays + days}
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
