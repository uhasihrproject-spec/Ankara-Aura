"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

/* ── Ankara SVG stripe ── */
function KenteStripe() {
  return (
    <div style={{
      height: 4, width: "100%",
      background: "repeating-linear-gradient(90deg,#c8502a 0,#c8502a 20px,#d4a843 20px,#d4a843 40px,#1a3a5c 40px,#1a3a5c 60px,#2d6a4f 60px,#2d6a4f 80px)",
      backgroundSize: "80px 100%",
    }}/>
  );
}

/* ── Step indicator ── */
function Steps({ current }: { current: number }) {
  const steps = ["Bag", "Shipping", "Payment", "Review"];
  return (
    <div className="co-steps">
      {steps.map((s, i) => (
        <div key={s} className={`co-step${i < current ? " done" : ""}${i === current ? " active" : ""}`}>
          <div className="co-step-num">
            {i < current ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            ) : i + 1}
          </div>
          <span className="co-step-label">{s}</span>
          {i < steps.length - 1 && <div className="co-step-line"/>}
        </div>
      ))}
    </div>
  );
}

/* ── Order summary item ── */
function OrderItem({ item }: { item: any }) {
  const colors: Record<string, string> = {
    "ankara-oversized-tee": "#c8502a",
    "kente-blazer":          "#2d6a4f",
    "mono-cargo-pant":       "#333",
    "adinkra-hoodie":        "#8b2635",
    "wax-print-tee":         "#1a3a5c",
    "linen-short-set":       "#c8502a",
  };
  const swatchColor = colors[item.slug] || item.color || "#c8502a";

  return (
    <div className="co-item">
      <div className="co-item-swatch" style={{ background: swatchColor }}/>
      <div className="co-item-info">
        <div className="co-item-name">{item.name}</div>
        <div className="co-item-meta">
          {item.size && <span>Size {item.size}</span>}
          <span>× {item.qty}</span>
        </div>
      </div>
      <div className="co-item-price">GH₵ {(item.price * item.qty).toLocaleString()}</div>
    </div>
  );
}

/* ── Field component ── */
function Field({
  label, name, type = "text", value, onChange, placeholder, half = false, required = false
}: {
  label: string; name: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; half?: boolean; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className={`co-field${half ? " co-field--half" : ""}${focused ? " focused" : ""}${value ? " has-val" : ""}`}>
      <label className="co-field-label" htmlFor={name}>{label}{required && " *"}</label>
      <input
        id={name} type={type} value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="co-field-input"
        autoComplete={name}
      />
    </div>
  );
}

