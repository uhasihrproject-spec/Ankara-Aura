import Link from "next/link";
import AnkaraPattern from "@/components/site/AnkaraPattern";

export default function CustomizePage() {
  return (
    <div style={{ background: "linear-gradient(180deg,#faf8f4 0%,#fff 100%)", minHeight: "100vh" }}>
      <section style={{ width: "min(1160px, calc(100% - 40px))", margin: "0 auto", padding: "88px 0", display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 24 }}>
        <div style={{ position: "relative", border: "1px solid rgba(11,11,10,.08)", background: "rgba(255,255,255,.72)", overflow: "hidden", padding: 32 }}>
          <AnkaraPattern id="customize-page" opacity={0.05} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 11, letterSpacing: ".24em", textTransform: "uppercase", color: "rgba(11,11,10,.45)", marginBottom: 18 }}>Customize</div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(44px, 7vw, 92px)", letterSpacing: ".12em", lineHeight: .9, margin: 0 }}>Design your piece separately from the shop.</h1>
            <p style={{ maxWidth: 620, marginTop: 20, color: "rgba(11,11,10,.62)", lineHeight: 1.8, fontSize: 15 }}>
              Custom work lives on its own route so it feels intentional. Start with silhouette, fit, material direction, and Ankara accents — then refine with the studio.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
              <Link href="/contact" style={{ minHeight: 44, padding: "0 20px", display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none", background: "#0b0b0a", color: "#f7f6f4", border: "1px solid #0b0b0a", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase" }}>Start a custom order</Link>
              <Link href="/shop" style={{ minHeight: 44, padding: "0 20px", display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none", background: "transparent", color: "#0b0b0a", border: "1px solid rgba(11,11,10,.14)", fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase" }}>Back to shop</Link>
            </div>
          </div>
        </div>
        <div style={{ border: "1px solid rgba(11,11,10,.08)", background: "linear-gradient(180deg, rgba(212,168,67,.12), rgba(255,255,255,.86))", padding: 32 }}>
          <div style={{ fontSize: 11, letterSpacing: ".24em", textTransform: "uppercase", color: "rgba(11,11,10,.45)", marginBottom: 18 }}>Flow</div>
          <ol style={{ margin: 0, paddingLeft: 18, color: "rgba(11,11,10,.62)", lineHeight: 2 }}>
            <li>Choose the garment direction.</li>
            <li>Set fit and silhouette notes.</li>
            <li>Discuss fabric and Ankara detail placement.</li>
            <li>Approve the final production brief.</li>
          </ol>
        </div>
      </section>
    </div>
  );
}
