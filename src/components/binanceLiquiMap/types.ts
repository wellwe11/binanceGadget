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
  price: number;
  volume: number;
  coin: string;
  open: number;
  close: number;
  high: number;
  low: number;
  value: number;
  liquidations: LiquidationType[];
};

export type HeatmapDataType = Map<String, CoinOnDateType>;

export type d3Date = d3.scaleBand<Date>;
export type d3LinearNumber = d3.scaleLienar<number, number>;

export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;

export type GraphMargins = {
  start: number;
  end: number;
};

export type SVGRectClickEvent = React.MouseEvent<SVGRectElement>;
