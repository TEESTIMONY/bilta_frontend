import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { buildWhatsAppUrl } from '../utils/whatsapp'

const kitItems = [
  'Business cards',
  'Flyers',
  'Product labels',
  'Stickers',
  'Thank-you cards',
  'Packaging',
  'Brand tags',
  'Packaging support materials',
  'Promotional prints',
  'Branded stationery',
]

const audienceCards = [
  {
    title: 'For new business owners',
    text: 'If you’re just starting and want to look more put-together from the beginning.',
  },
  {
    title: 'For growing product brands',
    text: 'If you already sell, but your packaging and print still look inconsistent.',
  },
  {
    title: 'For established businesses',
    text: 'You need professional materials that support your credibility.',
  },
  {
    title: 'For vendors preparing for pop-ups',
    text: 'You need to be prepared before customers arrive',
  },
]

const whyItWorks = [
  {
    title: 'Consistent brand presence',
    text: 'From cards to packaging, every touchpoint feels aligned and professional.',
  },
  {
    title: 'Stronger customer trust',
    text: 'Polished print materials help customers take your brand more seriously.',
  },
  {
    title: 'Faster, easier setup',
    text: 'Get essential materials in one plan instead of figuring things out item by item.',
  },
  {
    title: 'Built to scale with you',
    text: 'Start with what you need now and expand as your business grows.',
  },
]

const kits = [
  {
    title: 'Starter Kit',
    text: 'A practical starting setup for new businesses that want to look clean and organized.',
    to: '/products?category=BUSINESS%20CARDS',
  },
  {
    title: 'Growth Kit',
    text: 'Built for businesses scaling up and needing stronger, more consistent brand materials.',
    to: '/products?category=FLYER%20%26%20HANDBILLS',
  },
  {
    title: 'Premium Brand Kit',
    text: 'A more complete package for businesses ready for polished, customer-facing brand presence.',
    to: '/products?category=MARKETING%20BROCHURE',
  },
  {
    title: 'Request Custom Kit',
    text: 'Need a tailored bundle? We can build a custom mix around your brand stage and budget.',
    to: '/contact',
  },
]

function BusinessKits() {
  useEffect(() => {
    const nodes = document.querySelectorAll('.kit-reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.16 }
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-navy via-[#0f2f5f] to-[#184a8f] py-16 text-white md:py-20">
          <div className="pointer-events-none absolute -left-10 top-10 h-36 w-36 rounded-full bg-yellow/35 blur-3xl animate-drift" />
          <div className="pointer-events-none absolute right-12 top-1/3 h-28 w-28 rounded-full bg-sky-300/30 blur-3xl animate-drift" style={{ animationDelay: '0.8s' }} />
          <div className="pointer-events-none absolute bottom-8 left-1/3 h-20 w-20 rounded-full bg-fuchsia-300/25 blur-3xl animate-drift" style={{ animationDelay: '1.4s' }} />

          <div className="container-shell grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-yellow">
                Business Kits • Bilta
              </p>
              <h1 className="animate-fade-up animate-delay-1 mt-4 max-w-4xl text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
                A better brand setup.
              </h1>
              <p className="animate-fade-up animate-delay-2 mt-5 max-w-2xl text-[17px] leading-relaxed text-slate-100">
                The Bilta Business Kit was created for business owners who want their brand to feel more
                complete — not just online, but in the hands of real customers.
              </p>
              <p className="animate-fade-up animate-delay-3 mt-4 max-w-2xl text-[17px] leading-relaxed text-slate-100">
                Instead of ordering random print items one by one, the Business Kit brings together the
                essentials your business needs to show up properly.
              </p>

              <div className="animate-fade-up animate-delay-3 mt-7 flex flex-wrap gap-3">
                <Link to="#kits" className="btn-primary animate-glow-pulse">
                  Choose a Kit
                </Link>
                <a
                  href={buildWhatsAppUrl()}
                  className="rounded-md border border-white/70 px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-navy"
                  target="_blank"
                  rel="noreferrer"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            <div className="animate-fade-up animate-delay-2 rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur md:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow">What you get</p>
              <h2 className="mt-3 text-2xl font-extrabold text-white">A complete brand starter stack.</h2>

              <div className="mt-5 flex flex-wrap gap-2">
                {['Business Cards', 'Flyers', 'Labels', 'Stickers', 'Thank-you Cards', 'Packaging'].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-white"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t border-white/20 pt-4 text-sm text-slate-100">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-yellow font-bold text-navy">
                    1
                  </span>
                  <p>Pick your kit based on your current business stage.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-yellow font-bold text-navy">
                    2
                  </span>
                  <p>We produce coordinated materials that match your brand.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-yellow font-bold text-navy">
                    3
                  </span>
                  <p>You launch with a clean, professional brand presence.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="kit-reveal reveal bg-[#F4F8FC] py-16">
          <div className="container-shell">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-navy">What’s inside</p>
              <h2 className="text-2xl font-extrabold">What can go into your kit</h2>
              <p className="mt-3 max-w-3xl text-sm text-slate-600">
                Every Business Kit is tailored to your brand stage, goals, and budget. Choose only the
                essentials you need now, then expand as your business grows.
              </p>
            </div>

            <article className="border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:shadow-xl">
              <ul className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-3">
                {kitItems.map((item, index) => (
                  <li
                    key={item}
                    className="animate-fade-up flex items-start gap-2 border border-slate-100 bg-slate-50 px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:border-yellow"
                    style={{ animationDelay: `${index * 55}ms` }}
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section id="kits" className="kit-reveal reveal container-shell py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-navy">Who it’s for</p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Built for businesses at different stages</h2>
          <p className="mt-3 text-sm text-slate-600">Who the Bilta Business Kit is for</p>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {audienceCards.map((item, index) => (
              <article
                key={item.title}
                className="animate-fade-up border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="kit-reveal reveal bg-navy py-16">
          <div className="container-shell">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-yellow">Why it works</p>
            <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">Why business owners love it</h2>
            <p className="mt-3 max-w-3xl text-sm text-slate-200">
              The Business Kit is designed to make your brand look coordinated, credible, and ready for
              growth.
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {whyItWorks.map((point, index) => (
                <article
                  key={point.title}
                  className="animate-fade-up border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-yellow hover:shadow-xl"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <h3 className="text-lg font-bold text-slate-900">{point.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{point.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="kit-reveal reveal container-shell py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-navy">Shop the kits</p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Choose your business kit</h2>

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {kits.map((kit, index) => (
              <article
                key={kit.title}
                className="group animate-fade-up border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-yellow hover:shadow-xl"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <h3 className="text-xl font-bold text-slate-900">{kit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{kit.text}</p>
                <Link to={kit.to} className="mt-4 inline-block border-b border-transparent text-sm font-semibold text-navy transition group-hover:border-navy group-hover:translate-x-1">
                  {kit.title === 'Request Custom Kit' ? 'Request Custom Kit' : 'Shop Now'}
                </Link>
              </article>
            ))}
          </div>

          <div className="animate-fade-up animate-delay-2 mt-10 border border-slate-200 bg-navy p-8 text-white animate-float-soft">
            <h2 className="text-3xl font-extrabold text-white">Ready to upgrade how your business shows up?</h2>
            <p className="mt-3 text-slate-200">
              Choose a Business Kit that fits your stage, or request a custom one built around your brand.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/products" className="btn-primary">
                Shop Business Kits
              </Link>
              <Link
                to="/contact"
                className="border border-white px-4 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-navy"
              >
                Get a Custom Kit
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default BusinessKits
