import { useRef } from "react";

const Axis = ({ children, width }) => {
  return (
    <svg
      className="block w-full h-full"
      viewBox={`0 0 ${width} 200`}
      preserveAspectRatio="none"
    >
      {children}
    </svg>
  );
};

export default Axis;
