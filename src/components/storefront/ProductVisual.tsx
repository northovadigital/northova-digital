type ProductVisualProps = {
  category: string;
};

export function ProductVisual({ category }: ProductVisualProps) {
  if (category === "fashion") {
    return (
      <div
        aria-hidden="true"
        className="relative h-full min-h-[310px] overflow-hidden bg-[#d8cec0]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(145deg,#d4c9ba,#ebe5dc)]" />

        <div className="absolute left-1/2 top-[17%] h-[58%] w-[42%] -translate-x-1/2 rounded-t-[100px] border border-white/55 bg-white/16" />

        <div className="absolute left-[28%] top-[28%] h-[45%] w-[24%] -rotate-12 border border-[#817566]/20 bg-white/10" />

        <div className="absolute right-[28%] top-[30%] h-[45%] w-[24%] rotate-12 border border-[#817566]/20 bg-white/10" />

        <div className="absolute bottom-8 left-1/2 h-px w-[46%] -translate-x-1/2 bg-[#756b60]/25" />
      </div>
    );
  }

  if (category === "fragrances") {
    return (
      <div
        aria-hidden="true"
        className="relative h-full min-h-[310px] overflow-hidden bg-[#292723]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,#4f493f_0%,#292723_42%,#211f1c_100%)]" />

        <div className="absolute left-1/2 top-[18%] h-12 w-20 -translate-x-1/2 border border-[#c6ae86]/40 bg-white/5" />

        <div className="absolute left-1/2 top-[29%] h-[47%] w-[42%] -translate-x-1/2 rounded-[30px] border border-[#c6ae86]/45 bg-white/5" />

        <div className="absolute left-1/2 top-[42%] flex h-[18%] w-[29%] -translate-x-1/2 items-center justify-center border border-[#c6ae86]/30 text-[9px] tracking-[0.22em] text-[#d3bd96] uppercase">
          F&K
        </div>

        <div className="absolute right-[19%] top-[16%] h-24 w-24 rounded-full border border-[#c6ae86]/20" />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="relative h-full min-h-[310px] overflow-hidden bg-[#bfc0ae]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,#b4b6a3,#d5d5c8)]" />

      <div className="absolute left-1/2 top-[20%] h-[26%] w-[55%] -translate-x-1/2 border border-white/40 bg-white/10" />

      <div className="absolute left-1/2 top-[38%] h-[27%] w-[66%] -translate-x-1/2 border border-white/40 bg-white/10" />

      <div className="absolute left-1/2 top-[56%] h-[22%] w-[72%] -translate-x-1/2 border border-white/35 bg-white/10" />

      <div className="absolute left-[32%] top-[48%] h-px w-[38%] -rotate-3 bg-[#727665]/25" />
    </div>
  );
}
