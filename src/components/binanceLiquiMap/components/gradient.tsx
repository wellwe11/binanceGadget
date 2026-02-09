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

const Gradient = ({
  max = 78140000,

  gradientScale = {
    start: { percentage: "0%", color: "#800080" },
    midLow: { percentage: "33%", color: "#00ced1" },
    midHigh: { percentage: "66%", color: "#81ff7f" },
    end: { percentage: "100%", color: "#d9ff00" },
  },
}: GradientType) => {
  const { start, midLow, midHigh, end } = gradientScale;

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
            <stop startOffset={start.percentage} stopColor={start.color} />
            <stop offset={midLow.percentage} stopColor={midLow.color} />
            <stop offset={midHigh.percentage} stopColor={midHigh.color} />
            <stop offset={end.percentage} stopColor={end.color} />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#gradient)" />
      </svg>
      <p className={textClass}>0</p>
    </div>
  );
};

export default Gradient;
