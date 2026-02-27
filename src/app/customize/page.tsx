export default function CustomizePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-semibold">Customize</h1>
      <p className="mt-2 text-sm text-black/60">
        Tell us what you want. We’ll refine it into a premium Ankara Aura piece.
      </p>

      <form className="mt-8 rounded-2xl border border-black/10 p-6 space-y-4">
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

        <p className="text-xs text-black/50">
          Next step: we can connect this to email (Resend) or DB later.
        </p>
      </form>
    </div>
  );
}