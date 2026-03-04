const TextWithCircle = ({ children, circleColor }) => {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-2 h-2 rounded-full border border-white whitespace-nowrap"
        style={{
          backgroundColor: circleColor,
        }}
      />
      {children}
    </div>
  );
};

export default TextWithCircle;
