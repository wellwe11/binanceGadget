import * as d3 from "d3";
import { useMemo } from "react";

// Create two graphs, one for short holders and one for long holdest
// Cumulative short/long liquidation leverage data

// liquidation leverage vs cumulative liqudation leverage

// data has to have what type of contract it is (long/short)
// At what price that contract is

const LiquidationMap = ({ data, min, max }) => {
  const margin = { top: 70, right: 40, bottom: 60, left: 175 },
    width = 660 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

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

  return (
    <svg
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
