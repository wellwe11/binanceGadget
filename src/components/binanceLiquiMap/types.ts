import * as d3 from "d3";

export type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

export type ColorTheme = {
  name: string;
  color: string;
};

export type LiquidationType = {
  price: number;
  volume: number;
  type: string;
};

export type AggregatedBarType = {
  price: number;
  volume: number;
};

export type AccumulatedVol = AggregatedBarType & {
  accumulatedVol: number;
};

export type CoinOnDateType = {
  date: Date;
  coin: string;
  value: number;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  liquidations: LiquidationType[];
  price: number;
};

// Remove this OR simply make it fit into fetched data when fetching data from API
export type GeneratedDataType = {
  date: Date;
  coin: string;
  value: number;
  open: number;
  close: number;
  high: number;
  low: number;
  liquidations: LiquidationType[];
};

export type HeatmapDataType = Map<String, CoinOnDateType>;

export type d3Date = d3.scaleBand<Date>;
export type d3LinearNumber = d3.scaleLienar<number, number>;
export type d3Band = d3.scaleBand<string>;

export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;

export type GraphMargins = {
  start: number;
  end: number;
};

export type SVGRectClickEvent = React.MouseEvent<SVGRectElement>;

export type TransformType = {
  k: number;
  x: number;
  y: number;
};
