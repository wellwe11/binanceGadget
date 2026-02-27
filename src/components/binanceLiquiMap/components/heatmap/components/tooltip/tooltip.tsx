import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import TextWithCircle from "./components/textWithCircle";
import firstLetterCapital from "../../../liquidationMap/functions/firstLetterCapital";
import scaleColors from "../../functions/customScaleColors";

const CandleText = ({ activeCell }) => {
  const candleCircleColor = `${activeCell.open < activeCell.close ? "red" : "green"}`;
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
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [adjustPos, setAdjustPos] = useState({ up: false, left: false });

  const formatter = d3.timeFormat("%d %b %Y, %H:%M");

  useLayoutEffect(() => {
    if (!toolTipRef.current) return;
    const toolTipEl = d3.select(toolTipRef.current);

    toolTipEl.attr("x", mousePos.x).attr("y", mousePos.y);

    const { width, height } =
      toolTipRef.current.firstElementChild.getBoundingClientRect();

    setSize({ width, height });
  }, [mousePos]);

  useEffect(() => {
    if (!toolTipRef.current) return;
    const toolTipEl = d3.select(toolTipRef.current);

    const marginHeight = size.height + mousePos.y;
    const marginWidth = size.width + mousePos.x;

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
  }, [mousePos]);

  if (!activeCell) return null;

  return (
    <foreignObject
      ref={toolTipRef}
      width={size.width}
      height={size.height}
      style={{
        transform: `translate(${adjustPos.left ? `-${size.width + 20}px` : "20px"}, ${adjustPos.up ? `-${size.height + 20}px` : "0"})`,
        transition: activeCell ? "transform 0.3s ease" : "",
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
