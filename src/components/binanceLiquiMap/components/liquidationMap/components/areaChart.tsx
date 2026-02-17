import * as d3 from "d3";
import { XYType } from "../Types";

const AreaChart = ({
  data,
  x,
  y,
  color = "green",
}: XYType & { color: string }) => {
  const line = d3
    .line()
    .y((d) => y(d.price) + y.bandwidth() / 2)
    .x((d) => x(d.accumulatedVol))
    .curve(d3.curveBasis);

  const area = d3
    .area()
    .y((d) => y(d.price) + y.bandwidth() / 2)
    .x0(0)
    .x1((d) => x(d.accumulatedVol))
    .curve(d3.curveBasis);

  return (
    <g>
      <path
        d={area(data)}
        fill={color}
        opacity="0.12"
        style={{
          animation: `growArea 0.2s ease forwards`,
        }}
      />
      <path
        d={line(data)}
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeDasharray="1000"
        strokeDashoffset="1000"
        style={{
          animation: "draw 3.5s forwards cubic-bezier(0.34, 1.3, 0.34, 1)",
        }}
      />
      <style>
        {`
          @keyframes draw {
            from { stroke-dashoffset: 1000; }
            to { stroke-dashoffset: 50; }
          }


          @keyframes growArea {
            from { transform: scaleX(0); opacity: 0; }
            to { transform: scaleX(1); opacity: 0.12; }
          }
        `}
      </style>
    </g>
  );
};

export default AreaChart;
