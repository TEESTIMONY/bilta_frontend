function Intro() {
  return (
    <section className="container-shell grid gap-10 py-16 md:grid-cols-2 md:py-20">
      <div>
        <h2 className="text-3xl font-extrabold sm:text-4xl">
          Built from service. Growing with systems.
        </h2>
        <p className="mt-5 text-[17px] leading-relaxed text-slate-600">
          For over 30 years, Bilta has supported businesses, schools, churches, event planners,
          and authors with reliable print production. What started with simple paper jobs has grown
          into a full print, branding, and packaging operation powered by better systems, faster
          delivery, and a team that understands what quality means for your brand.
        </p>
      </div>

      <div className="space-y-5">
        {[
          ['01', '1990s — Foundation', 'Bilta began as a trusted neighborhood print shop.'],
          ['02', '2000s — Expansion', 'Added branding support and higher-capacity production.'],
          ['03', 'Today — Systemized Service', 'Now delivering print, brand and packaging in one flow.'],
        ].map(([num, title, desc]) => (
          <div key={num} className="flex gap-4 border border-slate-200 p-5">
            <span className="text-2xl font-extrabold text-yellow">{num}</span>
            <div>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-1 text-sm text-slate-600">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Intro