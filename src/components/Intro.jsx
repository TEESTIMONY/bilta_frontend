function Intro() {
  return (
    <section className="home-band-section bg-navy py-16 md:py-20">
      <div className="container-shell">
        <h2 className="max-w-3xl text-3xl font-extrabold text-white sm:text-4xl">
          Built from service. <span className="text-yellow">Growing with systems</span>
        </h2>
        <p className="mt-5 max-w-4xl text-[17px] leading-relaxed text-slate-200">
          Bilta started over 30 years ago with one typewriter, a kiosk, and a commitment to helping
          people type and move forward.
        </p>
        <p className="mt-4 max-w-4xl text-[17px] leading-relaxed text-slate-200">
          Today, we’re building on that same foundation with better systems, better presentation,
          and a stronger vision — helping businesses, brands and events print and package themselves
          properly.
        </p>
        <p className="mt-4 max-w-4xl text-[17px] leading-relaxed text-slate-200">
          What built Bilta was consistency, service, and work people could trust.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            '30+ years of service',
            'Print, branding & packaging in one place',
            'Trusted by businesses and individuals',
            'Business, event & book production',
            'Online and WhatsApp order support',
          ].map((item) => (
            <div key={item} className="home-list-card border-l-2 border-l-yellow border-white/20 bg-white/10 p-4 text-sm font-semibold text-white">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Intro
