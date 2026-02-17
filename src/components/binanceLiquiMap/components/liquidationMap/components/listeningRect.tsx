import { Activity, useEffect, useRef, useState } from "react";
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
  const tooltipTextRef = useRef(null);
  const [displayToolbar, setDisplayToolbar] = useState(false);
  const handleDisplayToolbar = () => setDisplayToolbar(true);
  const handleHideToolbar = () => setDisplayToolbar(false);

  useEffect(() => {
    if (
      !rectRef.current ||
      !lineRef.current ||
      !circleRef.current ||
      !tooltipRef.current ||
      !tooltipTextRef.current
    )
      return;

    const listeningRect = d3.select(rectRef.current);
    const tooltipLineY = d3.select(lineRef.current);
    const circle = d3.select(circleRef.current);
    const tooltip = d3.select(tooltipRef.current);
    const tooltipText = d3.select(tooltipTextRef.current);

    listeningRect.on("mousemove", (event) => {
      const [_, yCoord] = d3.pointer(event, event.currentTarget);

      const eachBand = y.step();
      const index = Math.floor(yCoord / eachBand);
      const d = data[index];

      if (!d) return;

      const yPos = y(d.price) + y.bandwidth() / 2;
      const xPos = x(d.accumulatedVol) + 40;

      console.log(d);

      circle.attr("cx", xPos).attr("cy", yPos);
      circle.transition().duration(50).attr("r", 5);
      tooltipLineY.style("display", "block").attr("y1", yPos).attr("y2", yPos);
      tooltip
        .style("width", "80")
        .style("height", "30")
        .attr("x", xPos + 15)
        .attr("y", yPos + 15);
    });
    // tooltipText.html(`${"asd"}`);
  }, []);

  return (
    <g onMouseEnter={handleDisplayToolbar} onMouseLeave={handleHideToolbar}>
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

      <foreignObject ref={tooltipRef} style={{}}>
        <Activity mode={displayToolbar ? "visible" : "hidden"}>
          <div className="bg-white">
            <p ref={tooltipTextRef}>some text</p>
          </div>
        </Activity>
      </foreignObject>
    </g>
  );
};

export default ListeningRect;
