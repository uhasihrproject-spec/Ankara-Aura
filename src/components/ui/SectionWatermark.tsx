export default function SectionWatermark({
  top = "ANKARA",
  bottom = "AURA",
  className = "",
}: {
  top?: string;
  bottom?: string;
  className?: string;
}) {
  return (
    <div className={"pointer-events-none absolute inset-0 overflow-hidden " + className}>
      <div className="absolute -top-8 -left-6 text-[92px] sm:text-[120px] md:text-[160px] font-black tracking-tight text-black/[0.05] leading-none select-none whitespace-nowrap">
        {top}
      </div>
      <div className="absolute top-20 sm:top-28 md:top-36 -left-6 text-[92px] sm:text-[120px] md:text-[160px] font-black tracking-tight text-black/[0.05] leading-none select-none whitespace-nowrap">
        {bottom}
      </div>
    </div>
  );
}