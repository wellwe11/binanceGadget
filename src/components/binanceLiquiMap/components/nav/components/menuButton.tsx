import { ReactNode } from "react";

// Pair Symbol button
const MenuButton = ({
  children = "Default",
  handler,
  elRef,
}: {
  children: string | ReactNode;
  handler?: () => void;
  elRef?: (el: HTMLButtonElement | null) => void;
}) => {
  const isChildString = typeof children === "string";

  return (
    <button
      ref={elRef}
      onClick={handler}
      className="cursor-pointer min-w-13 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center justify-center"
      style={{ height: "100%", width: "100%" }}
    >
      {isChildString ? (
        <p
          className="z-13 text-white pointer-events-none"
          style={{ fontSize: "14px", fontVariationSettings: "'wght' 400" }}
        >
          {children}
        </p>
      ) : (
        children
      )}
    </button>
  );
};

export default MenuButton;
