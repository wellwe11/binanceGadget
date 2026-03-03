import React, { useMemo, useState, Activity, useEffect, useRef } from "react";

import * as d3 from "d3";

import Gradient from "./components/gradient";
import HeatMap from "./components/heatmap/heatmap";
import LiquidationMap from "./components/liquidationMap/liquidationMap";
import Nav from "./components/nav/nav";
import TimeLapsChart from "./components/timeLapsChart/timeLapsChart";
import generateHeatmapData from "./generateData";
import getMinMaxFromArr from "./functions/getMinMaxFromArr";
import getCombinedHeatmapData from "./functions/getCombinedHeatmapData";

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

  const zoomSource = useRef(null);

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

  const times = useMemo(
    () => ({
      "24 hour": { days: 1 },
      "48 hour": { days: 2 },
      "3 day": { days: 3 },
      "1 week": { days: 7 },
      "2 week": { days: 14 },
      "1 month": { days: 29 },
      "3 month": { days: 87 },
      "6 month": { days: 182 },
      "1 year": { days: 365 },
    }),
    [],
  );
  const NUM_BUCKETS = 300;

  const data = useMemo(
    () => generateHeatmapData(["BITCOIN"], NUM_BUCKETS),
    [placeholderCurrencies],
  );

  const reversedData = useMemo(() => data.toReversed(), [data]);

  // Min/Max values (value of coin)
  const { min, max } = useMemo(() => getMinMaxFromArr(data), [data]);

  // Adjust max/min padding, so graph has some space between top/bottom and highest/lowest value
  const pricePadding = (max.value - min.value) * 0.3;
  const paddedMin = min.value - pricePadding;
  const paddedMax = max.value + pricePadding;

  const processedData = useMemo(
    () => getCombinedHeatmapData(data, paddedMin, paddedMax, NUM_BUCKETS),
    [data, paddedMin, paddedMax, NUM_BUCKETS],
  );

  return (
    <div className="flex flex-col pt-5 pl-1 w-fit h-full bg-black">
      <div className="bg-gray-950">
        <Nav
          symbol={placeholderCurrencies}
          pair={placeholderPairs}
          time={times}
          displayMap={setDisplayLiquidationMap}
          setColorTheme={setColorTheme}
          setThreshold={setThreshold}
          threshold={threshhold}
          showCharts={showCharts}
          setShowCharts={setShowCharts}
        />
      </div>

      <div className="flex w-fit">
        <div className="w-10 mb-4 -mt-8.5" style={{ height: "inherit" }}>
          <Gradient
            max={processedData.totalVolume}
            colorTheme={colorTheme.name}
            threshhold={threshhold}
          />
        </div>

        <div className="flex w-screen">
          <div className="ml-2 w-250 h-175">
            <HeatMap
              colorTheme={colorTheme}
              threshhold={threshhold}
              heatmapData={processedData.cellGrid}
              maxVol={processedData.maxVolume}
              rawData={data}
              min={paddedMin}
              max={paddedMax}
              numBuckets={NUM_BUCKETS}
              showCharts={showCharts}
              transform={transform}
              setTransform={setTransform}
              zoomSource={zoomSource}
            />
          </div>

          <Activity mode={displayLiquidationMap ? "visible" : "hidden"}>
            <div className="w-75 h-175">
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
        className="ml-15 h-30 w-240 flex flex-col flex-1"
        style={{ border: "1px solid black" }}
      >
        <TimeLapsChart
          data={reversedData}
          transform={transform}
          setTransform={setTransform}
          zoomSource={zoomSource}
        />
      </div>
    </div>
  );
};

export default BinanceGadget;
