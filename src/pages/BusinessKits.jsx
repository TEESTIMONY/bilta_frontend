import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

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
    to: '/products',
  },
  {
    title: 'Growth Kit',
    text: 'Built for businesses scaling up and needing stronger, more consistent brand materials.',
    to: '/products',
  },
  {
    title: 'Premium Brand Kit',
    text: 'A more complete package for businesses ready for polished, customer-facing brand presence.',
    to: '/products',
  },
  {
    title: 'Request Custom Kit',
    text: 'Need a tailored bundle? We can build a custom mix around your brand stage and budget.',
    to: '/contact',
  },
]

function BusinessKits() {
  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-slate-200 bg-gradient-to-b from-white to-[#F8FAFC] py-16 md:py-20">
          <div className="container-shell">
            <p className="text-sm font-semibold uppercase tracking-widest text-navy">Business Kits</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl">A better brand setup.</h1>
            <p className="mt-5 max-w-3xl text-[17px] leading-relaxed text-slate-600">
              The Bilta Business Kit was created for business owners who want their brand to feel more
              complete — not just online, but in the hands of real customers.
            </p>
            <p className="mt-4 max-w-3xl text-[17px] leading-relaxed text-slate-600">
              Instead of ordering random print items one by one, the Business Kit brings together the
              essentials your business needs to show up properly.
            </p>
          </div>
        </section>

        <section className="bg-[#F4F8FC] py-16">
          <div className="container-shell">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-navy">What’s inside</p>
              <h2 className="text-2xl font-extrabold">What can go into your kit</h2>
              <p className="mt-3 max-w-3xl text-sm text-slate-600">
                Every Business Kit is tailored to your brand stage, goals, and budget. Choose only the
                essentials you need now, then expand as your business grows.
              </p>
            </div>

            <article className="border border-slate-200 bg-white p-7 shadow-sm">
              <ul className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-3">
                {kitItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 border border-slate-100 bg-slate-50 px-3 py-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="container-shell py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-navy">Who it’s for</p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Built for businesses at different stages</h2>
          <p className="mt-3 text-sm text-slate-600">Who the Bilta Business Kit is for</p>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {audienceCards.map((item) => (
              <article key={item.title} className="border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#F4F8FC] py-16">
          <div className="container-shell">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-navy">Why it works</p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Why business owners love it</h2>
            <p className="mt-3 max-w-3xl text-sm text-slate-600">
              The Business Kit is designed to make your brand look coordinated, credible, and ready for
              growth.
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {whyItWorks.map((point) => (
                <article key={point.title} className="border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900">{point.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{point.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="container-shell py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-navy">Shop the kits</p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Choose your business kit</h2>

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {kits.map((kit) => (
              <article key={kit.title} className="border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900">{kit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{kit.text}</p>
                <Link to={kit.to} className="mt-4 inline-block border-b border-transparent text-sm font-semibold text-navy hover:border-navy">
                  {kit.title === 'Request Custom Kit' ? 'Request Custom Kit' : 'Shop Now'}
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-10 border border-slate-200 bg-navy p-8 text-white">
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
