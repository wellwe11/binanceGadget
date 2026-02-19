import colorScale from "../functions/colorScale";
import { XYType } from "../Types";

const BarChart = ({ data, x, y, max }: XYType & { max: number }) => {
  const scaleColors = colorScale(max);

  return (
    <g>
      {data.map((d, i) => (
        <rect
          key={i}
          className="bar"
          x="0"
          y={y(d.price)}
          width={x(d.vol)}
          height={2}
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
