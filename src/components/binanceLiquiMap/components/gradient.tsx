const Gradient = ({ max = 78140000 }: { max: number }) => {
  const textClass = "text-white text-[12px] text-center";
  const formulatedMax = Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  })
    .format(max)
    .toLowerCase();

  return (
    <div className="relative h-full w-full">
      <p className={textClass}>{formulatedMax}</p>
      <svg width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop startOffset="0%" stopColor="#38cdff" />
            <stop offset="33%" stopColor="#38ff38" />
            <stop offset="66%" stopColor="#ffe138" />
            <stop offset="100%" stopColor="#ff6d38" />
          </linearGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#gradient)" />
      </svg>
      <p className={textClass}>0</p>
    </div>
  );
};

export default Gradient;
