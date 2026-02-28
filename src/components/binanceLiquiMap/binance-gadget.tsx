import { useMemo, useState, Activity } from "react";

import * as d3 from "d3";

import Gradient from "./components/gradient";
import HeatMap from "./components/heatmap/heatmap";
import LiquidationMap from "./components/liquidationMap/liquidationMap";
import Nav from "./components/nav/nav";
import TimeLapsChart from "./components/timeLapsChart/timeLapsChart";
import generateHeatmapData from "./generateData";
import getMinMaxFromArr from "./functions/getMinMaxFromArr";
import sortDataIntoBuckets from "./functions/sortDataIntoBuckets";

// Abstract to top-layer
// Create a global bucket-size so that graphs match each others layout
// Create a global "visible data" so that graphs show same data-start&end-points
// Global 'start' and 'end' point for data so that user can 'zoom' in with timeLapsChart

const BinanceGadget = () => {
  const [displayLiquidationMap, setDisplayLiquidationMap] = useState(false);
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

  const data = useMemo(
    () => generateHeatmapData(["BITCOIN"]),
    [placeholderCurrencies],
  );

  const liquidationMapData = useMemo(() => {
    const flattedData = data.flatMap((d) => d.liquidations);

    const topPrice = Math.round(d3.max(data, (d) => d.value)) || 0;

    const buckets = 200;
    const bucketSize = topPrice / buckets;
    const map = {};

    for (let i = 1; i <= buckets; i++) {
      const bucketPrice = Math.round(i * bucketSize);
      map[bucketPrice] = { price: bucketPrice, volume: 0 };
    }

    flattedData.forEach((d) => {
      const closestBucket = Math.round(d.price / bucketSize) * bucketSize;
      const roundedBucket = Math.round(closestBucket);

      if (map[roundedBucket]) {
        map[roundedBucket].volume += d.volume;
      }
    });

    return {
      currentPrice: data[data.length - 1].value,
      prices: Object.values(map),
    };
  }, [data]);

  // Need to handle data-filtering in this component, so that LiquidationMap AND Heatmap both use the exact same data
  // Filter away longs from above price, and shorts from below price
  // Filter away objects that clash with current price
  // Filter away objects that extend beyond x/y

  const { min, max } = useMemo(() => getMinMaxFromArr(data), [data]);

  const binnedData = useMemo(() => sortDataIntoBuckets(data), [data]);

  return (
    <div className="flex flex-col pt-5 pl-1 w-fit h-full bg-black">
      <div className="bg-gray-950">
        <Nav
          symbol={placeholderCurrencies}
          pair={placeholderPairs}
          time={times}
          displayMap={setDisplayLiquidationMap}
        />
      </div>

      <div className="flex w-fit">
        <div className="w-10 mb-4 -mt-8.5" style={{ height: "inherit" }}>
          {/* Need to calculate max and add it to Gradient max={number} */}
          <Gradient />
        </div>

        <div className="flex w-screen">
          <div className="ml-2 w-250 h-175">
            <HeatMap data={data} />
          </div>

          <Activity mode={displayLiquidationMap ? "visible" : "hidden"}>
            <div className="w-75 h-175">
              <LiquidationMap
                data={data}
                liquidationMapData={liquidationMapData}
              />
            </div>
          </Activity>
        </div>
      </div>

      <div
        className="ml-15 h-30 w-240 flex flex-col flex-1"
        style={{ border: "1px solid black" }}
      >
        <TimeLapsChart data={data.toReversed()} />
      </div>
    </div>
  );
};

export default BinanceGadget;
