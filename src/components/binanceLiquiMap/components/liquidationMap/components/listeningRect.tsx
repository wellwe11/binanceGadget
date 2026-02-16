import { useEffect, useRef } from "react";
import * as d3 from "d3";

// To-do tomorrow:
// Dot that tracks the line
// A toolbar with ''Liquidation Leverage' & Cumulative long/short liquidation Leverage
// Add a mouseout listener
// Throttle the listener

const ListeningRect = ({ data, xBars, x, y }) => {
  const rectRef = useRef(null);
  const lineRef = useRef(null);
  const circleRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (
      !rectRef.current ||
      !lineRef.current ||
      !circleRef.current ||
      !tooltipRef.current
    )
      return;

    const listeningRect = d3.select(rectRef.current);
    const tooltipLineY = d3.select(lineRef.current);
    const circle = d3.select(circleRef.current);
    const tooltip = d3.select(tooltipRef.current);

    listeningRect.on("mousemove", (event) => {
      const [_, yCoord] = d3.pointer(event, event.currentTarget);

      const eachBand = y.step();
      const index = Math.floor(yCoord / eachBand);
      const d = data[index];

      if (!d) return;

      const yPos = y(d.price) + y.bandwidth() / 2;
      const xPos = x(d.accumulatedVol) + 40;

      circle.attr("cx", xPos).attr("cy", yPos);
      circle.transition().duration(50).attr("r", 5);
      tooltipLineY.style("display", "block").attr("y1", yPos).attr("y2", yPos);
      tooltip
        .style("width", "80")
        .style("height", "30")
        .attr("x", xPos)
        .attr("y", yPos);
    });
  }, []);

  return (
    <g>
      <rect
        ref={rectRef}
        className="w-full h-full"
        fillOpacity="0"
        strokeOpacity="0"
        pointerEvents="all"
        style={{ zIndex: "1" }}
      />
      <line
        ref={lineRef}
        x1="40"
        x2="100%"
        stroke="gray"
        strokeWidth={y.bandwidth()}
        strokeOpacity="0.5"
      />
      <circle
        ref={circleRef}
        r={0}
        fill="gray"
        stroke="white"
        pointerEvents="auto"
        cursor="pointer"
      />

      <foreignObject ref={tooltipRef}>
        <div className="bg-white">some text</div>
      </foreignObject>
    </g>
  );
};

export default ListeningRect;
