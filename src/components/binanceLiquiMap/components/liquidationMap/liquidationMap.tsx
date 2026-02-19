import * as d3 from "d3";

import Axis from "./components/axis";
import BarChart from "./components/barChart";
import AreaChart from "./components/areaChart";
import ListeningRect from "./components/listeningRect";

import filterByType from "./functions/filterByType";
import { useMemo, useRef } from "react";
import useTrackContainerSize from "../../hooks/useTrackContainerSize";
import accumulateVal from "./functions/accumulateVal";

import { DataType, accumulatedType } from "./Types";

const LiquidationMap = ({ data }: { data: DataType[] }) => {
  const containerRef = useRef(null);
  const [containerWidth, containersHeight] =
    useTrackContainerSize(containerRef);

  // Filter data by type (i.e. long, short)
  const filteredData = useMemo(() => filterByType(data), []);

  const currentPrice = data[0].value; // Placeholder for stale data. It will be the start-point for both graphs showing longs/shorts

  // Filter away shorts that are below currentPrice
  const filteredShorts = useMemo(
    () =>
      filteredData.short
        .sort((a, b) => a.price - b.price)
        .filter((d) => d.price > currentPrice),
    [filteredData],
  );

  // Filter longs that are above current price
  const filteredLongs = useMemo(
    () => filteredData.long.filter((d) => d.price < currentPrice),
    [],
  ).sort((a, b) => b.price - a.price);

  // Area data
  const accumulatedShorts = accumulateVal(filteredShorts);
  const accumulatedLongs = accumulateVal(filteredLongs);

  console.log(filteredShorts);

  const sortedData = [
    ...accumulatedShorts.toReversed().concat(...accumulatedLongs),
  ];

  // Define highest referal-point for VOL (x)
  const maxVol = d3.max(
    [
      accumulatedShorts?.[accumulatedShorts.length - 1] || 0,
      accumulatedLongs?.[accumulatedLongs.length - 1] || 0,
    ].flat(),
    (d: accumulatedType) => d.accumulatedVol,
  );

  // Define referal-point for PRICE (xBars)
  const min = d3.min(sortedData, (d) => d.price);
  const max = d3.max(sortedData, (d) => d.vol);

  const xAreaReversed = d3
    .scaleLinear()
    .range([0, containerWidth])
    .domain([maxVol, 0]);

  const x = d3.scaleLinear().range([0, containerWidth]).domain([0, maxVol]);

  const xBars = d3
    .scaleLinear()
    .range([0, containerWidth * 0.8])
    .domain([0, max]);

  const y = d3
    .scaleBand()
    .range([0, containersHeight])
    .padding(0.1)
    .domain(sortedData.map((d) => d.price));

  return (
    <div ref={containerRef} style={{ width: "inherit", height: "inherit" }}>
      <Axis
        shorts={filteredShorts}
        longs={filteredLongs}
        xBars={xBars}
        height={containersHeight}
        width={containerWidth}
      >
        <BarChart data={accumulatedShorts} x={xBars} y={y} max={max} />
        <AreaChart data={accumulatedShorts} x={x} y={y} color="#00f2ff" />

        <BarChart data={accumulatedLongs} x={xBars} y={y} max={max} />
        <AreaChart data={accumulatedLongs} x={x} y={y} color="#ff0000" />

        <ListeningRect
          data={sortedData}
          x={x}
          xBars={xBars}
          y={y}
          currentPrice={currentPrice}
          max={max}
          width={containerWidth}
          height={containersHeight}
        />
      </Axis>
    </div>
  );
};

export default LiquidationMap;
