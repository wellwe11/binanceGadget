import { InputChangeEvent } from "../timeLapsChart";

interface InputRangeInterface {
  val: number;
  setter: (e: InputChangeEvent) => void;
  max: number;
}

const InputRange = ({ val, setter, max = 100 }: InputRangeInterface) => {
  return (
    <input
      className="absolute top-0 right-0 w-full
          cursor-ew-resize
        
          appearance-none
          bg-transparent
          pointer-events-none

          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:pointer-events-auto
          [&::-webkit-slider-thumb]:w-3
          [&::-webkit-slider-thumb]:h-3
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-[#0000007c]
          [&::-webkit-slider-thumb]:border
          [&::-webkit-slider-thumb]:border-[#9c9c9c]

          [&::-moz-range-thumb]:pointer-events-auto
          [&::-moz-range-thumb]:w-3
          [&::-moz-range-thumb]:h-3
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-[#0000007c]
          [&::-moz-range-thumb]:border
          [&::-moz-range-thumb]:border-[#a4a4a4]
          [&::-moz-range-thumb]:border-solid"
      type="range"
      min="1"
      max={max - 1}
      value={val}
      onChange={setter}
    />
  );
};

export default InputRange;
