import * as d3 from "d3";
import { useEffect, useState } from "react";

const BarChart = ({ data, x, y, max }) => {
  const [loadData, setLoadData] = useState(false);
  const low = max * 0.2;
  const normal = max * 0.4;
  const high = max * 0.7;

  const colorScale = d3
    .scaleLinear()
    .domain([low, normal, high, max])
    .range(["#5600bf", "#00bcc6", "#00960a", "#b7b700"]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadData(true);
    }, 500);

    return () => {
      setLoadData(false);
      clearTimeout(timer);
    };
  }, []);

  return (
    <g transform="translate(40, 0)">
      {data.map((d, i) => (
        <rect
          key={i}
          className="bar"
          y={y(d.price)}
          x="0"
          height={y.bandwidth()}
          width={loadData ? x(d.vol) : 0}
          fill={colorScale(d.vol)}
          style={{
            transition: `width 0.${i < 5 ? i : 3}s cubic-bezier(0.34, 1.56, 0.64, 1) 0.0${i}s`,
          }}
        />
      ))}
    </g>
  );
};

export default BarChart;
