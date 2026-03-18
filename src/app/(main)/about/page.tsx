import AnkaraPattern from "@/components/site/AnkaraPattern";

export default function AboutPage() {
  return (
    <div style={{ background: "linear-gradient(180deg,#faf8f4 0%,#fff 100%)", minHeight: "100vh", position: "relative" }}>
      <section style={{ width: "min(1100px, calc(100% - 40px))", margin: "0 auto", padding: "96px 0", position: "relative", overflow: "hidden", border: "1px solid rgba(11,11,10,.08)", background: "rgba(255,255,255,.72)" }}>
        <AnkaraPattern id="about-page" opacity={0.06} />
        <div style={{ position: "relative", zIndex: 1, padding: "0 32px" }}>
          <div style={{ fontSize: 11, letterSpacing: ".24em", textTransform: "uppercase", color: "rgba(11,11,10,.45)", marginBottom: 18 }}>About Ankara Aura</div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px, 8vw, 108px)", letterSpacing: ".12em", lineHeight: .88, margin: 0 }}>Modern silhouette. Subtle pattern. Strong identity.</h1>
          <p style={{ maxWidth: 760, marginTop: 24, color: "rgba(11,11,10,.62)", lineHeight: 1.9, fontSize: 15 }}>
            Ankara Aura is built around a clear idea: African pattern language can be present without overwhelming the garment. The brand focuses on clean construction, luxury-streetwear proportions, and details that feel intentional rather than decorative.
          </p>
        </div>
      </section>
    </div>
  );
}
