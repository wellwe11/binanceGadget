import colorScale from "../functions/colorScale";

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

const Gradient = ({ max = 78140000 }: GradientType) => {
  const maxVol = 12175;
  const scaleColor = colorScale(maxVol);

  const gradientScale = {
    start: scaleColor(0),
    midLow: scaleColor(maxVol * 0.33),
    midHigh: scaleColor(maxVol * 0.66),
    end: scaleColor(maxVol),
  };

  const textClass = "text-white text-[12px] text-center pt-2 pb-2";
  const formulatedMax = Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  })
    .format(max)
    .toLowerCase();

  return (
    <div className="flex flex-col h-full w-full">
      <p className={textClass}>{formulatedMax}</p>
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        className="rounded-xs"
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop startOffset="0%" stopColor={gradientScale.start} />
            <stop offset="33%" stopColor={gradientScale.midLow} />
            <stop offset="66%" stopColor={gradientScale.midHigh} />
            <stop offset="100%" stopColor={gradientScale.end} />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#gradient)" />
      </svg>
      <p className={textClass}>0</p>
    </div>
  );
};

export default Gradient;
