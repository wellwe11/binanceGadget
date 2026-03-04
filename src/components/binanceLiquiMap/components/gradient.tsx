import colorScale from "../functions/colorScale";
import formulateNumber from "../functions/formulateNumber";

type Gradient = {
  percentage: string;
  color: string;
};

interface GradientScaleNamed {
  start: Gradient;
  midLow: Gradient;
  midHigh: Gradient;
  end: Gradient;
}

interface GradientType {
  max: number;
  gradientScale?: GradientScaleNamed;
}

export const Gradient = ({ max, colorTheme }: GradientType) => {
  const maxVol = max || 100;
  const scaleColor = colorScale(maxVol, colorTheme);
  const gradientId = `grad-${colorTheme || "interpolateViridis"}`;

  const gradientScale = {
    start: scaleColor(0),
    midLow: scaleColor(maxVol * 0.33),
    midHigh: scaleColor(maxVol * 0.66),
    end: scaleColor(maxVol),
  };

  const textClass = "text-white text-[12px] text-center pt-2 pb-2";

  return (
    <div className="flex flex-col h-full w-full">
      {max && <p className={textClass}>{formulateNumber(max)}</p>}
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        className="rounded-xs"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop startOffset="0%" stopColor={gradientScale.start} />
            <stop offset="33%" stopColor={gradientScale.midLow} />
            <stop offset="66%" stopColor={gradientScale.midHigh} />
            <stop offset="100%" stopColor={gradientScale.end} />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill={`url(#${gradientId})`} />
      </svg>
      {max && <p className={textClass}>0</p>}
    </div>
  );
};

export default Gradient;
