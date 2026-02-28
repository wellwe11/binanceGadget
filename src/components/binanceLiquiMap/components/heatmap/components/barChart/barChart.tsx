import React, { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";

import scaleColors from "../../../../functions/colorScale";

// const BarChart = React.memo(({ data, x, y, width, height }) => {
//   const colorScale = d3
//     .scaleSequential(d3.interpolateBlues)
//     .domain([0, d3.max(data, (d) => d.volume) || 1]);

//   const cellW = width;
//   const cellH = height / 100;

//   const cellsWithVolume = data.filter((d) => d.volume > 0);

//   return (
//     <g>
//       {cellsWithVolume.map((obj, index) => (
//         <rect
//           key={index}
//           x={x(obj.date)}
//           y={y(obj.price)}
//           width={cellW}
//           height={cellH}
//           fill={colorScale(obj.volume)}
//           opacity="0.1"
//           cursor="pointer"
//           onMouseEnter={() => console.log(obj)}
//         />
//       ))}
//     </g>
//   );
// });

const BarChart = React.memo(({ data, x, y, width, height }) => {
  const canvasRef = useRef(null);

  const maxVol = useMemo(() => {
    return d3.max(data, (liq) => liq.volume) || 1;
  }, [data]);

  const colorScale = useMemo(() => scaleColors(maxVol), []);

  console.log(maxVol);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width * dpr, height * dpr);
    ctx.scale(dpr, dpr);

    const cellW = x.bandwidth();
    const cellH = height / 200;

    data.forEach((cell) => {
      if (cell.volume === 0) return;

      ctx.fillStyle = colorScale(cell.volume);

      // ctx.globalAlpha = 0.8;

      ctx.fillRect(x(cell.date), y(cell.price), Math.ceil(cellW), cellH);
    });
  }, [data, x, y, width, height]);

  return (
    <foreignObject style={{ width, height }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      />
    </foreignObject>
  );
});

export default BarChart;
