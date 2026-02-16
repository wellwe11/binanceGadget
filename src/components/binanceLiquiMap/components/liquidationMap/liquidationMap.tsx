import * as d3 from "d3";
import { useRef } from "react";
import filterByType from "./functions/filterByType";
import Axis from "./components/axis";
import BarChart from "./components/barChart";

const AreaChart = ({ data, x, y }) => {
  const gRef = useRef(null);
  const pathRef = useRef(null);
  const line = d3
    .line()
    .x((d) => x(d.price))
    .y((d) => y(d.vol));

  const area = d3
    .area()
    .y((d) => y(d.price) + y.bandwidth() / 2)
    .x0(40)
    .x1((d) => x(d.accumulatedVol) + 40)
    .curve(d3.curveBasis);

  return (
    <g ref={gRef}>
      <path ref={pathRef} d={area(data)} fill="#85bb65" opacity="0.5" />
    </g>
  );
};

const LiquidationMap = ({ data }) => {
  const margin = { top: 70, right: 40, bottom: 60, left: 175 },
    width = 400 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

  // Filter data by type (i.e. long, short)
  const filteredData = filterByType(data);
  const currentPrice = 2100; // Placeholder for stale data. It will be the start-point for both graphs showing longs/shorts

  // Filter away shorts that are below currentPrice
  const filteredShorts = Object.values(filteredData.short).filter(
    (d) => d.price > currentPrice,
  );

  // Filter longs that are above current price
  const filteredLongs = Object.values(filteredData.long).filter(
    (d) => d.price < currentPrice,
  );

  // Accumulate data vol += vol
  const areaData = (d) => {
    let totalVol = 0;
    const calcTotal = [];

    d.forEach((i) => {
      const vol = i.vol;
      totalVol += vol;

      calcTotal.push({ ...i, accumulatedVol: totalVol });
    });

    return calcTotal;
  };

  // Area data
  const accumulatedShorts = areaData(filteredShorts);
  const accumulatedLongs = areaData(filteredLongs.toReversed());

  // Define highest referal-point for VOL (x)
  const maxVol = d3.max(
    [
      accumulatedShorts[accumulatedShorts.length - 1],
      accumulatedLongs[accumulatedLongs.length - 1],
    ].flat(),
    (d) => d.accumulatedVol,
  );

  // Define highest referal-point for PRICE (xBars)
  const max = d3.max(
    [accumulatedShorts, accumulatedLongs].flat(),
    (e) => e.vol,
  );

  const x = d3.scaleLinear().range([0, width]).domain([0, maxVol]);

  const xBars = d3
    .scaleLinear()
    .range([0, width * 0.8])
    .domain([0, max]);

  const y = d3
    .scaleBand()
    .range([height, 0])
    .padding(0.1)
    .domain(data.map((d) => d.price));

  return (
    <Axis
      height={height}
      width={width}
      margin={margin}
      x={x}
      y={y}
      xBars={xBars}
    >
      <BarChart data={accumulatedShorts} x={xBars} y={y} />
      <AreaChart data={accumulatedShorts} x={x} y={y} />

      <BarChart data={accumulatedLongs} x={xBars} y={y} />
      <AreaChart data={accumulatedLongs} x={x} y={y} />
    </Axis>
  );
};

export default LiquidationMap;
