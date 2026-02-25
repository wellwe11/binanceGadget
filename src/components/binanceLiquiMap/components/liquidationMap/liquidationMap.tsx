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

const LiquidationMap = ({ data, liquidationMapData }: { data: DataType[] }) => {
  const containerRef = useRef(null);
  const [containerWidth, containersHeight] =
    useTrackContainerSize(containerRef);

  // Starting-point for graphs
  const currentPrice = liquidationMapData.currentPrice; // Placeholder for stale data. It will be the start-point for both graphs showing longs/shorts

  // Filter data by type (i.e. long, short)
  const filteredData = useMemo(
    () => filterByType(liquidationMapData.prices, currentPrice),
    [liquidationMapData],
  );

  // Define referal-point for PRICE (xBars)
  const minPrice = d3.min(data, (d) => d.value);
  const maxPrice = d3.max(data, (d) => d.value);

  // Adds 'padding' to start and end of graph to avoid elements escaping visibility
  const pricePadding = (maxPrice - minPrice) * 0.3;

  // Area data
  const accumulatedShorts = useMemo(() => {
    // Return a starting point & ending point with 0 accumulation
    if (!filteredData.short || filteredData.short.length < 1)
      return [
        {
          price: currentPrice,
          vol: 0,
          accumulatedVol: 0,
        },
        {
          price: maxPrice + pricePadding,
          vol: 0,
          accumulatedVol: 0,
        },
      ];
    const accumulated = accumulateVal(filteredData.short);

    return [
      ...accumulated,
      {
        price: maxPrice + pricePadding,
        vol: 0,
        accumulatedVol: accumulated[accumulated.length - 1].accumulatedVol,
      },
    ];
  }, [filteredData.short]);

  const accumulatedLongs = useMemo(() => {
    // Return a starting point & ending point with 0 accumulation
    if (!filteredData.long || filteredData.long.length < 1)
      return [
        {
          price: maxPrice + pricePadding,
          vol: 0,
          accumulatedVol: 0,
        },
        {
          price: minPrice - pricePadding,
          vol: 0,
          accumulatedVol: 0,
        },
      ];
    const accumulated = accumulateVal(filteredData.long.toReversed());

    return [
      ...accumulated,
      {
        price: minPrice - pricePadding,
        vol: 0,
        accumulatedVol: accumulated[accumulated.length - 1].accumulatedVol,
      },
    ];
  }, [filteredData.long]);

  // Direct data so it works with two graphs that are opposite direction of each other
  const sortedData = [
    ...accumulatedShorts.toReversed().concat(...accumulatedLongs),
  ];

  // Define highest referal-point for graph (x)
  const maxAccumulatedVol = d3.max(
    [
      accumulatedShorts?.[accumulatedShorts.length - 1] || 0,
      accumulatedLongs?.[accumulatedLongs.length - 1] || 0,
    ].flat(),
    (d: accumulatedType) => d.accumulatedVol,
  );

  // Highest volume-point (for xBars)
  const vol = d3.max(sortedData, (d) => d.vol);

  const x = d3
    .scaleLinear()
    .range([0, containerWidth])
    .domain([0, maxAccumulatedVol]);

  const xBars = d3
    .scaleLinear()
    .range([0, containerWidth * 0.8])
    .domain([0, vol]);

  const y = d3
    .scaleLinear()
    .range([containersHeight - 40, 0])
    .domain([minPrice - pricePadding, maxPrice + pricePadding]);

  if (!accumulatedLongs || !accumulatedShorts) return;

  return (
    <div ref={containerRef} style={{ width: "inherit", height: "inherit" }}>
      <Axis
        shorts={filteredData.short}
        longs={filteredData.long}
        xBars={xBars}
        x={x}
        y={y}
      >
        <BarChart data={accumulatedShorts} x={xBars} y={y} />
        <AreaChart data={accumulatedShorts} x={x} y={y} color="#00f2ff" />

        <BarChart data={accumulatedLongs} x={xBars} y={y} />
        <AreaChart data={accumulatedLongs} x={x} y={y} color="#ff0000" />

        <ListeningRect
          data={sortedData.toReversed()}
          x={x}
          xBars={xBars}
          y={y}
          currentPrice={currentPrice}
          max={vol}
        />
      </Axis>
    </div>
  );
};

export default LiquidationMap;
