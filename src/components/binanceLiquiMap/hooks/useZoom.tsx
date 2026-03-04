import * as d3 from "d3";
import { useEffect, useRef } from "react";

const useZoom = (
  data,
  ref,
  width,
  height,
  transform,
  setTransform,
  zoomSource,
) => {
  const zoomBehaviorRef = useRef(null);

  const visibleCount = Math.max(10, Math.floor(data.length / transform.k));
  const pixelsPerIndex = width / visibleCount;
  const startIdx = Math.max(
    0,
    Math.min(
      data.length - visibleCount,
      Math.floor(-transform.x / pixelsPerIndex),
    ),
  );

  const visibleData = data.slice(startIdx, startIdx + visibleCount);

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
      .zoom()
      .scaleExtent([1, 10])
      .translateExtent([
        [-data.length * (width / 5), 0],
        [width, height],
      ])
      .on("start", () => {
        zoomSource.current = "heatmap";
      })
      .on("zoom", (e) => {
        if (zoomSource.current !== "heatmap") return;

        const t = e.transform;
        if (t.x > 0) t.x = 0;

        setTransform(e.transform);
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
  }, [width, data.length, height]);

  return { visibleData, transform, setTransform, zoomSource };
};
export default useZoom;
