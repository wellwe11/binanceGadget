const TextWithCircle = ({ children, circleColor }) => {
  return (
    <div className="flex items-center">
      <div
        className="w-2 h-2 rounded-full border border-white whitespace-nowrap"
        style={{
          backgroundColor: circleColor,
        }}
      />
      <p>{children}</p>
    </div>
  );
};

export default TextWithCircle;
