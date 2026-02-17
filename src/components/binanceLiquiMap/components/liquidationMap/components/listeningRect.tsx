import { Activity, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import colorScale from "../functions/colorScale";
import { ListeningRectType } from "../Types";

const ListeningRect = ({
  data,
  xBars,
  x,
  y,
  currentPrice,
  max,
  width,
}: ListeningRectType) => {
  const listeningRef = useRef(null);
  const lineRef = useRef(null);
  const circleRef = useRef(null);
  const tooltipRef = useRef(null);
  const tooltipTextRef = useRef(null);
  const [displayToolbar, setDisplayToolbar] = useState(false);

  const handleDisplayToolbar = () => setDisplayToolbar(true);
  const handleHideToolbar = () => setDisplayToolbar(false);

  const scaleColors = colorScale(max);

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

    let moveId = null as number | null;

    listeningEl.on("mousemove", (event: React.MouseEvent) => {
      if (moveId) return;

      const [xCoord, yCoord] = d3.pointer(event, event.currentTarget);

      const eachBand = y.step();
      const index = Math.floor(yCoord / eachBand);
      const d = data[index];
      if (!d) return;

      moveId = requestAnimationFrame(() => {
        const xPos = x(d.accumulatedVol);
        const xBarPos = xBars(d.vol);

        let prevYPos = 0;
        const yPos = y(d.price) + y.bandwidth() / 2;

        const isPointerCursor =
          xCoord < xPos ? "pointer" : xCoord < xBarPos ? "pointer" : "";
        listeningEl.style("cursor", isPointerCursor);
        circle.attr("cx", xPos).attr("cy", yPos);
        circle.attr("r", 5).style("display", "block");

        if (yPos === prevYPos && moveId) {
          cancelAnimationFrame(moveId);
          return;
        }

        prevYPos = yPos;
        const isShort = d.price > currentPrice;

        tooltipLineY
          .style("display", "block")
          .attr("y1", yPos)
          .attr("y2", yPos);

        tooltip.attr("y", yPos + 15);
        tooltipText.html(`
            <div class="flex flex-col gap-1 h-full">
            <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full"></div>
            Price: ${d.price}
            </div>
            <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full border border-white"
            style="background-color: ${isShort ? "#00f2ff" : "#ff0000"}"
            ></div>
            Cumulative ${isShort ? "Short" : "Long"}: ${d.accumulatedVol}
            </div>
            <div class="flex items-center gap-2">
            ${
              d.vol > 0
                ? `
                <div class="w-2 h-2 rounded-full border border-white"
                style="background-color: ${scaleColors(d.vol)}"></div>
                Liquidation Leverage: ${d.vol}
                </div>
                `
                : ""
            }
                </div>
                </div>
                `);

        moveId = null;
      });
    });

    listeningEl.on("mouseleave", () => {
      if (moveId) {
        cancelAnimationFrame(moveId);

        circle.attr("r", 0).style("display", "none");
        tooltipLineY.style("display", "none");
      }
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
        x1="0"
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
        width={width}
        height="100"
        style={{ pointerEvents: "none" }}
      >
        <Activity mode={displayToolbar ? "visible" : "hidden"}>
          <div
            ref={tooltipTextRef}
            className="bg-black w-full h-full text-white pointer-events-none py-2"
          />
        </Activity>
      </foreignObject>
    </g>
  );
};

export default ListeningRect;
