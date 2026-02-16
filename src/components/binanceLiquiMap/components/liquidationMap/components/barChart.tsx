import { useRef } from "react";

const BarChart = ({ data, x, y }) => {
  const gRef = useRef(null);

  return (
    <g ref={gRef} transform="translate(40, 0)">
      {data.map((d, i) => (
        <rect
          key={i}
          className="bar"
          y={y(d.price)}
          height={y.bandwidth()}
          x="0"
          width={x(d.vol)}
          fill="skyblue"
        />
      ))}
    </g>
  );
};

export default BarChart;
