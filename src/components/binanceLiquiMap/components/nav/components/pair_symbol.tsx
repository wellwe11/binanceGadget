import { useState } from "react";
import "../nav.css";

const Button = ({
  children,
  handler,
}: {
  children: string;
  handler: () => void;
}) => {
  const buttonStyle =
    "card-shadow z-13 h-7.5 w-16 text-gray-200 cursor-pointer";
  const buttonTextStyle = "z-13 top-1.75 text-gray-200 pointer-events-none";

  return (
    <button onClick={handler} className={buttonStyle}>
      <p className={buttonTextStyle}>{children}</p>
    </button>
  );
};

const Pair_Symbol = () => {
  const [activeButton, setActiveButton] = useState(true);
  const [scaleOn, setScaleOn] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState(false);

  const handleButton = () => {
    setScaleOn(true);
    setTransformOrigin(!transformOrigin);

    setTimeout(() => setActiveButton(!activeButton), 50);
    setTimeout(() => setScaleOn(false), 100);
  };

  return (
    <div className="shadow-inner relative flex w-fit p-1 rounded-xl bg-gray-600">
      <Button handler={() => !activeButton && handleButton()}>Pair</Button>

      <div
        className={`shadow-inner z-11 absolute top-1 py-3.75 w-16 bg-gray-800 pointer-events-auto cursor-pointer`}
        style={{
          transformOrigin: !transformOrigin ? "right" : "left",
          transform: `translateX(${activeButton ? "0" : "100%"}) scaleX(${scaleOn ? "1.6" : "1"})`,
          transition: "transform 0.2s ease, border-radius 0.2s ease",

          borderTopLeftRadius: activeButton ? "12px" : "0px",
          borderBottomLeftRadius: activeButton ? "12px" : "0px",

          borderTopRightRadius: !activeButton ? "12px" : "0px",
          borderBottomRightRadius: !activeButton ? "12px" : "0px",
        }}
      />

      <Button handler={() => activeButton && handleButton()}>Symbol</Button>
    </div>
  );
};

export default Pair_Symbol;
