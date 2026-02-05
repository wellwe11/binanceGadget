import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import "../nav.css";

interface ClickMenuProps {
  children: string[] | string;
  defaultValue?: number;
  onSelect?: (index: number, value: string) => void;
}

// Pair Symbol button
const Button = ({
  children = "Default",
  handler,
  elRef,
}: {
  children: string;
  handler: () => void;
  elRef: HTMLButtonElement[];
}) => {
  return (
    <button
      ref={elRef}
      onClick={handler}
      className="z-13 h-7.5 w-fit cursor-pointer min-w-13"
    >
      <p
        className="top-1.75 text-white pointer-events-none"
        style={{ fontSize: "14px", fontVariationSettings: "'wght' 400" }}
      >
        {children}
      </p>
    </button>
  );
};

// Shade that displays currently active button
const ActiveButtonBackground = ({
  transformOrigin,
  scaleOn,
  activeButton,
  widths,
}: {
  transformOrigin: boolean;
  scaleOn: boolean;
  activeButton: number;
  widths?: (number | undefined)[];
}) => {
  const [prevButton, setPrevButton] = useState(activeButton);
  const gap = 8;

  const start = Math.min(prevButton, activeButton);
  const end = Math.max(prevButton, activeButton);
  const expandedWidth = widths
    ?.slice(start, end + 1)
    .reduce((sum, w) => sum + (w ?? 0) + gap, -gap);

  const normalWidth = widths?.[activeButton];
  const width = scaleOn ? expandedWidth : normalWidth;

  const currentOffsetWidth =
    widths?.slice(0, start).reduce((sum, w) => sum + (w ?? 0) + gap, 0) ?? 0;

  useEffect(() => {
    if (!scaleOn) {
      setPrevButton(activeButton);
    }
  }, [scaleOn, activeButton]);

  return (
    <div
      className="shadow-inner absolute h-[70%] top-[15%] bg-black pointer-events-auto cursor-pointer rounded-md"
      style={{
        willChange: "width transform",
        width: `${width + gap}px`,
        transform: `translateX(${currentOffsetWidth - gap / 2}px)`,
        transition: "transform 0.3s ease, width 0.3s ease",
      }}
    />
  );
};

const Container = ({ children }: { children: React.ReactNode[] }) => (
  <div className="relative flex gap-2 w-fit h-fit rounded-md bg-gray-700 overflow-hidden px-3 py-2 ">
    {children}
  </div>
);

const ClickMenu = ({
  children,
  onSelect,
  defaultValue = 0,
}: ClickMenuProps) => {
  const [activeButton, setActiveButton] = useState(defaultValue);

  // Minor animation-time for increasing active-buttons background-colors width
  const [scaleOn, setScaleOn] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState(false);

  // To clear timeouts from handleButton
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  // Store each button as ref to help calculate their width for ActiveButtonBackground
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [buttonsWidths, setButtonsWidths] = useState<(number | undefined)[]>(
    [],
  );

  // Create an array of all elements widths
  useEffect(() => {
    if (!children) return;
    const widths = buttonRefs?.current.map((n) => n?.offsetWidth) || 0;
    setButtonsWidths(widths);
  }, [children]);

  // Clean handleButton-timers
  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  // Starts timers for transitions as well as updates currently clicked button
  const handleButton = (index: number, value: string) => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    if (index === activeButton) return;

    setScaleOn(true);
    setTransformOrigin(index > activeButton); // Maintain origin relevant to it's direction

    const activeButtonTimer = setTimeout(() => setActiveButton(index), 150);
    const scaleOnTimer = setTimeout(() => setScaleOn(false), 200);
    timersRef.current = [activeButtonTimer, scaleOnTimer];

    onSelect?.(index, value);
  };

  if (!children) return null;

  const childArray = Array.isArray(children) ? children : [children];

  return (
    <Container>
      <ActiveButtonBackground
        widths={buttonsWidths}
        transformOrigin={transformOrigin}
        scaleOn={scaleOn}
        activeButton={activeButton}
      />
      {childArray.map((context, index) => (
        <Button
          elRef={(el: HTMLButtonElement) => (buttonRefs.current[index] = el)}
          key={index}
          handler={() => handleButton(index, context)}
        >
          {context}
        </Button>
      ))}
    </Container>
  );
};

export default ClickMenu;