/* ── Select ── */
function SelectField({ label, name, value, onChange, options, half = false }: {
  label: string; name: string; value: string;
  onChange: (v: string) => void; options: string[]; half?: boolean;
}) {
  return (
    <div className={`co-field${half ? " co-field--half" : ""}${value ? " has-val" : ""}`}>
      <label className="co-field-label" htmlFor={name}>{label}</label>
      <select
        id={name} value={value} onChange={e => onChange(e.target.value)}
        className="co-field-input co-select"
      >
        <option value="">Select…</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export default function CheckoutPage() {
  const { items, totalPrice, totalQty, clearCart } = useCart();
  const [step, setStep] = useState(0); // 0=bag, 1=shipping, 2=payment, 3=review
  const [placed, setPlaced] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [orderNum] = useState(() => `AA-${Date.now().toString(36).toUpperCase()}`);

  /* ─ shipping form ─ */
  const [shipping, setShipping] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", region: "", country: "Ghana", zip: "",
    method: "standard",
  });

  /* ─ payment form ─ */
  const [payment, setPayment] = useState({
    method: "card",
    cardName: "", cardNum: "", expiry: "", cvv: "",
    momo: "",
  });

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const discount = promoApplied ? Math.floor(totalPrice * 0.1) : 0;

  const shippingCost = shipping.method === "express" ? 50 : shipping.method === "overnight" ? 120 : 0;
  const orderTotal = totalPrice - discount + shippingCost;

  const sh = (k: keyof typeof shipping) => (v: string) => setShipping(p => ({ ...p, [k]: v }));
  const py = (k: keyof typeof payment) => (v: string) => setPayment(p => ({ ...p, [k]: v }));

  const formatCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => v.replace(/\D/g, "").slice(0, 4).replace(/(.{2})/, "$1/");

  const canProceedShipping = shipping.firstName && shipping.lastName && shipping.email && shipping.address && shipping.city;
  const canProceedPayment = payment.method === "momo"
    ? payment.momo.length >= 10
    : payment.cardName && payment.cardNum.replace(/\s/g,"").length === 16 && payment.expiry.length === 5 && payment.cvv.length >= 3;

  const placeOrder = () => {
    setPlacing(true);
    setTimeout(() => { setPlacing(false); setPlaced(true); clearCart(); }, 2200);
  };

  /* empty cart guard */
  if (!placing && !placed && items.length === 0 && step < 3) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="co-page">
          <KenteStripe/>
          <div className="co-empty">
            <div className="co-empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <h1 className="co-empty-title">Your bag is empty</h1>
            <p className="co-empty-sub">Add some pieces before checking out.</p>
            <Link href="/shop" className="co-empty-btn">Browse the Drop →</Link>
          </div>
        </div>
      </>
    );
  }

  /* order placed */
  if (placed) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="co-page">
          <KenteStripe/>
          <div className="co-confirmed">
            <div className="co-confirmed-inner">
              <div className="co-check-wrap">
                <div className="co-check-ring"/>
                <svg className="co-check-icon" viewBox="0 0 40 40" fill="none">
                  <path d="M10 20l8 8 14-14" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="co-check-path"/>
                </svg>
              </div>
              <p className="co-conf-tag">Order Placed</p>
              <h1 className="co-conf-title">You're in the Aura.</h1>
              <div className="co-conf-num">{orderNum}</div>
              <p className="co-conf-body">
                Your pieces are being prepared. We'll send a confirmation to{" "}
                <strong>{shipping.email || "your email"}</strong>.<br/>
                Estimated delivery: <strong>{shipping.method === "overnight" ? "Next day" : shipping.method === "express" ? "2–3 days" : "5–7 days"}</strong>.
              </p>
              <div className="co-conf-details">
                <div className="co-conf-row"><span>Order</span><span>{orderNum}</span></div>
                <div className="co-conf-row"><span>To</span><span>{shipping.firstName} {shipping.lastName}</span></div>
                <div className="co-conf-row"><span>City</span><span>{shipping.city || "—"}</span></div>
                <div className="co-conf-row"><span>Total</span><span>GH₵ {orderTotal.toLocaleString()}</span></div>
              </div>
              <div className="co-conf-actions">
                <Link href="/shop" className="co-conf-btn-fill">Continue Shopping</Link>
                <Link href="/" className="co-conf-btn-ghost">Back to Home</Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="co-page">
        <KenteStripe/>

        {/* header */}
        <header className="co-header">
          <Link href="/" className="co-logo">
            <div className="co-logo-mark">AA</div>
            <div>
              <div className="co-logo-name">Ankara Aura</div>
              <div className="co-logo-sub">Secure Checkout</div>
            </div>
          </Link>
          <div className="co-secure">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span>SSL Secured</span>
          </div>
        </header>

        {/* steps */}
        <div className="co-steps-wrap">
          <Steps current={step}/>
        </div>

        {/* body */}
        <div className="co-layout">

          {/* ── LEFT: form panels ── */}
          <div className="co-form-area">

            {/* STEP 0: bag review */}
            {step === 0 && (
              <div className="co-panel co-panel-in">
                <div className="co-panel-head">
                  <h2 className="co-panel-title">Your Bag</h2>
                  <span className="co-panel-count">{totalQty} piece{totalQty !== 1 ? "s" : ""}</span>
                </div>
                <div className="co-bag-items">
                  {items.map(item => <OrderItem key={`${item.slug}-${item.size}`} item={item}/>)}
                </div>

                {/* promo */}
                <div className="co-promo">
                  <div className="co-promo-row">
                    <input
                      className="co-promo-input"
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={e => setPromoCode(e.target.value)}
                    />
                    <button
                      className={`co-promo-btn${promoApplied ? " applied" : ""}`}
                      onClick={() => { if (promoCode.length > 2) setPromoApplied(true); }}
                      disabled={promoApplied}
                    >
                      {promoApplied ? "✓ Applied" : "Apply"}
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="co-promo-ok">10% discount applied — AURA10</p>
                  )}
                </div>

                <button className="co-next-btn" onClick={() => setStep(1)}>
                  Proceed to Shipping →
                </button>
              </div>
            )}

            {/* STEP 1: shipping */}
            {step === 1 && (
              <div className="co-panel co-panel-in">
                <div className="co-panel-head">
                  <button className="co-back" onClick={() => setStep(0)}>← Back</button>
                  <h2 className="co-panel-title">Shipping Details</h2>
                </div>

                <div className="co-fields">
                  <Field label="First name" name="firstName" value={shipping.firstName} onChange={sh("firstName")} placeholder="Kofi" half required/>
                  <Field label="Last name" name="lastName" value={shipping.lastName} onChange={sh("lastName")} placeholder="Mensah" half required/>
                  <Field label="Email address" name="email" type="email" value={shipping.email} onChange={sh("email")} placeholder="kofi@example.com" required/>
                  <Field label="Phone number" name="phone" type="tel" value={shipping.phone} onChange={sh("phone")} placeholder="+233 24 000 0000" half/>
                  <Field label="Street address" name="address" value={shipping.address} onChange={sh("address")} placeholder="25 Ring Road Central" required/>
                  <Field label="City" name="city" value={shipping.city} onChange={sh("city")} placeholder="Accra" half required/>
                  <SelectField label="Region" name="region" value={shipping.region} onChange={sh("region")} half
                    options={["Greater Accra","Ashanti","Western","Eastern","Northern","Brong-Ahafo","Volta","Central","Upper East","Upper West"]}
                  />
                  <SelectField label="Country" name="country" value={shipping.country} onChange={sh("country")} half
                    options={["Ghana","Nigeria","Kenya","South Africa","UK","USA","Canada"]}
                  />
                </div>

                {/* shipping method */}
                <div className="co-shipping-methods">
                  <p className="co-sm-label">Shipping Method</p>
                  {[
                    { id: "standard", name: "Standard Delivery", sub: "5–7 business days", price: "Free" },
                    { id: "express",  name: "Express Delivery",  sub: "2–3 business days", price: "GH₵ 50" },
                    { id: "overnight",name: "Overnight Delivery", sub: "Next business day",  price: "GH₵ 120" },
                  ].map(m => (
                    <button
                      key={m.id}
                      className={`co-sm-option${shipping.method === m.id ? " on" : ""}`}
                      onClick={() => sh("method")(m.id)}
                    >
                      <div className="co-sm-radio">
                        {shipping.method === m.id && <div className="co-sm-radio-dot"/>}
                      </div>
                      <div className="co-sm-info">
                        <span className="co-sm-name">{m.name}</span>
                        <span className="co-sm-sub">{m.sub}</span>
                      </div>
                      <span className="co-sm-price">{m.price}</span>
                    </button>
                  ))}
                </div>

                <button
                  className={`co-next-btn${!canProceedShipping ? " disabled" : ""}`}
                  onClick={() => canProceedShipping && setStep(2)}
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* STEP 2: payment */}
            {step === 2 && (
              <div className="co-panel co-panel-in">
                <div className="co-panel-head">
                  <button className="co-back" onClick={() => setStep(1)}>← Back</button>
                  <h2 className="co-panel-title">Payment</h2>
                </div>

                {/* method tabs */}
                <div className="co-pay-tabs">
                  {[
                    { id: "card",  label: "Card" },
                    { id: "momo",  label: "Mobile Money" },
                    { id: "bank",  label: "Bank Transfer" },
                  ].map(t => (
                    <button
                      key={t.id}
                      className={`co-pay-tab${payment.method === t.id ? " on" : ""}`}
                      onClick={() => py("method")(t.id)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {payment.method === "card" && (
                  <div className="co-fields">
                    {/* card preview */}
                    <div className="co-card-preview">
                      <div className="co-card-chip"/>
                      <div className="co-card-num">{payment.cardNum || "•••• •••• •••• ••••"}</div>
                      <div className="co-card-bottom">
                        <span className="co-card-name">{payment.cardName || "CARDHOLDER NAME"}</span>
                        <span className="co-card-exp">{payment.expiry || "MM/YY"}</span>
                      </div>
                    </div>
                    <Field label="Name on card" name="cardName" value={payment.cardName} onChange={py("cardName")} placeholder="KOFI MENSAH"/>
                    <Field label="Card number" name="cardNum" value={payment.cardNum} onChange={v => py("cardNum")(formatCard(v))} placeholder="1234 5678 9012 3456"/>
                    <Field label="Expiry" name="expiry" value={payment.expiry} onChange={v => py("expiry")(formatExpiry(v))} placeholder="MM/YY" half/>
                    <Field label="CVV" name="cvv" value={payment.cvv} onChange={v => py("cvv")(v.replace(/\D/g,"").slice(0,4))} placeholder="123" half type="password"/>
                  </div>
                )}

                {payment.method === "momo" && (
                  <div className="co-fields co-momo-wrap">
                    <div className="co-momo-logos">
                      {["MTN","Vodafone","AirtelTigo"].map(n => (
                        <div key={n} className="co-momo-logo">{n}</div>
                      ))}
                    </div>
                    <Field label="Mobile Money number" name="momo" type="tel" value={payment.momo} onChange={py("momo")} placeholder="+233 24 000 0000"/>
                    <p className="co-momo-note">You'll receive a prompt on your phone to confirm payment.</p>
                  </div>
                )}

                {payment.method === "bank" && (
                  <div className="co-bank-details">
                    <p className="co-bank-label">Transfer to this account:</p>
                    {[
                      ["Bank", "GCB Bank Ltd"],
                      ["Account Name", "Ankara Aura Ltd"],
                      ["Account Number", "1234567890"],
                      ["Branch", "Accra Central"],
                      ["Reference", orderNum],
                    ].map(([k, v]) => (
                      <div key={k} className="co-bank-row">
                        <span className="co-bank-key">{k}</span>
                        <span className="co-bank-val">{v}</span>
                      </div>
                    ))}
                    <p className="co-bank-note">Send proof of payment to orders@ankaraaura.com after transfer.</p>
                  </div>
                )}

                <button
                  className={`co-next-btn${!canProceedPayment && payment.method === "card" ? " disabled" : ""}`}
                  onClick={() => setStep(3)}
                >
                  Review Order →
                </button>
              </div>
            )}

            {/* STEP 3: review */}
            {step === 3 && (
              <div className="co-panel co-panel-in">
                <div className="co-panel-head">
                  <button className="co-back" onClick={() => setStep(2)}>← Back</button>
                  <h2 className="co-panel-title">Review &amp; Place</h2>
                </div>

                <div className="co-review-sections">
                  {/* shipping review */}
                  <div className="co-review-block">
                    <div className="co-review-head">
                      <span className="co-review-block-title">Shipping to</span>
                      <button className="co-review-edit" onClick={() => setStep(1)}>Edit</button>
                    </div>
                    <p className="co-review-line">{shipping.firstName} {shipping.lastName}</p>
                    <p className="co-review-line">{shipping.address}</p>
                    <p className="co-review-line">{shipping.city}, {shipping.region} — {shipping.country}</p>
                    <p className="co-review-line" style={{marginTop:4}}>{shipping.email}</p>
                  </div>

                  {/* payment review */}
                  <div className="co-review-block">
                    <div className="co-review-head">
                      <span className="co-review-block-title">Payment</span>
                      <button className="co-review-edit" onClick={() => setStep(2)}>Edit</button>
                    </div>
                    {payment.method === "card" && (
                      <p className="co-review-line">Card ending in {payment.cardNum.replace(/\s/g,"").slice(-4) || "––"}</p>
                    )}
                    {payment.method === "momo" && <p className="co-review-line">Mobile Money — {payment.momo}</p>}
                    {payment.method === "bank" && <p className="co-review-line">Bank Transfer — Ref: {orderNum}</p>}
                  </div>

                  {/* items */}
                  <div className="co-review-block">
                    <div className="co-review-head">
                      <span className="co-review-block-title">Your Pieces</span>
                      <button className="co-review-edit" onClick={() => setStep(0)}>Edit</button>
                    </div>
                    {items.map(item => <OrderItem key={`${item.slug}-${item.size}`} item={item}/>)}
                  </div>
                </div>

                {/* terms */}
                <p className="co-terms">
                  By placing your order you agree to our{" "}
                  <Link href="/terms" className="co-terms-link">Terms & Conditions</Link> and{" "}
                  <Link href="/privacy" className="co-terms-link">Privacy Policy</Link>.
                </p>

                <button
                  className={`co-place-btn${placing ? " loading" : ""}`}
                  onClick={placeOrder}
                  disabled={placing}
                >
                  {placing ? (
                    <><span className="co-spinner"/>Processing…</>
                  ) : (
                    <>Place Order — GH₵ {orderTotal.toLocaleString()}</>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* ── RIGHT: order summary (sticky) ── */}
          <aside className="co-summary">
            <div className="co-summary-inner">
              <h3 className="co-summary-title">Order Summary</h3>

              <div className="co-summary-items">
                {items.map(item => <OrderItem key={`${item.slug}-${item.size}`} item={item}/>)}
              </div>

              <div className="co-summary-lines">
                <div className="co-sum-row">
                  <span>Subtotal ({totalQty} piece{totalQty !== 1 ? "s" : ""})</span>
                  <span>GH₵ {totalPrice.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="co-sum-row co-sum-row--green">
                    <span>Promo (AURA10)</span>
                    <span>− GH₵ {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="co-sum-row">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? "Free" : `GH₵ ${shippingCost}`}</span>
                </div>
                <div className="co-sum-divider"/>
                <div className="co-sum-row co-sum-row--total">
                  <span>Total</span>
                  <span>GH₵ {orderTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="co-summary-badges">
                {["SSL Encrypted","Free Returns","Carbon Neutral"].map(b => (
                  <span key={b} className="co-badge">{b}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════
   STYLES
════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink:#0b0b0a; --cream:#f7f6f4; --kente:#c8502a;
    --gold:#d4a843; --indigo:#1a3a5c; --forest:#2d6a4f;
    --b:rgba(8,8,7,0.09);
    --fd:'Bebas Neue',sans-serif; --fb:'DM Sans',sans-serif; --fa:'Caveat',cursive;
  }
  body { background:var(--cream); color:var(--ink); font-family:var(--fb); overflow-x:hidden; }

  /* ── page wrapper ── */
  .co-page { min-height:100vh; background:var(--cream); }

  /* ── header ── */
  .co-header {
    display:flex; align-items:center; justify-content:space-between;
    padding:16px 48px;
    border-bottom:1px solid var(--b);
    position:sticky; top:0; background:var(--cream); z-index:50;
  }
  .co-logo { display:flex; align-items:center; gap:12px; text-decoration:none; color:var(--ink); }
  .co-logo-mark {
    width:36px; height:36px; background:var(--ink); color:var(--cream);
    font-family:var(--fd); font-size:16px; letter-spacing:0.06em;
    display:flex; align-items:center; justify-content:center;
  }
  .co-logo-name { font-family:var(--fd); font-size:18px; letter-spacing:0.08em; line-height:1; }
  .co-logo-sub { font-family:var(--fa); font-size:11px; color:rgba(8,8,7,0.38); margin-top:1px; }
  .co-secure { display:flex; align-items:center; gap:6px; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:rgba(8,8,7,0.35); }

  /* ── steps ── */
  .co-steps-wrap { padding:24px 48px; border-bottom:1px solid var(--b); overflow-x:auto; }
  .co-steps { display:flex; align-items:center; gap:0; min-width:fit-content; }
  .co-step { display:flex; align-items:center; gap:10px; }
  .co-step-num {
    width:28px; height:28px; border-radius:50%; flex-shrink:0;
    border:1.5px solid var(--b); background:white;
    display:flex; align-items:center; justify-content:center;
    font-size:11px; font-family:var(--fb); color:rgba(8,8,7,0.35);
    transition:all 0.3s;
  }
  .co-step.active .co-step-num { border-color:var(--kente); background:var(--kente); color:white; }
  .co-step.done .co-step-num { border-color:var(--forest); background:var(--forest); }
  .co-step-label {
    font-size:11px; letter-spacing:0.12em; text-transform:uppercase;
    color:rgba(8,8,7,0.35); transition:color 0.3s; white-space:nowrap;
    font-family:var(--fb);
  }
  .co-step.active .co-step-label { color:var(--ink); }
  .co-step.done .co-step-label { color:var(--forest); }
  .co-step-line { width:48px; height:1px; background:var(--b); margin:0 8px; flex-shrink:0; transition:background 0.3s; }
  .co-step.done .co-step-line { background:var(--forest); }

  /* ── layout ── */
  .co-layout {
    display:grid; grid-template-columns:1fr 380px;
    gap:1px; min-height:calc(100vh - 140px);
    background:var(--b);
  }
  .co-form-area { background:var(--cream); padding:40px 48px; }
  .co-summary { background:#f2f0ed; position:sticky; top:100px; align-self:start; }
  .co-summary-inner { padding:32px 28px; }

  /* ── panel ── */
  .co-panel { animation:panelIn 0.5s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes panelIn { from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:translateX(0)} }
  .co-panel-head { display:flex; align-items:center; gap:16px; margin-bottom:28px; flex-wrap:wrap; }
  .co-panel-title { font-family:var(--fd); font-size:28px; letter-spacing:0.06em; }
  .co-panel-count { font-family:var(--fa); font-size:15px; color:rgba(8,8,7,0.35); margin-left:auto; }
  .co-back {
    background:none; border:none; cursor:pointer;
    font-family:var(--fb); font-size:11px; letter-spacing:0.12em; text-transform:uppercase;
    color:rgba(8,8,7,0.4); padding:0;
    transition:color 0.2s;
  }
  .co-back:hover { color:var(--kente); }

  /* ── items ── */
  .co-bag-items, .co-summary-items { display:flex; flex-direction:column; gap:0; }
  .co-item {
    display:flex; align-items:center; gap:14px;
    padding:14px 0; border-bottom:1px solid var(--b);
    animation:itemIn 0.4s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes itemIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .co-item-swatch { width:40px; height:40px; border-radius:2px; flex-shrink:0; }
  .co-item-info { flex:1; min-width:0; }
  .co-item-name { font-family:var(--fd); font-size:15px; letter-spacing:0.04em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .co-item-meta { font-size:11px; color:rgba(8,8,7,0.4); margin-top:3px; display:flex; gap:8px; }
  .co-item-price { font-family:var(--fd); font-size:16px; letter-spacing:0.04em; flex-shrink:0; }

  /* ── promo ── */
  .co-promo { margin:20px 0 28px; }
  .co-promo-row { display:flex; gap:0; border:1px solid var(--b); }
  .co-promo-input {
    flex:1; padding:12px 16px; border:none; background:transparent;
    font-family:var(--fb); font-size:13px; color:var(--ink); outline:none;
  }
  .co-promo-input::placeholder { color:rgba(8,8,7,0.3); }
  .co-promo-btn {
    padding:12px 20px; border:none; border-left:1px solid var(--b);
    background:none; cursor:pointer;
    font-family:var(--fb); font-size:11px; letter-spacing:0.12em; text-transform:uppercase;
    color:rgba(8,8,7,0.6); transition:background 0.2s, color 0.2s;
    white-space:nowrap;
  }
  .co-promo-btn:hover { background:var(--ink); color:white; }
  .co-promo-btn.applied { background:var(--forest); color:white; }
  .co-promo-ok { font-family:var(--fa); font-size:14px; color:var(--forest); margin-top:8px; }

  /* ── fields ── */
  .co-fields { display:flex; flex-wrap:wrap; gap:12px; margin-bottom:24px; }
  .co-field {
    flex:1 1 100%; display:flex; flex-direction:column; gap:6px;
    transition:opacity 0.2s;
  }
  .co-field--half { flex:1 1 calc(50% - 6px); min-width:140px; }
  .co-field-label {
    font-size:10px; letter-spacing:0.18em; text-transform:uppercase;
    color:rgba(8,8,7,0.42); font-family:var(--fb);
    transition:color 0.2s;
  }
  .co-field.focused .co-field-label { color:var(--kente); }
  .co-field-input {
    padding:13px 14px; border:1px solid var(--b); background:white;
    font-family:var(--fb); font-size:14px; color:var(--ink); outline:none;
    transition:border-color 0.2s;
    width:100%;
  }
  .co-field-input:focus { border-color:var(--kente); }
  .co-select { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%230b0b0a' stroke-opacity='.35' stroke-width='1.5' fill='none'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 14px center; padding-right:36px; cursor:pointer; }

  /* ── shipping methods ── */
  .co-shipping-methods { display:flex; flex-direction:column; gap:10px; margin-bottom:28px; }
  .co-sm-label { font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:rgba(8,8,7,0.38); margin-bottom:6px; font-family:var(--fb); }
  .co-sm-option {
    display:flex; align-items:center; gap:14px;
    padding:16px 18px; border:1.5px solid var(--b); background:white;
    cursor:pointer; text-align:left; transition:border-color 0.2s, background 0.2s;
    width:100%;
  }
  .co-sm-option.on { border-color:var(--kente); background:rgba(200,80,42,0.03); }
  .co-sm-radio {
    width:18px; height:18px; border-radius:50%; border:1.5px solid var(--b);
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
    transition:border-color 0.2s;
  }
  .co-sm-option.on .co-sm-radio { border-color:var(--kente); }
  .co-sm-radio-dot { width:8px; height:8px; border-radius:50%; background:var(--kente); }
  .co-sm-info { flex:1; display:flex; flex-direction:column; gap:2px; }
  .co-sm-name { font-family:var(--fd); font-size:15px; letter-spacing:0.04em; }
  .co-sm-sub { font-size:11px; color:rgba(8,8,7,0.4); }
  .co-sm-price { font-family:var(--fd); font-size:16px; flex-shrink:0; }

  /* ── payment tabs ── */
  .co-pay-tabs { display:flex; gap:0; border:1px solid var(--b); margin-bottom:24px; }
  .co-pay-tab {
    flex:1; padding:12px; border:none; background:none; cursor:pointer;
    font-family:var(--fb); font-size:12px; letter-spacing:0.1em; text-transform:uppercase;
    color:rgba(8,8,7,0.45); border-right:1px solid var(--b);
    transition:background 0.2s, color 0.2s;
  }
  .co-pay-tab:last-child { border-right:none; }
  .co-pay-tab.on { background:var(--ink); color:var(--cream); }

  /* ── card preview ── */
  .co-card-preview {
    flex:1 1 100%;
    height:160px; border-radius:8px;
    background:linear-gradient(135deg,#1a1a1a 0%,#333 100%);
    padding:24px; display:flex; flex-direction:column; justify-content:space-between;
    margin-bottom:4px; position:relative; overflow:hidden;
  }
  .co-card-preview::after {
    content:''; position:absolute; top:-40px; right:-40px;
    width:160px; height:160px; border-radius:50%;
    background:rgba(200,80,42,0.18);
  }
  .co-card-chip {
    width:36px; height:26px; background:var(--gold); border-radius:4px; opacity:0.85;
  }
  .co-card-num { font-family:var(--fd); font-size:19px; letter-spacing:0.22em; color:rgba(255,255,255,0.85); }
  .co-card-bottom { display:flex; justify-content:space-between; align-items:flex-end; }
  .co-card-name { font-family:var(--fd); font-size:11px; letter-spacing:0.14em; color:rgba(255,255,255,0.5); }
  .co-card-exp { font-family:var(--fd); font-size:14px; letter-spacing:0.12em; color:rgba(255,255,255,0.6); }

  /* ── momo ── */
  .co-momo-wrap { flex-direction:column; }
  .co-momo-logos { display:flex; gap:10px; margin-bottom:16px; flex:1 1 100%; }
  .co-momo-logo {
    padding:8px 16px; border:1px solid var(--b);
    font-family:var(--fd); font-size:11px; letter-spacing:0.1em;
    color:rgba(8,8,7,0.5);
  }
  .co-momo-note { font-family:var(--fa); font-size:14px; color:rgba(8,8,7,0.4); flex:1 1 100%; }

  /* ── bank ── */
  .co-bank-details { border:1px solid var(--b); background:white; margin-bottom:24px; }
  .co-bank-label { padding:12px 16px; font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:rgba(8,8,7,0.38); border-bottom:1px solid var(--b); }
  .co-bank-row { display:flex; justify-content:space-between; padding:12px 16px; border-bottom:1px solid var(--b); gap:16px; }
  .co-bank-row:last-of-type { border-bottom:none; }
  .co-bank-key { font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:rgba(8,8,7,0.35); flex-shrink:0; }
  .co-bank-val { font-family:var(--fd); font-size:15px; letter-spacing:0.04em; text-align:right; }
  .co-bank-note { padding:14px 16px; font-family:var(--fa); font-size:13px; color:rgba(8,8,7,0.45); border-top:1px solid var(--b); }

  /* ── review ── */
  .co-review-sections { display:flex; flex-direction:column; gap:1px; background:var(--b); margin-bottom:24px; }
  .co-review-block { background:white; padding:20px 0; }
  .co-review-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
  .co-review-block-title { font-family:var(--fd); font-size:14px; letter-spacing:0.1em; text-transform:uppercase; }
  .co-review-edit { background:none; border:none; cursor:pointer; font-family:var(--fa); font-size:14px; color:var(--kente); padding:0; }
  .co-review-edit:hover { text-decoration:underline; }
  .co-review-line { font-size:13px; color:rgba(8,8,7,0.6); line-height:1.6; }
  .co-review-line strong { color:var(--ink); }

  /* ── terms ── */
  .co-terms { font-size:11px; color:rgba(8,8,7,0.35); line-height:1.6; margin-bottom:20px; }
  .co-terms-link { color:var(--ink); text-decoration:underline; }

  /* ── buttons ── */
  .co-next-btn, .co-place-btn {
    width:100%; padding:17px; border:none; cursor:pointer;
    font-family:var(--fd); font-size:13px; letter-spacing:0.22em; text-transform:uppercase;
    background:var(--ink); color:var(--cream);
    transition:background 0.25s, transform 0.15s;
    display:flex; align-items:center; justify-content:center; gap:10px;
  }
  .co-next-btn:hover, .co-place-btn:hover { background:var(--kente); transform:translateY(-1px); }
  .co-next-btn.disabled { background:rgba(8,8,7,0.2); cursor:not-allowed; transform:none; }
  .co-place-btn { background:var(--kente); font-size:14px; }
  .co-place-btn:hover { background:var(--ink); }
  .co-place-btn.loading { background:rgba(8,8,7,0.6); cursor:not-allowed; transform:none; }
  .co-spinner {
    width:16px; height:16px; border-radius:50%;
    border:2px solid rgba(247,246,244,0.3);
    border-top-color:white;
    animation:spin 0.7s linear infinite;
  }
  @keyframes spin { to{transform:rotate(360deg)} }

  /* ── summary ── */
  .co-summary-title { font-family:var(--fd); font-size:22px; letter-spacing:0.06em; margin-bottom:20px; }
  .co-summary-lines { margin-top:16px; display:flex; flex-direction:column; gap:10px; }
  .co-sum-row { display:flex; justify-content:space-between; font-size:13px; color:rgba(8,8,7,0.55); }
  .co-sum-row--green { color:var(--forest); }
  .co-sum-row--total { font-family:var(--fd); font-size:18px; letter-spacing:0.04em; color:var(--ink); }
  .co-sum-divider { height:1px; background:var(--b); margin:6px 0; }
  .co-summary-badges { display:flex; flex-wrap:wrap; gap:6px; margin-top:20px; }
  .co-badge {
    font-size:9px; letter-spacing:0.14em; text-transform:uppercase;
    padding:5px 10px; border:1px solid var(--b); color:rgba(8,8,7,0.4);
    font-family:var(--fb);
  }

  /* ── empty ── */
  .co-empty {
    min-height:70vh; display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:16px;
    text-align:center; padding:40px;
  }
  .co-empty-icon { width:56px; height:56px; color:rgba(8,8,7,0.2); }
  .co-empty-icon svg { width:100%; height:100%; }
  .co-empty-title { font-family:var(--fd); font-size:32px; letter-spacing:0.06em; }
  .co-empty-sub { font-family:var(--fa); font-size:16px; color:rgba(8,8,7,0.4); }
  .co-empty-btn {
    margin-top:8px; display:inline-block;
    background:var(--ink); color:var(--cream); padding:13px 28px;
    font-family:var(--fd); font-size:12px; letter-spacing:0.2em; text-transform:uppercase;
    text-decoration:none; transition:background 0.2s;
  }
  .co-empty-btn:hover { background:var(--kente); }

  /* ── confirmed ── */
  .co-confirmed {
    min-height:80vh; display:flex; align-items:center; justify-content:center;
    padding:48px 24px;
  }
  .co-confirmed-inner { max-width:540px; width:100%; text-align:center; }
  .co-check-wrap {
    width:72px; height:72px; margin:0 auto 24px; position:relative;
    display:flex; align-items:center; justify-content:center;
  }
  .co-check-ring {
    position:absolute; inset:0; border-radius:50%;
    border:2px solid var(--forest); opacity:0.3;
    animation:ringPulse 2s ease-in-out infinite;
  }
  @keyframes ringPulse { 0%,100%{transform:scale(1);opacity:0.3} 50%{transform:scale(1.15);opacity:0.1} }
  .co-check-icon { width:72px; height:72px; position:relative; z-index:1; }
  .co-check-path { stroke-dasharray:50; stroke-dashoffset:50; animation:drawCheck 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s forwards; }
  @keyframes drawCheck { to{stroke-dashoffset:0} }
  .co-conf-tag { font-size:10px; letter-spacing:0.24em; text-transform:uppercase; color:var(--forest); margin-bottom:8px; }
  .co-conf-title { font-family:var(--fd); font-size:clamp(36px,6vw,60px); letter-spacing:0.04em; line-height:0.95; margin-bottom:12px; }
  .co-conf-num { font-family:var(--fa); font-size:14px; color:rgba(8,8,7,0.35); margin-bottom:20px; }
  .co-conf-body { font-size:14px; line-height:1.75; color:rgba(8,8,7,0.55); margin-bottom:32px; }
  .co-conf-details {
    border:1px solid var(--b); background:white;
    display:flex; flex-direction:column; margin-bottom:32px;
  }
  .co-conf-row {
    display:flex; justify-content:space-between; padding:13px 18px;
    border-bottom:1px solid var(--b); font-size:13px;
  }
  .co-conf-row:last-child { border-bottom:none; }
  .co-conf-row span:first-child { color:rgba(8,8,7,0.4); }
  .co-conf-row span:last-child { font-family:var(--fd); letter-spacing:0.04em; }
  .co-conf-actions { display:flex; gap:12px; flex-wrap:wrap; justify-content:center; }
  .co-conf-btn-fill {
    display:inline-block; background:var(--ink); color:var(--cream);
    padding:13px 28px; text-decoration:none;
    font-family:var(--fd); font-size:12px; letter-spacing:0.2em; text-transform:uppercase;
    transition:background 0.2s;
  }
  .co-conf-btn-fill:hover { background:var(--kente); }
  .co-conf-btn-ghost {
    display:inline-block; background:none; color:rgba(8,8,7,0.55);
    padding:13px 28px; text-decoration:none;
    font-family:var(--fd); font-size:12px; letter-spacing:0.2em; text-transform:uppercase;
    border:1px solid var(--b); transition:border-color 0.2s, color 0.2s;
  }
  .co-conf-btn-ghost:hover { border-color:var(--ink); color:var(--ink); }

  /* ── MOBILE ── */
  @media (max-width: 900px) {
    .co-layout { grid-template-columns:1fr; }
    .co-summary { position:static; order:-1; }
    .co-summary-inner { padding:24px 20px; }
    .co-summary-items { display:none; }
    .co-header { padding:14px 20px; }
    .co-steps-wrap { padding:16px 20px; }
    .co-form-area { padding:28px 20px; }
  }
  @media (max-width: 480px) {
    .co-steps-wrap { padding:14px 14px; }
    .co-step-line { width:24px; }
    .co-field--half { flex:1 1 100%; }
    .co-card-preview { height:130px; }
    .co-conf-actions { flex-direction:column; }
    .co-conf-btn-fill, .co-conf-btn-ghost { text-align:center; }
  }
`;