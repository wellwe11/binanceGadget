import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { GeneratedDataType, Setter, TransformType } from "../types";

const useZoom = (
  data: GeneratedDataType[],
  ref: React.RefObject<SVGGElement | null>,
  width: number,
  height: number,
  transform: TransformType,
  setTransform: Setter<TransformType>,
  zoomSource: React.RefObject<string | null>,
) => {
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGGElement, unknown> | null>(
    null,
  );

  const pointWidth = width / data.length;

  const startIdx = Math.max(
    0,
    Math.floor(-transform.x / (pointWidth * transform.k)),
  );

  const visibleCount = Math.ceil(width / (pointWidth * transform.k)) + 2;

  const endIdx = Math.min(data.length, startIdx + visibleCount);

  const visibleData = data.slice(startIdx, endIdx);

  useEffect(() => {
    if (!ref.current || !zoomBehaviorRef.current) return;
    if (zoomSource.current !== "timelaps") return;

    d3.select(ref.current).call(
      zoomBehaviorRef.current.transform,
      d3.zoomIdentity.translate(transform.x, transform.y).scale(transform.k),
    );
  }, [transform.x, transform.k, transform.y]);

  useEffect(() => {
    if (!ref.current) return;

    const zoom = d3
      .zoom<SVGGElement, unknown>()
      .scaleExtent([1, 10])

      .on("start", () => {
        zoomSource.current = "heatmap";
      })
      .on("zoom", (e: d3.D3ZoomEvent<SVGGElement, unknown>) => {
        if (zoomSource.current !== "heatmap") return;

        const t = e.transform;

        const minX = -width * (t.k - 1);
        const maxX = 0;
        t.x = Math.min(maxX, Math.max(minX, t.x));

        setTransform({ x: t.x, y: t.y, k: t.k });
      })
      .on("end", () => {
        setTimeout(() => {
          if (zoomSource.current === "heatmap") {
            zoomSource.current = null;
          }
        }, 50);
      });

    zoomBehaviorRef.current = zoom;

    d3.select(ref.current).call(zoom);

    d3.select(ref.current).call(
      zoom.transform,
      d3.zoomIdentity.translate(transform.x, transform.y).scale(transform.k),
    );
  }, [data, width, height]);

  return { visibleData };
};

export default useZoom;
