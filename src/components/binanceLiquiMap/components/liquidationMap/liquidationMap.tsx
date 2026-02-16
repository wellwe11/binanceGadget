import * as d3 from "d3";
import { useEffect, useMemo, useRef } from "react";
import filterByType from "./functions/filterByType";

const Axis = ({ children, height, width, margin, x, xBars, y }) => {
  const svgRef = useRef(null);
  const xAxisRef = useRef(null);
  const xBarAxisRef = useRef(null);
  const yAxisRef = useRef(null);

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
      !xAxisRef.current ||
      !xBarAxisRef.current ||
      !yAxisRef.current
    )
      return;

    const xAxisEl = d3.select(xAxisRef.current);
    const xBarAxisEl = d3.select(xBarAxisRef.current);
    const yAxisEl = d3.select(yAxisRef.current);

    xAxisEl.call(xAxis);
    xBarAxisEl.call(xBarAxis);
    yAxisEl.call(yAxis);
  }, [svgRef, xAxisRef, xBarAxisRef, yAxisRef]);
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
      {children}
    </svg>
  );
};

const BarChart = ({ data, x, y }) => {
  const gRef = useRef(null);

  useEffect(() => {
    if (!gRef.current) return;

    const g = d3.select(gRef.current);

    g.selectAll("*").remove();

    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", (d) => y(d.price))
      .attr("height", y.bandwidth())
      .attr("x", 40)
      .attr("width", (d) => x(d.vol))
      .style("fill", "skyblue");
  }, [gRef, data, x, y]);

  return <g ref={gRef} />;
};

const LiquidationMap = ({ data }) => {
  const gRef = useRef(null);
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

  useEffect(() => {
    if (!gRef.current || !data) return;
    const g = d3.select(gRef.current);

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

    g.append("path")
      .datum(accumulatedShorts)
      .attr("class", "areaShort")
      .attr("d", area)
      .style("fill", "#85bb65")
      .style("opacity", 0.5);

    g.append("path")
      .datum(accumulatedLongs)
      .attr("class", "areaLong")
      .attr("d", area)
      .style("fill", "#85bb65")
      .style("opacity", 0.5);
  }, [data, x, y]);

  return (
    <Axis
      height={height}
      width={width}
      margin={margin}
      // vv Will remove these below in future vv
      x={x}
      y={y}
      xBars={xBars}
    >
      <BarChart data={accumulatedLongs} x={xBars} y={y} />
      <BarChart data={accumulatedShorts} x={xBars} y={y} />
      <g ref={gRef}></g>
    </Axis>
  );
};

export default LiquidationMap;
