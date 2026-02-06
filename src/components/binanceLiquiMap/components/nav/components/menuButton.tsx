// Pair Symbol button
const Button = ({
  children = "Default",
  handler,
  elRef,
}: {
  children: string;
  handler?: () => void;
  elRef?: (el: HTMLButtonElement | null) => void;
}) => {
  return (
    <button
      ref={elRef}
      onClick={handler}
      className="cursor-pointer min-w-13 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center justify-center"
      style={{ height: "100%", width: "100%" }}
    >
      <p
        className="z-13 text-white pointer-events-none"
        style={{ fontSize: "14px", fontVariationSettings: "'wght' 400" }}
      >
        {children}
      </p>
    </button>
  );
};

export default Button;
