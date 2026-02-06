import { useState } from "react";

const DragInput = ({
  value,
  setValue,
}: {
  value: number;
  setValue: (e: React.ChangeEvent<HTMLInputElement, Element>) => void;
}) => {
  const [viewVal, setViewVal] = useState(false);
  const procent = value >= 90 ? value - 10 : value;

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      onMouseEnter={() => setViewVal(true)}
      onMouseLeave={() => setViewVal(false)}
    >
      <div
        style={{ height: "100%" }}
        className="relative flex items-center justify-center"
      >
        <div
          className="absolute z-10 text-xs top-5 p-1 font-bold text-white bg-gray-500 rounded pointer-events-none"
          style={{
            left: `${procent - 15}%`,
            opacity: `${viewVal ? "1" : "0"}`,
            transition: "left 0.1s ease, opacity, 0.3s ease",
          }}
        >
          {Math.round(value)}
        </div>

        <input
          id="slider"
          type="range"
          min="10"
          max="100"
          value={value}
          onChange={setValue}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer 
          accent-gray-600
          [&::-webkit-slider-thumb]:appearance-none 
          [&::-webkit-slider-thumb]:w-5 
          [&::-webkit-slider-thumb]:h-5 
          [&::-webkit-slider-thumb]:rounded-full 
          [&::-webkit-slider-thumb]:bg-gray-600 
          [&::-webkit-slider-thumb]:border-2 
          [&::-webkit-slider-thumb]:border-white
          "
        />
      </div>
    </div>
  );
};

export default DragInput;
