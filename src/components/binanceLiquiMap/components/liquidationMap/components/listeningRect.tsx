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
  height,
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

    const bisect = d3.bisector((d) => d.price).center;

    listeningEl.on("mousemove", (event: React.MouseEvent) => {
      const [xCoord, yCoord] = d3.pointer(event);

      const mousePrice = y.invert(yCoord);
      const index = bisect(data, mousePrice);

      const d = data[index];

      const isShort = d.price > currentPrice;

      tooltipLineY
        .attr("y1", yCoord)
        .attr("y2", yCoord)
        .style("display", "block");

      if (d) {
        const xPos = x(d.accumulatedVol);
        const xBarPos = xBars(d.vol);

        circle
          .attr("cx", xPos) // X snaps to vol
          .attr("cy", yCoord) // Y follows mouse smoothly
          .attr("r", 5)
          .style("display", "block");

        const isPointerCursor =
          xCoord < xPos ? "pointer" : xCoord < xBarPos ? "pointer" : "";
        listeningEl.style("cursor", isPointerCursor);
      }

      tooltip.attr("y", yCoord + 15);

      tooltipText.html(`
            <div class="flex flex-col gap-1 h-full w-full">
            <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full"></div>
            Price: ${Math.round(d.price)}
            </div>
            <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full border border-white"
            style="background-color: ${isShort ? "#00f2ff" : "#ff0000"}"
            ></div>
            Cumulative ${isShort ? "Short" : "Long"}: ${Math.round(d.accumulatedVol)}
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
    });

    listeningEl.on("mouseleave", () => {
      circle.attr("r", 0).style("display", "none");
      tooltipLineY.style("display", "none");
    });
  }, [displayToolbar, data, y, x, width, height]);

  return (
    <g
      onMouseEnter={handleDisplayToolbar}
      onMouseLeave={handleHideToolbar}
      ref={listeningRef}
      pointerEvents="auto"
      width={width}
      height={height}
    >
      <rect
        className="w-full h-full"
        fillOpacity="0"
        strokeOpacity="0"
        pointerEvents="all"
        style={{ zIndex: "1" }}
        width={width}
        height={height}
      />
      <line
        ref={lineRef}
        visibility={displayToolbar ? "visible" : "hidden"}
        x1="0"
        x2={width}
        stroke="gray"
        strokeWidth={y.price}
        strokeOpacity="0.5"
        pointerEvents="none"
      />
      <circle
        ref={circleRef}
        visibility={displayToolbar ? "visible" : "hidden"}
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
            className="bg-black w-full h-full text-white pointer-events-none py-2 z-30"
          />
        </Activity>
      </foreignObject>
    </g>
  );
};

export default ListeningRect;
