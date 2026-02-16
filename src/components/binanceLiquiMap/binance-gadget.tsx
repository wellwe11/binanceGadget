import { useMemo } from "react";
import Gradient from "./components/gradient";
import HeatMap from "./components/Heatmap";
import LiquidationMap from "./components/liquidationMap/liquidationMap";
import Nav from "./components/nav/nav";
import TimeLapsChart from "./components/timeLapsChart/timeLapsChart";
import generateHeatmapData from "./generateData";
import getMinMaxFromArr from "./functions/getMinMaxFromArr";
import sortDataIntoBuckets from "./functions/sortDataIntoBuckets";

const BinanceGadget = () => {
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
    <div className="flex flex-col pt-5 pl-1 w-240 h-170">
      <div className="bg-gray-950">
        <Nav
          symbol={placeholderCurrencies}
          pair={placeholderPairs}
          time={times}
        />
      </div>

      <div className="flex-1 flex bg-black">
        <div className="w-8 h-full">
          {/* Need to calculate max and add it to Gradient max={number} */}
          <Gradient />
        </div>

        <div
          className="h-30 w-full flex flex-col flex-1"
          style={{ border: "1px solid black" }}
        >
          <TimeLapsChart data={data} />
        </div>

        <HeatMap />
        <LiquidationMap data={binnedData} />
      </div>
    </div>
  );
};

export default BinanceGadget;
