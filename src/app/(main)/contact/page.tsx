export default function ContactPage() {
  return (
    <div style={{ background: "linear-gradient(180deg,#faf8f4 0%,#fff 100%)", minHeight: "100vh" }}>
      <section style={{ width: "min(980px, calc(100% - 40px))", margin: "0 auto", padding: "96px 0" }}>
        <div style={{ fontSize: 11, letterSpacing: ".24em", textTransform: "uppercase", color: "rgba(11,11,10,.45)", marginBottom: 18 }}>Contact</div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(44px, 7vw, 88px)", letterSpacing: ".12em", lineHeight: .9, margin: 0 }}>Let&apos;s talk.</h1>
        <p style={{ maxWidth: 620, marginTop: 20, color: "rgba(11,11,10,.62)", lineHeight: 1.8, fontSize: 15 }}>
          Reach out for brand enquiries, styling support, custom orders, or collaboration opportunities.
        </p>
        <div style={{ marginTop: 34, display: "grid", gap: 16 }}>
          <div style={{ border: "1px solid rgba(11,11,10,.08)", background: "rgba(255,255,255,.7)", padding: 22 }}><strong>Email</strong><div>hello@ankaraaura.com</div></div>
          <div style={{ border: "1px solid rgba(11,11,10,.08)", background: "rgba(255,255,255,.7)", padding: 22 }}><strong>Instagram</strong><div>@ankaraaura</div></div>
          <div style={{ border: "1px solid rgba(11,11,10,.08)", background: "rgba(255,255,255,.7)", padding: 22 }}><strong>Studio</strong><div>Accra, Ghana</div></div>
        </div>
      </section>
    </div>
  );
}
