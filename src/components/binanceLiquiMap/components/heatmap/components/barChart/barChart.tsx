import React, { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";

import scaleColors from "../../functions/customScaleColors";

const BarChart = React.memo(({ data, x, y, width, height }) => {
  const canvasRef = useRef(null);

  const maxVol = useMemo(() => {
    return d3.max(data, (liq) => liq.volume) || 1;
  }, [data]);

  const colorScale = useMemo(() => scaleColors(maxVol), [maxVol]);

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
    const cellH = height / 100;

    data.forEach((cell) => {
      if (cell.volume === 0) return;

      ctx.fillStyle = colorScale(cell.volume);
      ctx.globalAlpha = 0.7;

      ctx.fillRect(x(cell.date), y(cell.price), cellW, cellH);
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
