import * as d3 from "d3";

const BarChart = ({ data, x, y, max }) => {
  console.log(max);

  const low = max * 0.2;
  const normal = max * 0.4;
  const high = max * 0.7;

  const colorScale = d3
    .scaleLinear()
    .domain([low, normal, high, max])
    .range(["#5600bf", "#00bcc6", "#00960a", "#b7b700"]);

  return (
    <g transform="translate(40, 0)">
      {data.map((d, i) => (
        <rect
          key={i}
          className="bar"
          y={y(d.price)}
          height={y.bandwidth()}
          x="0"
          width={x(d.vol)}
          fill={colorScale(d.vol)}
        />
      ))}
    </g>
  );
};

export default BarChart;
