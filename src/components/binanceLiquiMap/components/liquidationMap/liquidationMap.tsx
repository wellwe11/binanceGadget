import * as d3 from "d3";
import { useEffect, useMemo, useRef } from "react";
import filterByType from "./functions/filterByType";

// Create two graphs, one for short holders and one for long holdest
// Cumulative short/long liquidation leverage data

// liquidation leverage vs cumulative liqudation leverage

// data has to have what type of contract it is (long/short)
// At what price that contract is

const LiquidationMap = ({ data, min, max }) => {
  const svgRef = useRef(null);
  const margin = { top: 70, right: 40, bottom: 60, left: 175 },
    width = 400 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

  // Data is not based on any time-frame. Y-axis is simply liquidations clubbed together at same price-point.
  // y is the amount of data on each point.

  // const x = useMemo(() => d3.scaleLinear().range([height, 0]).domain(0, d3.max(data, (d) => d.data)))

  // The bars:
  // x-axis: Each bar is simply a solo-bucket that contains a collection of liquidations at price poitns
  // y axis: Price poitns for each bar

  // The curve:
  // goes from current price (lets say 50000), and increases in size for each buckets amount of liquidation
  // x-axis is the amount
  // y-axis is each bucket

  // The data in this object, will be sorted by parent.
  // It will contain buckets
  // y-axis defines creates bars, for each bucket. Increases height depending on amount
  // -- Hovering bar will give a toolbox that shows bars amount, as well as accumulated liqudation amount + current bar

  // Step 1, filter type
  const filteredData = filterByType(data);

  console.log(min, max);

  // step 2, create a common x and y axis
  const x = d3.scaleLinear().range([0, width]).domain([min.value, max.value]);
  const y = d3
    .scaleBand()
    .range([height, 0])
    .padding(0.1)
    .domain(data.map((d) => d.price));

  const xAxis = d3.axisBottom(x);

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
      .attr("class", "y_axis")
      .attr("transform", `translate(40, ${10})`)
      .call(yAxis);
  }, [data, svgRef, x, y, xAxis, yAxis]);

  // OR
  // Find Current Price? (location for where the graph will be divided into 2)

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
