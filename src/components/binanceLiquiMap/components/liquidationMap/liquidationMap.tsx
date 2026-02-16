import * as d3 from "d3";
import { useEffect, useMemo, useRef } from "react";
import filterByType from "./functions/filterByType";

// Create two graphs, one for short holders and one for long holdest
// Cumulative short/long liquidation leverage data

// liquidation leverage vs cumulative liqudation leverage

// data has to have what type of contract it is (long/short)
// At what price that contract is

const LiquidationMap = ({ data }) => {
  const svgRef = useRef(null);
  const margin = { top: 70, right: 40, bottom: 60, left: 175 },
    width = 400 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

  // Step 1, filter type
  // This data will be used inside of the 2 graps.
  const filteredData = filterByType(data);
  const currentPrice = 1000; // Placeholder for stale data. It will be the start-point for both graphs showing longs/shorts

  // Display only contracts that are located above current price
  const filteredShorts = Object.values(filteredData.short).filter(
    (d) => d.price > currentPrice,
  );

  // Display only contracts that are located below current price
  const filteredLongs = Object.values(filteredData.long).filter(
    (d) => d.price < currentPrice,
  );

  const areaData = (d) => {
    let totalVol = 0;
    const calcTotal = [
      {
        price: d[0].price,
        vol: 0,
        accumulatedVol: 0,
      },
    ];

    d.forEach((i) => {
      const vol = i.vol;
      totalVol += vol;

      calcTotal.push({ ...i, accumulatedVol: totalVol });
    });

    return calcTotal;
  };

  // Area-sharts data
  const accumulatedShorts = areaData(filteredShorts);
  const accumulatedLongs = areaData(filteredLongs.toReversed());

  console.log(accumulatedLongs);

  const max = d3.max(
    [
      accumulatedShorts[accumulatedShorts.length - 1],
      accumulatedLongs[accumulatedLongs.length - 1],
    ].flat(),
  );

  const maxVolume = d3.max(
    [accumulatedShorts, accumulatedLongs].flat(),
    (e) => e.vol,
  );

  // step 2, create a common x and y axis
  const x = d3.scaleLinear().range([0, width]).domain([0, max.accumulatedVol]);
  const xBars = d3
    .scaleLinear()
    .range([0, width * 0.8])
    .domain([0, maxVolume]);
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
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove();

    svg
      .append("g")
      .attr("class", "x_axis")
      .attr("transform", `translate(40, ${height + 10})`)
      .call(xAxis);
    svg
      .append("g")
      .attr("class", "x_axis")
      .attr("transform", `translate(40, ${height + 10})`)
      .call(xBarAxis);

    svg
      .append("g")
      .attr("class", "y_axis")
      .attr("transform", `translate(40, ${10})`)
      .call(yAxis);

    svg
      .selectAll(".barShort")
      .data(filteredShorts)
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
      .data(filteredLongs)
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
      .x1((d) => x(d.accumulatedVol) + 40);

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
  }, [data, svgRef, x, y, xAxis, yAxis]);

  return (
    <svg
      ref={svgRef}
      className="bg-amber-100"
      style={{
        width: `${width + margin.left + margin.right}px`,
        height: `${height + margin.top + margin.bottom}px`,
      }}
    >
      <g
        style={{
          transform: `translate(${margin.left},${margin.top}px)`,
        }}
      />
    </svg>
  );
};

export default LiquidationMap;
