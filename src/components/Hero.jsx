import { Link } from 'react-router-dom'
import { BadgeCheck, BriefcaseBusiness, CheckCircle2, MessageCircle, Timer } from 'lucide-react'

function Hero() {
  return (
    <section className="container-shell grid gap-10 py-16 md:grid-cols-2 md:py-20">
      <div className="space-y-6">
        <h1 className="text-4xl font-extrabold sm:text-5xl">
          Print, Brand &amp; Package Your Business Properly.
        </h1>
        <p className="max-w-xl text-[17px] leading-relaxed text-slate-600">
          Bilta helps businesses, events, and creators produce quality print materials, strong
          brand assets, and practical packaging systems that look professional and sell better.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/products" className="btn-primary">
            Shop Products
          </Link>
          <Link to="/contact" className="btn-ghost">
            Get a Quote
          </Link>
        </div>
        <p className="text-sm text-slate-500">
          30 years of trusted service. Yeah, we love paper, ink and helping you grow.
        </p>
      </div>

      <div className="border border-navy-deeper bg-navy p-6 text-white shadow-xl md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow">Bilta Performance</p>
        <h2 className="mt-3 text-2xl font-bold text-white">Built for consistency, speed and quality.</h2>

        <div className="mt-6 grid grid-cols-2 gap-3 border-y border-white/15 py-4">
          <div className="border border-white/15 bg-white/5 p-3">
            <p className="text-2xl font-extrabold text-yellow">30+</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-200">Years Serving Clients</p>
          </div>
          <div className="border border-white/15 bg-white/5 p-3">
            <p className="text-2xl font-extrabold text-yellow">5</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-200">Core Service Units</p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-start gap-3 border-l-2 border-yellow pl-3">
            <BadgeCheck className="mt-0.5 text-yellow" size={16} />
            <p className="text-sm text-slate-100">30+ years of print and branding service delivery.</p>
          </div>
          <div className="flex items-start gap-3 border-l-2 border-yellow pl-3">
            <BriefcaseBusiness className="mt-0.5 text-yellow" size={16} />
            <p className="text-sm text-slate-100">5 structured services for businesses and events.</p>
          </div>
          <div className="flex items-start gap-3 border-l-2 border-yellow pl-3">
            <Timer className="mt-0.5 text-yellow" size={16} />
            <p className="text-sm text-slate-100">Fast order response via online and WhatsApp channels.</p>
          </div>
        </div>

        <a
          href="https://wa.me/YOURNUMBER"
          className="mt-6 inline-flex items-center gap-2 border border-yellow px-4 py-2 text-sm font-semibold text-yellow transition hover:bg-yellow hover:text-navy"
          target="_blank"
          rel="noreferrer"
        >
          <CheckCircle2 size={16} /> Order via WhatsApp
        </a>
      </div>
    </section>
  )
}

export default Hero