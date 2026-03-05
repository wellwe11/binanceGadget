const Axis = ({
  children,
  width,
  height,
}: {
  children: React.ReactNode;
  width: number;
  height: number;
}) => {
  return (
    <svg
      className="block w-full h-full"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      {children}
    </svg>
  );
};

export default Axis;
