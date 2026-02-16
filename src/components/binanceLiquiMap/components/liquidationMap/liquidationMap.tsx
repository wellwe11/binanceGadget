import * as d3 from "d3";
import { useEffect, useMemo, useRef } from "react";
import filterByType from "./functions/filterByType";

const LiquidationMap = ({ data }) => {
  const svgRef = useRef(null);
  const xAxisRef = useRef(null);
  const xBarAxisRef = useRef(null);
  const yAxisRef = useRef(null);

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

  // step 2, create a common x and y axis
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

  const xAxis = d3
    .axisBottom(x)
    .tickValues(x.domain().filter((d, i) => i % 1 === 0));

  const xBarAxis = d3.axisBottom(xBars).tickValues(xBars.domain());

  const yAxis = d3
    .axisLeft(y)
    .tickValues(y.domain().filter((d, i) => i % 5 === 0));

  useEffect(() => {
    if (
      !svgRef.current ||
      !yAxisRef.current ||
      !xAxisRef.current ||
      !xBarAxisRef.current
    )
      return;

    const svg = d3.select(svgRef.current),
      xAxisEl = d3.select(xAxisRef.current),
      xBarAxisEl = d3.select(xBarAxisRef.current),
      yAxisEl = d3.select(yAxisRef.current);

    svg.selectAll("rect.bar, path.areaShort, path.areaLong").remove();

    xAxisEl.call(xAxis);
    xBarAxisEl.call(xBarAxis);
    yAxisEl.call(yAxis);

    svg
      .selectAll(".barShort")
      .data(accumulatedShorts)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", (d) => y(d.price))
      .attr("height", y.bandwidth())
      .attr("x", 40)
      .attr("width", (d) => xBars(d.vol))
      .style("fill", "skyblue");

    svg
      .selectAll(".barLong")
      .data(accumulatedLongs)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", (d) => y(d.price))
      .attr("height", y.bandwidth())
      .attr("x", 40)
      .attr("width", (d) => xBars(d.vol))
      .style("fill", "skyblue");

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

    svg
      .append("path")
      .datum(accumulatedShorts)
      .attr("class", "areaShort")
      .attr("d", area)
      .style("fill", "#85bb65")
      .style("opacity", 0.5);

    svg
      .append("path")
      .datum(accumulatedLongs)
      .attr("class", "areaLong")
      .attr("d", area)
      .style("fill", "#85bb65")
      .style("opacity", 0.5);
  }, [data, svgRef, x, y, xAxis, yAxis, xAxisRef, yAxisRef, xBarAxisRef]);

  return (
    <svg
      ref={svgRef}
      className="bg-amber-100"
      style={{
        width: `${width + margin.left + margin.right}`,
        height: `${height + margin.top + margin.bottom}`,
      }}
    >
      <g ref={yAxisRef} transform="translate(40, 0)" />
      <g ref={xAxisRef} transform={`translate(40, ${height})`} />
      <g ref={xBarAxisRef} transform={`translate(40, ${height})`} />
    </svg>
  );
};

export default LiquidationMap;
