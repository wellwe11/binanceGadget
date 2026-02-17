import * as d3 from "d3";

import Axis from "./components/axis";
import BarChart from "./components/barChart";
import AreaChart from "./components/areaChart";
import ListeningRect from "./components/listeningRect";

import filterByType from "./functions/filterByType";
import { useRef } from "react";
import useTrackContainerSize from "../../hooks/useTrackContainerSize";

// For next time:
// Make resizing DYNAMIC
// Abstract height/width function from timeLapsChart, and use it here as well.
// Fix types

const LiquidationMap = ({ data }) => {
  const containerRef = useRef(null);
  const [containerWidth, containersHeight] =
    useTrackContainerSize(containerRef);

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

  const x = d3.scaleLinear().range([0, containerWidth]).domain([0, maxVol]);

  const xBars = d3
    .scaleLinear()
    .range([0, containerWidth * 0.8])
    .domain([0, max]);

  const y = d3
    .scaleBand()
    .range([containersHeight, 0])
    .padding(0.1)
    .domain(data.map((d) => d.price));

  return (
    <div ref={containerRef} style={{ width: "inherit", height: "inherit" }}>
      <Axis>
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
          width={containerWidth}
        />
      </Axis>
    </div>
  );
};

export default LiquidationMap;
