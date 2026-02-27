const ListeningRect = ({
  y,
  x,
  width,
  height,
  handleHover,
  activeCell,
  hideHighlight,
}) => {
  const cellH = height / 100;

  return (
    <g cursor="pointer">
      <rect
        width={width}
        height={height}
        fill="transparent"
        onMouseMove={handleHover}
        className="pointer-events-auto"
      />

      {activeCell && (
        <rect
          x={x(activeCell.date)}
          y={y(activeCell.price)}
          width={x.bandwidth()}
          height={cellH}
          fill="none"
          stroke="white"
          strokeWidth="0.5"
          className="pointer-events-none"
          style={{ opacity: hideHighlight ? "0" : "1" }}
        />
      )}
    </g>
  );
};

export default ListeningRect;
