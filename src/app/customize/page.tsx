"use client";

export default function CustomizePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-14 pt-8 md:px-6">
      <section className="mb-10 border border-black/10 bg-[#f7f6f4] px-6 py-10 md:px-10">
        <p className="text-xs uppercase tracking-[0.25em] text-black/45">Customize</p>
        <h1 className="mt-3 text-left font-[\'Bebas_Neue\'] text-5xl leading-[0.9] tracking-[0.04em] text-black md:text-7xl">
          Build your piece
        </h1>
        <p className="mt-4 max-w-2xl text-left text-sm text-black/65 md:text-base">
          Tell us what you want and we’ll shape it into a premium Ankara Aura piece made around your fit,
          styling direction, and fabric intent.
        </p>
      </section>

      <form className="rounded-2xl border border-black/10 p-6 space-y-4">
        <div>
          <label className="text-sm font-medium">Full name</label>
          <input className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 text-sm outline-none focus:border-black/40" />
        </div>

        <div>
          <label className="text-sm font-medium">Phone / WhatsApp</label>
          <input className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 text-sm outline-none focus:border-black/40" />
        </div>

        <div>
          <label className="text-sm font-medium">What do you want?</label>
          <select className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 text-sm outline-none focus:border-black/40">
            <option>Tee</option>
            <option>Trousers</option>
            <option>Dress</option>
            <option>2-piece set</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Notes</label>
          <textarea className="mt-2 w-full min-h-[120px] rounded-xl border border-black/15 px-4 py-3 text-sm outline-none focus:border-black/40" />
        </div>

        <button
          type="button"
          className="w-full rounded-2xl px-6 py-3 text-sm font-medium bg-black text-white hover:bg-black/90 transition"
          onClick={() => alert("Submit flow coming soon (v2). For now we’ll wire this to email next.")}
        >
          Submit request
        </button>
      </form>
    </div>
  );
}
