import { useLayoutEffect, useState } from "react";

const useTrackContainerSize = (ref) => {
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [containersHeight, setContainersHeight] = useState<number>(0);

  useLayoutEffect(() => {
    if (!ref || !ref.current) return;

    const containersSize = ref.current.getBoundingClientRect();
    const width = containersSize.width as number,
      height = containersSize.height as number;

    if (width !== containerWidth) {
      setContainerWidth(width);
    }

    if (height !== containersHeight) {
      setContainersHeight(height);
    }
  }, [ref]);

  return [containerWidth, containersHeight];
};

export default useTrackContainerSize;
