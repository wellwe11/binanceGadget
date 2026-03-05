// Nav
export const buttonColors = [
  { name: "interpolateViridis", baseColor: "#440154" }, // Purple > blue > green > yellow
  { name: "interpolatePlasma", baseColor: "#1a0b3b" }, // Black > purple > orange > yellow
  { name: "interpolateCividis", baseColor: "#111c2e" }, // Dark blue > yellow
  { name: "interpolateTurbo", baseColor: "#000033" }, // White > light yellow > blue > dark blue
];

// Nav
export const buttons = [
  {
    name: "Liquidation Leverage",
    color: "purple",
  },
  {
    name: "Supercharts",
    color: "green",
  },
] as const;

// Nav
export const Pair_SymbolButtons = ["Pair", "Symbol"];

// Binance-gadget
// Amount of squares visible on chart for y-angle
export const NUM_BUCKETS = 200;

// Binance-gadget
export const placeholderPairs = [
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
];

// Binance-gadget
export const placeholderCurrencies = [
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
];

// Binance-gadget
export const times = {
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
} as const;
