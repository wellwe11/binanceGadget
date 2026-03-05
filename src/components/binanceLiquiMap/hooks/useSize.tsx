import { useLayoutEffect, useState } from "react";

const useSize = (ref: React.RefObject<HTMLElement | null>) => {
  const [size, setSize] = useState([0, 0]);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const target = ref.current.firstElementChild;
    if (!target) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (entry.borderBoxSize) {
        const { inlineSize, blockSize } = entry.borderBoxSize[0];

        setSize([inlineSize, blockSize]);
      } else {
        const { width, height } = target.getBoundingClientRect();
        setSize([width, height]);
      }
    });

    observer.observe(target);

    return () => observer.disconnect();
  }, [ref]);

  return size;
};

export default useSize;
