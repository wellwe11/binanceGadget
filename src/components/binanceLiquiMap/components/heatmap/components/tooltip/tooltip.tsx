import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import TextWithCircle from "./components/textWithCircle";
import firstLetterCapital from "../../../liquidationMap/functions/firstLetterCapital";
import scaleColors from "../../functions/customScaleColors";

import useSize from "./hooks/useSize";

const CandleText = ({ activeCell }) => {
  const candleCircleColor = `${activeCell.open < activeCell.close ? "#ff3939" : "#65ff65"}`;
  const candleTextKeys = ["open", "high", "low", "close"];
  return (
    <div className="flex flex-col">
      {candleTextKeys.map((key, index) => (
        <TextWithCircle circleColor={candleCircleColor} key={index}>
          {`${firstLetterCapital(key)} ${Math.round(activeCell[key])}`}
        </TextWithCircle>
      ))}
    </div>
  );
};

const CellText = ({ activeCell, max }) => {
  const cellTextKeys = ["price", "volume"];
  const colorScale = useMemo(() => scaleColors(max), [max]);

  return (
    <div className="flex flex-col">
      {cellTextKeys.map((key, index) => (
        <TextWithCircle key={index} circleColor={colorScale(activeCell.volume)}>
          {`${firstLetterCapital(key)} ${Math.round(activeCell[key])}`}
        </TextWithCircle>
      ))}
    </div>
  );
};

const Tooltip = ({
  mousePos,
  activeCell,
  width,
  height,
  hideHighlight,
  max,
}) => {
  const toolTipRef = useRef(null);

  // Adjusts position of tooltip so that it does not extend outside of it's container
  const [adjustPos, setAdjustPos] = useState({ up: false, left: false });

  const formatter = d3.timeFormat("%d %b %Y, %H:%M");

  // Updates size of tooltip depending on how much content it has
  const [tooltipWidth, tooltipHeight] = useSize(toolTipRef);

  useEffect(() => {
    if (!toolTipRef.current) return;

    const toolTipEl = d3.select(toolTipRef.current);

    toolTipEl.attr("x", mousePos.x).attr("y", mousePos.y);

    const marginWidth = tooltipWidth + mousePos.x;
    const marginHeight = tooltipHeight + mousePos.y;

    setAdjustPos({
      up: marginHeight >= height ? true : false,
      left: marginWidth >= width ? true : false,
    });

    toolTipEl
      .transition()
      .duration(200)
      .ease(d3.easeCubicOut)
      .attr("x", mousePos.x)
      .attr("y", mousePos.y);
  }, [mousePos, tooltipWidth, tooltipHeight]);

  if (!activeCell) return null;

  return (
    <foreignObject
      ref={toolTipRef}
      width={tooltipWidth}
      height={tooltipHeight}
      style={{
        transform: `translate(${adjustPos.left ? `-${tooltipWidth}px` : "20px"}, ${adjustPos.up ? `-${tooltipHeight}px` : "0"})`,
        transition: activeCell ? "transform 0.3s ease, height 0.2s ease" : "",
        pointerEvents: "none",
      }}
    >
      <div className="flex flex-col bg-black w-fit h-fit text-white pointer-events-none p-5 z-30 whitespace-nowrap rounded-md">
        <p>{formatter(activeCell.date)}</p>
        {hideHighlight ? (
          <CandleText activeCell={activeCell} />
        ) : (
          <CellText activeCell={activeCell} max={max} />
        )}
      </div>
    </foreignObject>
  );
};

export default Tooltip;
