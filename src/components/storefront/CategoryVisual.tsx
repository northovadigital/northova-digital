type CategoryVisualProps = {
  categoryId: string;
  inverted?: boolean;
};

export function CategoryVisual({
  categoryId,
  inverted = false,
}: CategoryVisualProps) {
  const borderClass = inverted
    ? "border-white/25"
    : "border-[#8f8578]/30";

  const fillClass = inverted
    ? "bg-white/10"
    : "bg-white/25";

  if (categoryId === "fashion") {
    return (
      <div
        aria-hidden="true"
        className="relative h-[210px] w-full overflow-hidden"
      >
        <div
          className={`absolute left-1/2 top-5 h-44 w-32 -translate-x-1/2 rounded-t-[70px] border ${borderClass} ${fillClass}`}
        />
        <div
          className={`absolute left-[43%] top-12 h-36 w-20 -rotate-12 border ${borderClass} ${fillClass}`}
        />
        <div
          className={`absolute left-[52%] top-14 h-36 w-20 rotate-12 border ${borderClass} ${fillClass}`}
        />
        <div
          className={`absolute bottom-4 left-1/2 h-px w-40 -translate-x-1/2 ${
            inverted ? "bg-white/20" : "bg-[#8f8578]/25"
          }`}
        />
      </div>
    );
  }

  if (categoryId === "fragrances") {
    return (
      <div
        aria-hidden="true"
        className="relative h-[210px] w-full overflow-hidden"
      >
        <div
          className={`absolute left-1/2 top-12 h-10 w-20 -translate-x-1/2 border ${borderClass} ${fillClass}`}
        />
        <div
          className={`absolute left-1/2 top-[79px] h-28 w-36 -translate-x-1/2 rounded-[24px] border ${borderClass} ${fillClass}`}
        />
        <div
          className={`absolute left-1/2 top-[102px] h-16 w-24 -translate-x-1/2 border ${borderClass}`}
        />
        <div
          className={`absolute left-[64%] top-7 h-16 w-16 rounded-full border ${borderClass}`}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="relative h-[210px] w-full overflow-hidden"
    >
      <div
        className={`absolute left-1/2 top-8 h-28 w-44 -translate-x-1/2 border ${borderClass} ${fillClass}`}
      />
      <div
        className={`absolute left-1/2 top-20 h-28 w-52 -translate-x-1/2 border ${borderClass} ${
          inverted ? "bg-white/5" : "bg-[#f7f3ea]/30"
        }`}
      />
      <div
        className={`absolute left-1/2 top-[122px] h-20 w-56 -translate-x-1/2 border ${borderClass} ${fillClass}`}
      />
      <div
        className={`absolute left-[38%] top-[105px] h-px w-28 -rotate-6 ${
          inverted ? "bg-white/20" : "bg-[#8f8578]/30"
        }`}
      />
    </div>
  );
}
