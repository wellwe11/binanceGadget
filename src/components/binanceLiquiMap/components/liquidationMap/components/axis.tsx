import * as d3 from "d3";

const Axis = ({ children, shorts, longs, xBars, height }) => {
  const maxShorts = d3.max(shorts, (d) => d.vol);
  const averageShorts = Math.round(d3.mean(shorts, (d) => d.vol));

  const maxLongs = d3.max(longs, (d) => d.vol);
  const averageLongs = Math.round(d3.mean(longs, (d) => d.vol));

  return (
    <svg className="h-full w-full">
      {children}

      <line
        x1={xBars(averageShorts)}
        x2={xBars(averageShorts)}
        y1={0}
        y2={height}
        stroke="white"
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.2"
      />
      <line
        x1={xBars(maxShorts)}
        x2={xBars(maxShorts)}
        y1={0}
        y2={height}
        stroke="white"
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.3"
      />
      <line
        x1={xBars(averageLongs)}
        x2={xBars(averageLongs)}
        y1={0}
        y2={height}
        stroke="white"
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.2"
      />
      <line
        x1={xBars(maxLongs)}
        x2={xBars(maxLongs)}
        y1={0}
        y2={height}
        stroke="white"
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.3"
      />
      <line
        x1={height}
        x2={height}
        y1={0}
        y2={height}
        stroke="white"
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.4"
      />
    </svg>
  );
};

export default Axis;
