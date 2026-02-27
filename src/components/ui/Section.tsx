import SectionWatermark from "@/components/ui/SectionWatermark";

export default function Section({
  children,
  title,
  subtitle,
  watermarkTop,
  watermarkBottom,
  className = "",
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  watermarkTop?: string;
  watermarkBottom?: string;
  className?: string;
}) {
  return (
    <section className={"relative bg-white " + className}>
      <SectionWatermark
        top={watermarkTop || "ANKARA"}
        bottom={watermarkBottom || "AURA"}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14">
        {(title || subtitle) && (
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              {title && <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>}
              {subtitle && <p className="mt-2 text-sm text-black/60 max-w-2xl">{subtitle}</p>}
            </div>
          </div>
        )}

        <div className={title || subtitle ? "mt-8" : ""}>{children}</div>
      </div>
    </section>
  );
}