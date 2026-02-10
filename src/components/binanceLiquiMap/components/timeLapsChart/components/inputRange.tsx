const InputRange = ({ val, setter, max = 100 }) => {
  return (
    <input
      className="absolute top-0 right-0 z-11 w-full
          cursor-ew-resize
        
          appearance-none
          bg-transparent
          pointer-events-none

          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:pointer-events-auto
          [&::-webkit-slider-thumb]:w-3
          [&::-webkit-slider-thumb]:h-8
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-transparent
          [&::-webkit-slider-thumb]:border-2
          [&::-webkit-slider-thumb]:border-gray

          [&::-moz-range-thumb]:pointer-events-auto
          [&::-moz-range-thumb]:w-5
          [&::-moz-range-thumb]:h-8
          [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-transparent
          [&::-moz-range-thumb]:border-2
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
