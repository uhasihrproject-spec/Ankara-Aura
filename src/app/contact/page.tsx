export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-semibold">Contact</h1>
      <p className="mt-2 text-sm text-black/60">
        Business, collabs, orders, questions — reach out.
      </p>

      <form className="mt-8 rounded-2xl border border-black/10 p-6 space-y-4" method="post" action="/api/contact">
        <div>
          <label className="text-sm font-medium">Name</label>
          <input name="name" className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 text-sm outline-none focus:border-black/40" />
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <input name="email" type="email" required className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 text-sm outline-none focus:border-black/40" />
        </div>

        <div>
          <label className="text-sm font-medium">Message</label>
          <textarea name="message" required className="mt-2 w-full min-h-[140px] rounded-xl border border-black/15 px-4 py-3 text-sm outline-none focus:border-black/40" />
        </div>

        <button
          className="w-full rounded-2xl px-6 py-3 text-sm font-medium bg-black text-white hover:bg-black/90 transition"
          type="submit"
        >
          Send message
        </button>

        <p className="text-xs text-black/50">
          Sends to: ankaraauragh@gmail.com
        </p>
      </form>
    </div>
  );
}