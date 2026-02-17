import { useEffect, useState } from "react";

const useTrackContainerSize = (ref) => {
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [containersHeight, setContainersHeight] = useState<number>(0);

  useEffect(() => {
    if (!ref || !ref.current) return;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;

      if (width !== containerWidth) {
        setContainerWidth(width);
      }

      if (height !== containersHeight) {
        setContainersHeight(height);
      }
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref]);

  return [containerWidth, containersHeight];
};

export default useTrackContainerSize;
