import { memo } from "react";

const CandleChart = ({ data, x, y, handleHover, setHideHighlight }) => {
  return (
    <g
      className="candle"
      onMouseMove={handleHover}
      onMouseEnter={() => setHideHighlight(true)}
      onMouseLeave={() => setHideHighlight(false)}
    >
      {data.map(
        (d, i) =>
          x(d.date) && (
            <g
              cursor="pointer"
              key={i}
              className="group transition-transform duration-150 ease-in-out hover:scale-x-150"
              transform={`translate(${x(d.date)}, 0)`}
              style={{
                transformOrigin: `${x(d.date)}px center`,
                transformBox: "fill-box",
              }}
            >
              <line
                y1={y(d.low)}
                y2={y(d.high)}
                stroke={d.open > d.close ? "#ff3939" : "#65ff65"}
                strokeWidth="1"
              />
              <line
                y1={y(d.open)}
                y2={y(d.close)}
                stroke={d.open > d.close ? "#ff3939" : "#65ff65"}
                strokeWidth={x.bandwidth() * 0.5}
              />
            </g>
          ),
      )}
    </g>
  );
};

export default memo(CandleChart);
