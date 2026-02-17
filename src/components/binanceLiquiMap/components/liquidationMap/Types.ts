import * as d3 from "d3";

export type DataType = {
  price: number;
  shortVol: number;
  longVol: number;
};

export type d3ScaleLinear = d3.ScaleLinear<number, number>;
export type d3Range = d3.scaleBand<string>;

export interface XYType {
  data: accumulatedType[];
  x: d3ScaleLinear;
  y: d3Range;
}

export type List = {
  price: number;
  vol: number;
};

export type accumulatedType = List & { accumulatedVol: number };
