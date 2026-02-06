// Pair Symbol button
const Button = ({
  children = "Default",
  handler,
  elRef,
}: {
  children: string;
  handler: () => void;
  elRef: (el: HTMLButtonElement | null) => void;
}) => {
  return (
    <button
      ref={elRef}
      onClick={handler}
      className="h-7.5 cursor-pointer min-w-13 bg-gray-700 hover:bg-gray-600 rounded-md flex items-center justify-center"
    >
      <p
        className="z-13 top-1.75 text-white pointer-events-none"
        style={{ fontSize: "14px", fontVariationSettings: "'wght' 400" }}
      >
        {children}
      </p>
    </button>
  );
};

export default Button;
