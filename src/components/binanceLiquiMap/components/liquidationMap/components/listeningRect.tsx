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

    listeningEl.on("mousemove", (event: React.MouseEvent) => {
      const [xCoord, yCoord] = d3.pointer(event);
      const mousePrice = y.invert(yCoord);

      const bisectPrice = d3.bisector((d) => d.price).left;
      const i = bisectPrice(data, mousePrice, 1, data.length - 1);
      const d0 = data[i - 1];
      const d1 = data[i];
      let interpolatedAccumulatedVol = 0;
      let interpolatedVol = 0;
      let interpolatedPrice = 0;

      // 1. Find nearest data point
      const dNearest =
        d1 && mousePrice - d0.price > d1.price - mousePrice ? d1 : d0;

      // 2. Define a threshold (e.g., if mouse is > $10 away from a real price)
      const priceThreshold = 1;
      const isEmpty =
        !dNearest || Math.abs(dNearest.price - mousePrice) > priceThreshold;

      if (d0 && d1) {
        const t = (mousePrice - d0.price) / (d1.price - d0.price);

        interpolatedAccumulatedVol =
          d0.accumulatedVol + t * (d1.accumulatedVol - d0.accumulatedVol);

        interpolatedVol = d0.vol + t * (d1.vol - d0.vol);
        interpolatedPrice = d0.price + t * (d1.price - d0.price);
      }

      if (isEmpty) {
        interpolatedVol = 0;
      }

      const xPos = x(interpolatedAccumulatedVol);
      const yPos = yCoord;

      const xBarPos = xBars(interpolatedVol);

      circle
        .attr("cx", xPos) // X snaps to vol
        .attr("cy", yCoord) // Y follows mouse smoothly
        .attr("r", 5)
        .style("display", "block");

      tooltipLineY.attr("y1", yPos).attr("y2", yPos).style("display", "block");

      const isPointerCursor =
        xCoord < xPos ? "pointer" : xCoord < xBarPos ? "pointer" : "";
      listeningEl.style("cursor", isPointerCursor);
      const isShort = interpolatedPrice > currentPrice;

      tooltip.attr("y", yPos + 15);

      tooltipText.html(`
              <div class="flex flex-col gap-1 h-full w-full">
              <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full"></div>
              Price: ${Math.round(interpolatedPrice)}
              </div>
              <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full border border-white"
              style="background-color: ${isShort ? "#00f2ff" : "#ff0000"}"
              ></div>
              Cumulative ${isShort ? "Short" : "Long"}: ${Math.round(interpolatedAccumulatedVol)}
              </div>
              <div class="flex items-center gap-2">
              ${
                interpolatedVol > 0
                  ? `
                  <div class="w-2 h-2 rounded-full border border-white"
                  style="background-color: ${scaleColors(interpolatedVol)}"></div>
                  Liquidation Leverage: ${Math.round(interpolatedVol)}
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
