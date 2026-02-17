import { Activity, useEffect, useRef, useState } from "react";
import * as d3 from "d3";

// Throttle the listener
// add dots. Each dot should reflect same color as current bar hovering
// Add a mouse to hovering the bars

const ListeningRect = ({ data, xBars, x, y, currentPrice, max }) => {
  const listeningRef = useRef(null);
  const lineRef = useRef(null);
  const circleRef = useRef(null);
  const tooltipRef = useRef(null);
  const tooltipTextRef = useRef(null);
  const [displayToolbar, setDisplayToolbar] = useState(false);
  const handleDisplayToolbar = () => setDisplayToolbar(true);
  const handleHideToolbar = () => setDisplayToolbar(false);

  const low = max * 0.2;
  const normal = max * 0.4;
  const high = max * 0.7;

  const colorScale = d3
    .scaleLinear()
    .domain([low, normal, high, max])
    .range(["#5600bf", "#00bcc6", "#00960a", "#b7b700"]);

  useEffect(() => {
    if (
      !listeningRef.current ||
      !lineRef.current ||
      !circleRef.current ||
      !tooltipRef.current
    )
      return;

    const listeningEl = d3.select(listeningRef.current);
    const tooltipLineY = d3.select(lineRef.current);
    const circle = d3.select(circleRef.current);
    const tooltip = d3.select(tooltipRef.current);
    const tooltipText = d3.select(tooltipTextRef.current);

    listeningEl.on("mousemove", (event) => {
      const [xCoord, yCoord] = d3.pointer(event, event.currentTarget);

      const eachBand = y.step();
      const index = Math.floor(yCoord / eachBand);
      const d = data[index];

      if (!d) return;

      const xPos = x(d.accumulatedVol) + 40;
      const xBarPos = xBars(d.vol) + 40;
      const yPos = y(d.price) + y.bandwidth() / 2;
      const isPointerCursor =
        xCoord < xPos ? "pointer" : xCoord < xBarPos ? "pointer" : "";

      listeningEl.style("cursor", isPointerCursor);
      circle.attr("cx", xPos).attr("cy", yPos);
      circle.attr("r", 5).style("display", "block");

      tooltipLineY.style("display", "block").attr("y1", yPos).attr("y2", yPos);

      tooltip.attr("y", yPos + 15);
      tooltipText.text(`
        Price: ${d.price}
        Cumulative ${d.price > currentPrice ? "Short" : "Long"} Liquidation Leverage ${d.accumulatedVol}
        ${d.vol ? "Liquidation Leverage: " + d.vol : ""}
        `);
    });

    listeningEl.on("mouseleave", () => {
      console.log("out");
      circle.attr("r", 0).style("display", "none");
      tooltipLineY.style("display", "none");
    });
  }, [displayToolbar]);

  return (
    <g
      onMouseEnter={handleDisplayToolbar}
      onMouseLeave={handleHideToolbar}
      ref={listeningRef}
      pointerEvents="auto"
    >
      <rect
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
        pointerEvents="none"
      />
      <circle
        ref={circleRef}
        r={0}
        fill="gray"
        stroke="white"
        cursor="pointer"
      />

      <foreignObject
        ref={tooltipRef}
        width="450"
        height="150"
        style={{ pointerEvents: "none" }}
      >
        <Activity mode={displayToolbar ? "visible" : "hidden"}>
          <div className="bg-black w-full h-full text-white pointer-events-none">
            <p
              ref={tooltipTextRef}
              className="whitespace-pre-line ml-[40px] py-2 pointer-events-none select-none"
            >
              some text
            </p>
          </div>
        </Activity>
      </foreignObject>
    </g>
  );
};

export default ListeningRect;
