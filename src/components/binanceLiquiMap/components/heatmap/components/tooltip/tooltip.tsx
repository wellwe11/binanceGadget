import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import TextWithCircle from "./components/textWithCircle";
import firstLetterCapital from "../../../liquidationMap/functions/firstLetterCapital";
import colorScale from "../../../../functions/colorScale";

import useSize from "../../hooks/useSize";

const CandleText = ({ activeCell }) => {
  const candleCircleColor = `${activeCell.open > activeCell.close ? "#ff3939" : "#65ff65"}`;
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

const CellText = ({ activeCell, max, colorTheme, threshhold }) => {
  const cellTextKeys = ["price", "volume"];
  const scaleColor = useMemo(
    () => colorScale(max, colorTheme.name, threshhold),
    [max, colorTheme, threshhold],
  );

  return (
    <div className="flex flex-col">
      {cellTextKeys.map((key, index) => (
        <TextWithCircle key={index} circleColor={scaleColor(activeCell.volume)}>
          <div className="flex justify-between w-full">
            <p>{`${firstLetterCapital(key)}`}</p>
            <p>{`${Math.round(activeCell[key])}`}</p>
          </div>
        </TextWithCircle>
      ))}
    </div>
  );
};

const Tooltip = ({
  mousePos,
  activeCell,
  x,
  y,
  hideHighlight,
  max,
  colorTheme,
  threshhold,
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

    const marginWidth = mousePos.x + tooltipWidth >= x.range()[1];
    const marginHeight = mousePos.y + tooltipHeight >= y.range()[0];

    toolTipEl
      .transition()
      .duration(100)
      .ease(d3.easeCubicOut)
      .attr("x", mousePos.x)
      .attr("y", mousePos.y);

    if (adjustPos.left === marginWidth && adjustPos.up === marginHeight) return;

    setAdjustPos({
      left: marginWidth,
      up: marginHeight,
    });
  }, [mousePos, tooltipWidth, tooltipHeight]);

  if (!activeCell) return null;

  return (
    <foreignObject
      ref={toolTipRef}
      width={x.range()[1] > 0 ? x.range()[1] : 0}
      height={y.range()[0] > 0 ? y.range()[0] : 0}
      style={{
        transform: `translate(${adjustPos.left ? `-${tooltipWidth + 10}px` : "20px"}, ${adjustPos.up ? `-${tooltipHeight}px` : "0"})`,
        transition: activeCell ? "transform 0.3s ease, height 0.2s ease" : "",
        pointerEvents: "none",
      }}
    >
      <div className="flex flex-col bg-black w-fit h-fit text-white pointer-events-none p-5 z-30 whitespace-nowrap rounded-md">
        <p>{formatter(activeCell.date)}</p>
        {hideHighlight ? (
          <CandleText activeCell={activeCell} />
        ) : (
          <CellText
            activeCell={activeCell}
            max={max}
            colorTheme={colorTheme}
            threshhold={threshhold}
          />
        )}
      </div>
    </foreignObject>
  );
};

export default Tooltip;
