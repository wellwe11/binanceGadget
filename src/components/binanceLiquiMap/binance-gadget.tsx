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

// Make it fit for smaller screens
// Fix types
// Upload to Vercel
// Send james

// Tie timeLapsChart to heatmap
const BinanceGadget = () => {
  const [displayLiquidationMap, setDisplayLiquidationMap] = useState(false);
  const [colorTheme, setColorTheme] = useState({
    name: "interpolateViridis",
    color: "#440154",
  });
  const [threshhold, setThreshold] = useState(() => 60);
  const [showCharts, setShowCharts] = useState<liquidationType[]>([
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

  const zoomRef = useRef(null);

  const placeholderCurrencies = useMemo(
    () => [
      "BTC",
      "ETH",
      "USDT",
      "BNB",
      "SOL",
      "XRP",
      "USDC",
      "ADA",
      "STETH",
      "AVAX",
      "DOGE",
      "DOT",
      "TRX",
      "LINK",
      "WBTC",
      "MATIC",
      "SHIB",
      "TON",
      "DAI",
      "LTC",
      "BCH",
      "UNI",
      "LEO",
      "NEAR",
      "OP",
      "APT",
      "ARB",
      "XLM",
      "OKB",
      "LDO",
    ],
    [],
  );

  const placeholderPairs = useMemo(
    () => [
      "Binance BTC/USDT Perpetual",
      "Gate BTC/USDT Perpetual",
      "Bybit BTC/USDT Perpetual",
      "MEXC BTC/USDT Perpetual",
      "OKX BTC/USDT Perpetual",
      "HTX BTC/USDT Perpetual",
      "BINGX BTC/USDT Perpetual",
      "Binance BTC/USDT Perpetual",
      "Hyperliquid BTC/USDT Perpetual",
      "WhiteBIT BTC/USDT Perpetual",
      "Deribit BTC/USDT Perpetual",
      "Bitget BTC/USDT Perpetual",
      "OKX BTC/USDT Perpetual",
      "Binance BTC/USDT Perpetual",
      "Bybit BTC/USDT Perpetual",
      "Bitfinex BTC/USDT Perpetual",
      "LBank BTC/USDT Perpetual",
    ],
    [],
  );
  const [pairOrSymbol, setPairOrSymbol] = useState(placeholderPairs);

  const times = useMemo(
    () => ({
      "12 hour": 0.5,
      "24 hour": 1,
      "48 hour": 2,
      "3 day": 3,
      "1 week": 7,
      "2 week": 14,
      "1 month": 29,
      "3 month": 87,
      "6 month": 182,
      "1 year": 365,
    }),
    [],
  );

  const handleSetPairOrSymbol = (e) => {
    const pairOrSymbolArr = [placeholderPairs, placeholderCurrencies];
    setActiveCoin(0);
    setPairOrSymbol(pairOrSymbolArr[e]);
  };

  const coin = pairOrSymbol[activeCoin];

  const activeDays = Object.values(times)[days];
  const NUM_BUCKETS = 200;

  const data = useMemo(
    () => generateHeatmapData(["BITCOIN"], activeDays),
    [placeholderCurrencies, refreshGraph, activeDays, coin],
  );

  const reversedData = useMemo(() => data.toReversed(), [data, activeDays]);

  // Min/Max values (value of coin)
  const { min, max } = useMemo(
    () => getMinMaxFromArr(data),
    [data, activeDays],
  );

  // Adjust max/min padding, so graph has some space between top/bottom and highest/lowest value
  const pricePadding = (max.value - min.value) * 0.3;
  const paddedMin = min.value - pricePadding;
  const paddedMax = max.value + pricePadding;

  const processedData = useMemo(
    () => getCombinedHeatmapData(data, paddedMin, paddedMax, NUM_BUCKETS),
    [data, paddedMin, paddedMax, NUM_BUCKETS, activeDays],
  );

  if (!data) return;

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

  return (
    <div className="flex flex-col pt-5 pl-1 h-250 w-[70vw]  bg-black">
      <div className="bg-gray-950 flex" style={{ height: "35%" }}>
        <Nav
          time={Object.keys(times)}
          displayMap={setDisplayLiquidationMap}
          setColorTheme={setColorTheme}
          setThreshold={setThreshold}
          threshold={threshhold}
          showCharts={showCharts}
          setShowCharts={setShowCharts}
          setRefreshGraph={setRefreshGraph}
          setDays={setDays}
          setActiveCoin={setActiveCoin}
          pairOrSymbol={pairOrSymbol}
          setPairOrSymbol={handleSetPairOrSymbol}
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
              threshhold={threshhold}
            />
          </div>

          <div className="flex" style={{ width: "95%" }}>
            <div
              ref={containerRef}
              style={{
                width: !displayLiquidationMap ? "100%" : "80%",
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
                threshhold={threshhold}
                showCharts={showCharts}
                zoomRef={zoomRef}
                containerWidth={containerWidth}
                containersHeight={containersHeight}
                activeDays={activeDays}
              />
            </div>

            <Activity mode={displayLiquidationMap ? "visible" : "hidden"}>
              <div style={{ width: "19%", height: "100%" }}>
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
            <div style={{ width: !displayLiquidationMap ? "100%" : "80%" }}>
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
                width: !displayLiquidationMap ? "0%" : "20%",
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
