import { useRef } from "react";

const Axis = ({ children, margin }) => {
  return (
    <svg className="h-full w-full">
      {children}
      <g />
      <g />
      <g />
    </svg>
  );
};

export default Axis;
