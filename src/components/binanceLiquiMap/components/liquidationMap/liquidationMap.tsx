import * as d3 from "d3";

import Axis from "./components/axis";
import BarChart from "./components/barChart";
import AreaChart from "./components/areaChart";

import filterByType from "./functions/filterByType";
import { useEffect, useRef } from "react";

const ListeningRect = ({ data, width, height, x, xBars, y }) => {
  const rectRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    if (!rectRef.current || !lineRef.current) return;

    const listeningRect = d3.select(rectRef.current);
    const tooltipLineY = d3.select(lineRef.current);

    listeningRect.on("mousemove", (event) => {
      const [_, yCoord] = d3.pointer(event, event.currentTarget);

      const eachBand = y.step();
      const index = Math.floor(yCoord / eachBand);
      const d = data.toReversed()[index];

      if (!d) return;

      const xPos = xBars(d.price);
      const yPos = y(d.price) + y.bandwidth() / 2;

      tooltipLineY.style("display", "block").attr("y1", yPos).attr("y2", yPos);
    });
  }, []);

  return (
    <g>
      <rect
        className="w-full h-full"
        ref={rectRef}
        fillOpacity="0"
        strokeOpacity="0"
        pointerEvents="all"
        style={{ zIndex: "1" }}
      />
      <line
        x1="40"
        x2="100%"
        ref={lineRef}
        stroke="red"
        strokeWidth={y.bandwidth()}
        strokeOpacity="0.3"
      />
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

  const filteredConcat = filteredShorts.concat(filteredLongs);

  console.log(filteredConcat);

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

      <ListeningRect
        data={data}
        width={width}
        height={height}
        x={x}
        xBars={xBars}
        y={y}
      />
    </Axis>
  );
};

export default LiquidationMap;
