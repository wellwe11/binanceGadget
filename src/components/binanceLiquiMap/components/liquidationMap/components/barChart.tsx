import * as d3 from "d3";

const BarChart = ({ data, x, y, max }) => {
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
          x="0"
          height={y.bandwidth()}
          width={x(d.vol)}
          fill={colorScale(d.vol)}
          style={{
            transformOrigin: "left",

            animation: `grow 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
            animationDelay: `${i * 0.005}s`,

            transform: "scaleX(0)",
            opacity: "0",
          }}
        />
      ))}
      <style>
        {`
          @keyframes grow {
            from { transform: scaleX(0); opacity: 0; }
            to { transform: scaleX(1); opacity: 1; }
          }
        `}
      </style>
    </g>
  );
};

export default BarChart;
