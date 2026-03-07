import { Activity, memo, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import colorScale from "../../../functions/colorScale";

import useSize from "../../../hooks/useSize";
import formulateNumber from "../../../functions/formulateNumber";
import { AccumulatedVol, d3LinearNumber } from "../../../types";

const ListeningRect = ({
  data,
  xBars,
  x,
  y,
  currentPrice,
  max,
  colorTheme,
}: {
  data: AccumulatedVol[];
  xBars: d3LinearNumber;
  x: d3LinearNumber;
  y: d3LinearNumber;
  currentPrice: number;
  max: number;
  colorTheme: string;
}) => {
  const listeningRef = useRef(null);
  const lineRef = useRef(null);
  const circleRef = useRef(null);
  const tooltipRef = useRef(null);
  const tooltipTextRef = useRef(null);
  const [displayToolbar, setDisplayToolbar] = useState(false);

  const [tooltipWidth, tooltipHeight] = useSize(tooltipRef);

  const handleDisplayToolbar = () => setDisplayToolbar(true);
  const handleHideToolbar = () => setDisplayToolbar(false);

  const scaleColors = colorScale(max, colorTheme);
  const [maxYPixels, minYPixels] = y.range();
  const [minXPixels, maxXPixels] = x.range();

  const activeHeight = maxYPixels - minYPixels;

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

      const bisectPrice = d3.bisector((d: AccumulatedVol) => d.price).left;
      const i = bisectPrice(data, mousePrice, 1, data.length - 1);
      const d0 = data[i - 1];
      const d1 = data[i];
      let interpolatedAccumulatedVol = 0;
      let interpolatedVol = 0;
      let interpolatedPrice = 0;

      const dNearest =
        d1 && mousePrice - d0.price > d1.price - mousePrice ? d1 : d0;

      const priceThreshold = 1;
      const isEmpty =
        !dNearest || Math.abs(dNearest.price - mousePrice) > priceThreshold;

      if (d0 && d1) {
        const t = (mousePrice - d0.price) / (d1.price - d0.price);

        interpolatedAccumulatedVol =
          d0.accumulatedVol + t * (d1.accumulatedVol - d0.accumulatedVol);

        interpolatedVol = d0.volume + t * (d1.volume - d0.volume);
        interpolatedPrice = d0.price + t * (d1.price - d0.price);
      }

      if (isEmpty) {
        interpolatedVol = 0;
      }

      const xPos = x(interpolatedAccumulatedVol);
      const yPos = yCoord;

      const xBarPos = xBars(interpolatedVol);

      if (yPos + tooltipHeight + 25 > maxYPixels) {
        tooltip.style("transform", `translate(0, -${tooltipHeight + 30}px)`);
      } else {
        tooltip.style("transform", "translate(0, 0)");
      }

      circle
        .attr("cx", xPos)
        .attr("cy", yCoord)
        .attr("r", 5)
        .style("display", "block");

      tooltipLineY.attr("y1", yPos).attr("y2", yPos).style("display", "block");

      const isPointerCursor =
        xCoord < xPos ? "pointer" : xCoord < xBarPos ? "pointer" : "";
      listeningEl.style("cursor", isPointerCursor);
      const isShort = interpolatedPrice > currentPrice;

      tooltip
        .transition()
        .duration(200)
        .ease(d3.easeCubicOut)
        .attr("y", yPos + 15);

      tooltipText.html(`
              <div class="flex flex-col gap-1 h-full w-full">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full"></div>
                    <div class="flex justify-between w-full">
                      <div>
                        Price: 
                      </div>
                    <div>
                      ${Math.round(interpolatedPrice)}
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full border border-white"
                  style="background-color: ${isShort ? "#00f2ff" : "#ff0000"}"
                  ></div>
                  <div class="flex justify-between w-full">
                    <div>
                      Cumulative ${isShort ? "Short" : "Long"}: 
                    </div>
                    <div>
                      ${formulateNumber(Math.round(+interpolatedAccumulatedVol))}
                    </div>
                  </div>
              </div>
              <div class="flex items-center gap-2">
              ${
                interpolatedVol > 0
                  ? `
                <div class="w-2 h-2 rounded-full border border-white"
                style="background-color: ${scaleColors(interpolatedVol)}"></div>
                <div class="flex justify-between w-full">
                <div>
                Liquidation Leverage: 
                </div>
                <div>
                ${formulateNumber(Math.round(interpolatedVol))}
                </div>
                </div>
                `
                  : ""
              }
              </div>
              </div>
              </div>
                  `);
    });

    listeningEl.on("mouseleave", () => {
      circle.attr("r", 0).style("display", "none");
      tooltipLineY.style("display", "none");
    });
  }, [displayToolbar, data, y, x, maxXPixels, maxYPixels, tooltipHeight]);

  return (
    <g
      onMouseEnter={handleDisplayToolbar}
      onMouseLeave={handleHideToolbar}
      ref={listeningRef}
      pointerEvents="auto"
      y={minYPixels}
      width={maxXPixels}
      height={activeHeight}
    >
      <rect
        fillOpacity="0"
        strokeOpacity="0"
        pointerEvents="all"
        style={{ zIndex: "1" }}
        width={maxXPixels > 0 ? maxXPixels : 0}
        height={maxYPixels > 0 ? maxYPixels : 0}
      />
      <line
        ref={lineRef}
        visibility={displayToolbar ? "visible" : "hidden"}
        x1="0"
        x2={maxXPixels}
        stroke="gray"
        strokeWidth={y.price}
        strokeOpacity="0.5"
        pointerEvents="none"
      />
      <circle
        className="hover:stroke-[2px] transition-[stroke-width] duration-200"
        ref={circleRef}
        visibility={displayToolbar ? "visible" : "hidden"}
        r={0}
        fill="gray"
        stroke="white"
        cursor="pointer"
      />

      <foreignObject
        ref={tooltipRef}
        width={maxXPixels + 10}
        height={tooltipHeight}
        style={{
          pointerEvents: "none",
          transition: "transform 0.4s ease, height 0.2s ease",
          zIndex: 100,
        }}
      >
        <Activity mode={displayToolbar ? "visible" : "hidden"}>
          <div
            ref={tooltipTextRef}
            className="bg-black h-fit w-max text-white pointer-events-none py-4 z-30 "
            style={{ width: "100%" }}
          />
        </Activity>
      </foreignObject>
    </g>
  );
};

export default memo(ListeningRect);
