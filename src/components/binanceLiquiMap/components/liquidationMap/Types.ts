import * as d3 from "d3";

export interface XYType {
  data: accumulatedType[];
  x: d3ScaleLinear;
  y: d3Range;
}

export interface AxisType {
  children: React.ReactNode;
  shorts: List[];
  longs: List[];
  xBars: d3ScaleLinear;
  height: number;
}

export interface DottedLine {
  data: number;
  height: number;
  x?: d3ScaleLinear;
  opacity?: string;
}

export type DataType = {
  price: number;
  shortVol: number;
  longVol: number;
};

export type d3ScaleLinear = d3.ScaleLinear<number, number>;
export type d3Range = d3.scaleBand<string>;

export type List = {
  price: number;
  vol: number;
};

export type accumulatedType = List & { accumulatedVol: number };
