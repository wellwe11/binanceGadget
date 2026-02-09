import { useEffect, useRef, useState, Activity } from "react";
import "../nav.css";
import MenuButton from "../components/menuButton";

interface ClickMenuProps {
  children: string[] | string;
  defaultValue?: number;
  onSelect?: (index: number, value: string) => void;
}

// Shade that displays currently active button
const ActiveButtonBackground = ({
  transformOrigin,
  scaleOn,
  activeButton,
  widths = [],
}: {
  transformOrigin: boolean;
  scaleOn: boolean;
  activeButton: number;
  widths?: (number | undefined)[];
}) => {
  const gap = 4;
  const [prevButton, setPrevButton] = useState(activeButton);
  const start = Math.min(prevButton, activeButton);
  const end = Math.max(prevButton, activeButton);
  const expandedWidth = widths
    ?.slice(start, end + 1)
    .reduce((sum, w) => sum! + (w ?? 0) + gap, -gap);

  const normalWidth = widths?.[activeButton];
  const width = scaleOn ? expandedWidth : normalWidth;

  const currentOffsetWidth =
    widths?.slice(0, start).reduce((sum, w) => sum! + (w ?? 0) + gap, 0) ?? 0;

  const transformOriginSide = !transformOrigin ? "left" : "right";

  useEffect(() => {
    if (!scaleOn) {
      setPrevButton(activeButton);
    }
  }, [scaleOn, activeButton]);

  return (
    <div
      className="shadow-inner absolute h-[70%] top-[15%] bg-black pointer-events-none cursor-pointer rounded-md"
      style={{
        transformOrigin: transformOriginSide,
        willChange: "width transform",
        width: `${width! + gap}px`,
        transform: `translateX(${currentOffsetWidth - gap / 2}px)`,
        transition: "transform 0.3s ease, width 0.3s ease",
      }}
    />
  );
};

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
      setActiveButton(defaultValue);
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
    <div
      className="px-1.5 py-1 gap-1 relative flex w-fit h-fit rounded-md bg-gray-700 overflow-hidden"
      style={{ width: "100%", height: "100%" }}
    >
      <Activity mode={childArray.length > 1 ? "visible" : "hidden"}>
        <ActiveButtonBackground
          widths={buttonsWidths}
          transformOrigin={transformOrigin}
          scaleOn={scaleOn}
          activeButton={activeButton}
        />
      </Activity>
      {childArray.map((context, index) => (
        <MenuButton
          elRef={(el) => (buttonRefs.current[index] = el)}
          key={index}
          handler={() => handleButton(index, context)}
        >
          {context}
        </MenuButton>
      ))}
    </div>
  );
};

export default ClickMenu;
