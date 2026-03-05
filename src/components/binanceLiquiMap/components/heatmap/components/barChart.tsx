import React, { useEffect, useMemo, useRef } from "react";

import colorScale from "../../../functions/colorScale";
import {
  ColorTheme,
  d3Date,
  HeatmapDataType,
  d3LinearNumber,
} from "../../../types";

const BarChart = React.memo(
  ({
    data,
    x,
    y,
    numBuckets,
    maxVol,
    colorTheme,
    threshold,
  }: {
    data: HeatmapDataType;
    x: d3Date;
    y: d3LinearNumber;
    numBuckets: number;
    maxVol: number;
    colorTheme: ColorTheme;
    threshold: number;
  }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const scaleColors = useMemo(
      () => colorScale(maxVol, colorTheme.name, threshold),
      [maxVol, colorTheme.name, threshold],
    );

    const xDomain = x.domain();
    const yDomain = y.domain();

    const width = useMemo(() => x.range()[1], [xDomain]);
    const height = useMemo(() => y.range()[0], [yDomain[0], yDomain[1]]);

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

      const cellH = Math.abs(height) / numBuckets;
      data.forEach((cell) => {
        if (cell.volume === 0) return;

        ctx.fillStyle = scaleColors(cell.volume);

        // ctx.globalAlpha = 0.8;

        ctx.fillRect(
          x(cell.date),
          y(cell.price),
          Math.ceil(x.bandwidth()),
          cellH,
        );
      });
    }, [data, x, y, width, height, colorScale]);

    return (
      <foreignObject style={{ width, height }}>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        />
      </foreignObject>
    );
  },
);

export default BarChart;
