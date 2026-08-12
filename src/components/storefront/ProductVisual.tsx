type ProductVisualProps = {
  category: string;
  variantKey?: string;
};

function getVariant(value: string): number {
  return [...value].reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  ) % 3;
}

export function ProductVisual({
  category,
  variantKey = category,
}: ProductVisualProps) {
  const variant = getVariant(variantKey);

  if (category === "fashion") {
    const backgrounds = [
      "bg-[linear-gradient(145deg,#d4c9ba,#ebe5dc)]",
      "bg-[linear-gradient(145deg,#bdb4a9,#ded7ce)]",
      "bg-[linear-gradient(145deg,#c9c0ae,#f0e9dd)]",
    ];

    const accentPositions = [
      "left-[28%] top-[28%]",
      "left-[22%] top-[24%]",
      "left-[31%] top-[31%]",
    ];

    return (
      <div
        aria-hidden="true"
        className={`relative h-full min-h-[310px] overflow-hidden ${backgrounds[variant]}`}
      >
        <div
          className={`absolute ${accentPositions[variant]} h-[45%] w-[24%] -rotate-12 border border-[#817566]/20 bg-white/10`}
        />

        <div className="absolute left-1/2 top-[17%] h-[58%] w-[42%] -translate-x-1/2 rounded-t-[100px] border border-white/55 bg-white/16" />

        <div className="absolute right-[25%] top-[30%] h-[45%] w-[24%] rotate-12 border border-[#817566]/20 bg-white/10" />

        {variant === 1 && (
          <div className="absolute right-[17%] top-[15%] h-20 w-20 rounded-full border border-[#8f806d]/20" />
        )}

        {variant === 2 && (
          <div className="absolute left-[17%] top-[17%] h-24 w-px rotate-12 bg-[#807361]/20" />
        )}

        <div className="absolute bottom-8 left-1/2 h-px w-[46%] -translate-x-1/2 bg-[#756b60]/25" />
      </div>
    );
  }

  if (category === "fragrances") {
    const backgrounds = [
      "bg-[radial-gradient(circle_at_70%_25%,#4f493f_0%,#292723_42%,#211f1c_100%)]",
      "bg-[radial-gradient(circle_at_25%_25%,#665746_0%,#302b25_45%,#211e1a_100%)]",
      "bg-[radial-gradient(circle_at_65%_65%,#494845_0%,#252422_48%,#181715_100%)]",
    ];

    const bottleWidths = ["w-[42%]", "w-[36%]", "w-[48%]"];

    return (
      <div
        aria-hidden="true"
        className={`relative h-full min-h-[310px] overflow-hidden ${backgrounds[variant]}`}
      >
        <div className="absolute left-1/2 top-[18%] h-12 w-20 -translate-x-1/2 border border-[#c6ae86]/40 bg-white/5" />

        <div
          className={`absolute left-1/2 top-[29%] h-[47%] ${bottleWidths[variant]} -translate-x-1/2 rounded-[30px] border border-[#c6ae86]/45 bg-white/5`}
        />

        <div className="absolute left-1/2 top-[42%] flex h-[18%] w-[29%] -translate-x-1/2 items-center justify-center border border-[#c6ae86]/30 text-[9px] tracking-[0.22em] text-[#d3bd96] uppercase">
          F&K
        </div>

        <div
          className={`absolute ${
            variant === 1 ? "left-[15%]" : "right-[16%]"
          } top-[14%] h-24 w-24 rounded-full border border-[#c6ae86]/20`}
        />

        {variant === 2 && (
          <div className="absolute bottom-[13%] left-[15%] h-px w-[70%] bg-[#c6ae86]/15" />
        )}
      </div>
    );
  }

  const backgrounds = [
    "bg-[linear-gradient(145deg,#b4b6a3,#d5d5c8)]",
    "bg-[linear-gradient(145deg,#aeb0a1,#dad7c9)]",
    "bg-[linear-gradient(145deg,#c3bba9,#e3ddd2)]",
  ];

  const rotations = ["rotate-0", "-rotate-2", "rotate-2"];

  return (
    <div
      aria-hidden="true"
      className={`relative h-full min-h-[310px] overflow-hidden ${backgrounds[variant]}`}
    >
      <div
        className={`absolute left-1/2 top-[20%] h-[26%] w-[55%] -translate-x-1/2 border border-white/40 bg-white/10 ${rotations[variant]}`}
      />

      <div className="absolute left-1/2 top-[38%] h-[27%] w-[66%] -translate-x-1/2 border border-white/40 bg-white/10" />

      <div
        className={`absolute left-1/2 top-[56%] h-[22%] ${
          variant === 1 ? "w-[78%]" : "w-[72%]"
        } -translate-x-1/2 border border-white/35 bg-white/10`}
      />

      {variant === 2 && (
        <div className="absolute right-[14%] top-[15%] h-20 w-20 rounded-full border border-white/25" />
      )}

      <div className="absolute left-[32%] top-[48%] h-px w-[38%] -rotate-3 bg-[#727665]/25" />
    </div>
  );
}
