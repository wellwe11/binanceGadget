import * as d3 from "d3";

import Axis from "./components/axis";
import BarChart from "./components/barChart";
import AreaChart from "./components/areaChart";

import filterByType from "./functions/filterByType";
import { useEffect, useRef } from "react";

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

  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    const tooltipLineY = svg
      .append("line")
      .attr("class", "tooltip-line")
      .attr("id", "tooltip-line-x")
      .attr("stroke", "red")
      .attr("stroke-width", 10)
      .attr("stroke-height", 20)
      .attr("stroke-dasharray", "10")
      .attr("stroke-opacity", 5);

    const listeningRect = svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill-opacity", "0")
      .attr("stroke-opacity", "0")
      .attr("pointer-events", "all")
      .attr("z-index", "1");

    listeningRect.on("mousemove", (event) => {
      const [_, yCoord] = d3.pointer(event, event.currentTarget);

      const eachBand = y.step();
      const index = Math.floor(yCoord / eachBand);
      const d = data.toReversed()[index];

      if (!d) return;

      const xPos = xBars(d.vol) + 40;
      const yPos = y(d.price) + y.bandwidth() / 2;

      console.log(d);

      tooltipLineY
        .style("display", "block")
        .attr("y1", yPos)
        .attr("y2", yPos)
        .attr("x1", 40)
        .attr("x2", width);
    });
  }, [svgRef]);

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
      <svg ref={svgRef} />
    </Axis>
  );
};

export default LiquidationMap;
