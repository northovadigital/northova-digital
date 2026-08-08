type ArrowUpRightProps = {
  className?: string;
};

export function ArrowUpRight({ className = "" }: ArrowUpRightProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6 14L14 6" />
      <path d="M8 6H14V12" />
    </svg>
  );
}
