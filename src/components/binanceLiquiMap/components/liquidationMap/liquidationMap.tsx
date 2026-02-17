import * as d3 from "d3";

import Axis from "./components/axis";
import BarChart from "./components/barChart";
import AreaChart from "./components/areaChart";
import ListeningRect from "./components/listeningRect";

import filterByType from "./functions/filterByType";

const LiquidationMap = ({ data }) => {
  const margin = { top: 70, right: 40, bottom: 60, left: 175 },
    width = 700 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  // Filter data by type (i.e. long, short)
  const filteredData = filterByType(data);
  const currentPrice = 500; // Placeholder for stale data. It will be the start-point for both graphs showing longs/shorts

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
      <BarChart data={accumulatedShorts} x={xBars} y={y} max={max} />
      <AreaChart data={accumulatedShorts} x={x} y={y} color="#00f2ff" />

      <BarChart data={accumulatedLongs} x={xBars} y={y} max={max} />
      <AreaChart data={accumulatedLongs} x={x} y={y} color="#ff0000" />

      <ListeningRect
        data={accumulatedShorts.toReversed().concat(accumulatedLongs)}
        x={x}
        xBars={xBars}
        y={y}
        currentPrice={currentPrice}
        max={max}
      />
    </Axis>
  );
};

export default LiquidationMap;
