import * as d3 from "d3";
import { useEffect, useState } from "react";

const useZoom = (data, ref, width, height) => {
  const [transform, setTransform] = useState(d3.zoomIdentity);

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
    if (!ref.current) return;

    const zoom = d3
      .zoom()
      .scaleExtent([1, 10])
      .translateExtent([
        [-data.length * (width / 5), 0],
        [width, height],
      ])
      .on("zoom", (e) => {
        const t = e.transform;
        if (t.x > 0) t.x = 0;
        setTransform(e.transform);
      });

    d3.select(ref.current).call(zoom);
  }, [width]);

  return { visibleData };
};

export default useZoom;
