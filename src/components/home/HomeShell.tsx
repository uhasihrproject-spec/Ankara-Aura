export default function HomeShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Bebas+Neue&family=DM+Sans:wght@300;400&display=swap');

        :root {
          --bg:   #ffffff;
          --ink:  #0b0b0a;
          --mid:  rgba(11,11,10,0.44);
          --rule: rgba(11,11,10,0.1);
          --hw:   'Caveat', cursive;
        }

        .aa-wrap { background: var(--bg); color: var(--ink); font-family: 'DM Sans', sans-serif; }
        .aa-ink { color: var(--ink); }
        .aa-mid { color: var(--mid); }
        .aa-rule { border-color: var(--rule); }
        .aa-hw { font-family: var(--hw); }

        /* same ghost watermark style as hero */
        .aa-ghost {
          position: absolute; pointer-events: none; user-select: none; z-index: 1;
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(110px,16vw,200px);
          line-height: 0.86; letter-spacing: -0.02em;
          -webkit-text-stroke: 1.2px rgba(11,11,10,0.08);
          color: transparent; white-space: nowrap;
        }
      `}</style>

      <div className="aa-wrap">{children}</div>
    </>
  );
}