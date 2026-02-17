import colorScale from "../functions/colorScale";

const BarChart = ({ data, x, y, max }) => {
  const scaleColors = colorScale(max);

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
          fill={scaleColors(d.vol)}
          style={{
            transformOrigin: "left",

            animation: `grow 0.3s cubic-bezier(0.34, 1.3, 0.34, 1) forwards`,
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
