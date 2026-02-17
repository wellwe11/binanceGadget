import { useMemo, useState, Activity } from "react";
import Gradient from "./components/gradient";
import HeatMap from "./components/Heatmap";
import LiquidationMap from "./components/liquidationMap/liquidationMap";
import Nav from "./components/nav/nav";
import TimeLapsChart from "./components/timeLapsChart/timeLapsChart";
import generateHeatmapData from "./generateData";
import getMinMaxFromArr from "./functions/getMinMaxFromArr";
import sortDataIntoBuckets from "./functions/sortDataIntoBuckets";

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

  const { min, max } = useMemo(() => getMinMaxFromArr(data), [data]);

  const binnedData = useMemo(() => sortDataIntoBuckets(data), [data]);

  return (
    <div className="flex flex-col pt-5 pl-1 w-max h-full bg-black">
      <div className="bg-gray-950">
        <Nav
          symbol={placeholderCurrencies}
          pair={placeholderPairs}
          time={times}
          displayMap={setDisplayLiquidationMap}
        />
      </div>

      <div className="flex w-max">
        <div className="w-10" style={{ height: "inherit" }}>
          {/* Need to calculate max and add it to Gradient max={number} */}
          <Gradient />
        </div>

        <div className="flex w-250">
          <div className="w-50 h-100">
            <h1>PLACEHOLDER</h1>
            <HeatMap />
          </div>

          <Activity mode={displayLiquidationMap ? "visible" : "hidden"}>
            <div className="w-100 h-full">
              <LiquidationMap data={binnedData} valMax={max} />
            </div>
          </Activity>
        </div>
      </div>

      <div
        className="h-30 w-150 flex flex-col flex-1"
        style={{ border: "1px solid black" }}
      >
        <TimeLapsChart data={data} />
      </div>
    </div>
  );
};

export default BinanceGadget;
