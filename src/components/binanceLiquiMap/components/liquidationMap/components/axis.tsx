import { useRef } from "react";

const Axis = ({ children }) => {
  return (
    <svg className="h-full w-full">
      {children}
      <g transform="translate(40, 0)" />
      <g transform={`translate(40, 100%)`} />
      <g transform={`translate(40, 100%)`} />
    </svg>
  );
};

export default Axis;
