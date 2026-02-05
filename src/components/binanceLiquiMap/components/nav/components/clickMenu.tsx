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
      className={`card-shadow z-13 h-7.5 w-fit text-gray-200 cursor-pointer`}
    >
      <p className="z-13 top-1.75 text-gray-200 pointer-events-none">
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
  const scaleSize = scaleOn ? "1.5" : "1";
  const transformOriginSide = transformOrigin ? "left" : "right";

  const currentOffsetWidth =
    (widths &&
      widths
        ?.slice(0, activeButton)
        .reduce((sum: number, w) => sum + (w ?? 0), 0)) ??
    0;

  const width = (widths && widths[activeButton]) || 64;

  return (
    <div
      className={`shadow-inner z-11 absolute w-16 top-0 py-3.75 bg-gray-800 pointer-events-auto cursor-pointer`}
      style={{
        width: `${width + 4}px`,
        transform: `translateX(${currentOffsetWidth + 6 * activeButton}px) scaleX(${scaleSize})`,
        transformOrigin: transformOriginSide,
        transition:
          "transform 0.2s ease, border-radius 0.2s ease, width 0.34s ease",
      }}
    />
  );
};

const Container = ({ children }: { children: React.ReactNode[] }) => (
  <div className="shadow-inner relative flex gap-2 w-fit h-fit border-4 border-gray-600 rounded-xl bg-gray-600 overflow-hidden">
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

    if (index !== activeButton) {
      setScaleOn(true);
    }
    setTransformOrigin(index < activeButton ? false : true); // Maintain origin relevant to it's direction

    const activeButtonTimer = setTimeout(() => setActiveButton(index), 50);
    const scaleOnTimer = setTimeout(() => setScaleOn(false), 100);
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
