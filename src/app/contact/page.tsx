const TEAM_CONTACTS = [
  { name: "Studio Team", email: "ankaraauragh@gmail.com", role: "Orders & Product Support" },
  { name: "Partnership Desk", email: "ankaraauragh@gmail.com", role: "Collaborations & Press" },
  { name: "Founders Office", email: "ankaraauragh@gmail.com", role: "Business Inquiries" },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-14 pt-8 md:px-6">
      <section className="mb-10 border border-black/10 bg-[#f7f6f4] px-6 py-10 md:px-10">
        <p className="text-xs uppercase tracking-[0.25em] text-black/45">Contact</p>
        <h1 className="mt-3 text-left font-[\'Bebas_Neue\'] text-5xl leading-[0.9] tracking-[0.04em] text-black md:text-7xl">
          Let&apos;s talk privately
        </h1>
        <p className="mt-4 max-w-2xl text-left text-sm text-black/65 md:text-base">
          Business, collabs, orders, and questions — reach the right Ankara Aura team directly.
        </p>
      </section>

      <section className="mb-8 grid gap-4 md:grid-cols-3">
        {TEAM_CONTACTS.map((contact) => (
          <a
            key={contact.name}
            href={`mailto:${contact.email}`}
            className="rounded-2xl border border-black/10 bg-white p-5 transition hover:-translate-y-0.5 hover:border-black/30"
          >
            <p className="text-[11px] uppercase tracking-[0.2em] text-black/45">{contact.role}</p>
            <p className="mt-2 text-lg font-semibold text-black">{contact.name}</p>
            <p className="mt-2 text-sm text-black/70">{contact.email}</p>
          </a>
        ))}
      </section>

      <form className="rounded-2xl border border-black/10 p-6 space-y-4" method="post" action="/api/contact">
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
      </form>
    </div>
  );
}
