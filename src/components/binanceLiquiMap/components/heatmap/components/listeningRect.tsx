import { Activity, memo } from "react";
import {
  d3Date,
  d3LinearNumber,
  CoinOnDateType,
  Setter,
  GeneratedDataType,
} from "../../../types";

const ListeningRect = ({
  y,
  x,
  handleHover,
  activeCell,
  hideHighlight,
  mouseOut,
  setMouseOut,
  numBuckets,
}: {
  x: d3Date;
  y: d3LinearNumber;
  handleHover: (e: React.MouseEvent) => void;
  activeCell: CoinOnDateType | GeneratedDataType | null;
  hideHighlight: boolean;
  mouseOut: boolean;
  setMouseOut: Setter<boolean>;
  numBuckets: number;
}) => {
  const cellH = Math.abs(y.range()[0] - y.range()[1]) / numBuckets;

  return (
    <g cursor="pointer">
      <rect
        onMouseLeave={() => setMouseOut(true)}
        onMouseEnter={() => setMouseOut(false)}
        width={x.range()[1] > 0 ? x.range()[1] : 0}
        height={y.range()[0] > 0 ? y.range()[0] : 0}
        x={x.range()[0]}
        y={y.range()[1]}
        fill="transparent"
        onMouseMove={handleHover}
        className="pointer-events-auto"
      />

      <Activity mode={mouseOut || hideHighlight ? "hidden" : "visible"}>
        <rect
          x={x(activeCell?.date)}
          y={y(activeCell?.price)}
          width={x.bandwidth()}
          height={cellH}
          fill="none"
          stroke="white"
          strokeWidth="0.5"
          className="pointer-events-none"
          style={{ opacity: hideHighlight ? "0" : "1" }}
        />
      </Activity>
    </g>
  );
};

export default memo(ListeningRect);
