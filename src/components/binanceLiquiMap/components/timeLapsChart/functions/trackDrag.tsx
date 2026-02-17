import { SetGraphMargins } from "../timeLapsChart";

type TrackDragInterface = (
  setter: SetGraphMargins,
  max: number,
  min: number,
) => void;

const trackDrag: TrackDragInterface = (setter, max, min) => {
  let animationFrameId = null as number | null;
  let accumulatedDelta = 0;

  const handleMove = (moveEvent: MouseEvent) => {
    // Mouse-acceleration - current setting follows MY mouse fine.
    accumulatedDelta += moveEvent.movementX; // Adjust for increased/decreased acceleration of mouse-speed
    if (animationFrameId) return;

    animationFrameId = requestAnimationFrame(() => {
      const delta = accumulatedDelta;
      accumulatedDelta = 0;

      setter((prev) => {
        const width = prev.end - prev.start;
        let newStart = prev.start + delta;
        let newEnd = prev.end + delta;

        // To avoid if width is full
        if (prev.start === min && prev.end === max) return prev;

        if (newStart < min) {
          newStart = min;
          newEnd = min + width;
        }

        if (newEnd > max) {
          newEnd = max;
          newStart = max - width;
        }

        if (newStart > max) {
          newStart = max;
          newEnd = max - width;
        }

        if (newEnd < min) {
          newEnd = min;
          newStart = min + width;
        }

        return { start: newStart, end: newEnd };
      });

      animationFrameId = null;
    });
  };

  const handleUp = () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    window.removeEventListener("mousemove", handleMove);
    window.removeEventListener("mouseup", handleUp);
  };

  window.addEventListener("mousemove", handleMove);
  window.addEventListener("mouseup", handleUp);
};

export default trackDrag;
