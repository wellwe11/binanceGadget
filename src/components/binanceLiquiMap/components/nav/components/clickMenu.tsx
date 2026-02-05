import { useEffect, useMemo, useRef, useState } from "react";
import "../nav.css";

interface ClickMenuProps {
  children: string[] | string;
  defaultValue: number;
  onSelect?: (index: number, value: string) => void;
}

// Pair Symbol button
const Button = ({
  children = "Default",
  handler,
  buttonWidth = 64,
}: {
  children: string;
  handler: () => void;
  buttonWidth?: number;
}) => {
  return (
    <button
      onClick={handler}
      className={`card-shadow z-13 h-7.5 w-16 text-gray-200 cursor-pointer w-[${buttonWidth}px]`}
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
  buttonWidth = 64,
}: {
  transformOrigin: boolean;
  scaleOn: boolean;
  activeButton: number;
  buttonWidth?: number;
}) => {
  const scaleSize = scaleOn ? "1.5" : "1";
  const transformOriginSide = transformOrigin ? "left" : "right";

  return (
    <div
      className={`shadow-inner z-11 absolute top-0 py-3.75 bg-gray-800 pointer-events-auto cursor-pointer`}
      style={{
        transition: "transform 0.2s ease, border-radius 0.2s ease",
        transform: `translateX(${(activeButton || 0) * buttonWidth}px) scaleX(${scaleSize})`,
        width: `${buttonWidth}px`,
        transformOrigin: transformOriginSide,
      }}
    />
  );
};

const Container = ({ children }: { children: React.ReactNode[] }) => (
  <div className="shadow-inner relative flex w-fit h-fit border-4 border-gray-600 rounded-xl bg-gray-600 overflow-hidden">
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

  const timersRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const handleButton = (index: number, value: string) => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    setScaleOn(true);
    setTransformOrigin(index < activeButton ? false : true); // Maintain origin relevant to it's direction

    const activeButtonTimer = setTimeout(() => setActiveButton(index), 50);
    const scaleOnTimer = setTimeout(() => setScaleOn(false), 100);
    timersRef.current = [activeButtonTimer, scaleOnTimer];

    onSelect?.(index, value);
  };

  if (!children) return null;

  const buttonWidth = 64;
  const childArray = Array.isArray(children) ? children : [children];

  return (
    <Container>
      <ActiveButtonBackground
        transformOrigin={transformOrigin}
        scaleOn={scaleOn}
        activeButton={activeButton}
      />
      {childArray.map((context, index) => (
        <Button
          key={index}
          handler={() => handleButton(index, context)}
          buttonWidth={buttonWidth}
        >
          {context}
        </Button>
      ))}
    </Container>
  );
};

export default ClickMenu;
