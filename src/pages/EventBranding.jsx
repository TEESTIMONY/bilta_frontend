import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const items = [
  'Welcome signs',
  'Seating charts',
  'Event tags',
  'Table branding',
  'Stickers',
  'Banners',
  'Souvenir branding',
  'Printed inserts',
  'Directional signage',
  'Custom event materials',
]

const whyItMatters = [
  'Improve overall presentation and perceived quality',
  'Create visual consistency across every event touchpoint',
  'Make the event more memorable in photos and videos',
  'Help the host or planner look organized and professional',
  'Elevate the guest experience from arrival to exit',
]

function EventBranding() {
  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-slate-200 bg-gradient-to-b from-white to-[#F8FAFC] py-16 md:py-20">
          <div className="container-shell">
            <p className="text-sm font-semibold uppercase tracking-widest text-navy">Event Branding</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl">
              A well-branded event is remembered differently.
            </h1>
            <p className="mt-5 max-w-3xl text-[17px] leading-relaxed text-slate-600">
              From welcome signage to printed details and branded materials, Bilta helps you create
              event branding that looks coordinated, polished, and intentional.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/products" className="btn-primary">
                Shop Event Branding
              </Link>
              <Link to="/contact" className="btn-ghost">
                Request Event Quote
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-[#F4F8FC] py-16">
          <div className="container-shell grid gap-6 lg:grid-cols-2">
            <article className="border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-extrabold">The little details are what make an event look complete.</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                A lot of events have beautiful outfits, décor, and planning — but weak branding.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                And when the printed details are rushed, inconsistent, or missing, the whole event
                loses its packaging.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">That’s where Bilta comes in.</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                We help event planners, celebrants, and event brands produce the materials that make
                an event look more coordinated, premium, and put together.
              </p>
            </article>

            <article className="border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-extrabold">Event branding support includes:</h2>
              <ul className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                {items.map((item) => (
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
          <div className="border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-3xl font-extrabold text-slate-900">Why event branding matters</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Event branding is more than decoration — it shapes how the event is experienced and remembered.
            </p>
            <p className="mt-4 text-sm font-semibold text-slate-800">Strong event branding helps you:</p>
            <ul className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
              {whyItMatters.map((point) => (
                <li key={point} className="flex items-start gap-2 border border-slate-100 bg-slate-50 px-3 py-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 border border-slate-200 bg-navy p-8">
            <h2 className="text-3xl font-extrabold text-white">Planning an event?</h2>
            <p className="mt-3 text-slate-200">
              Let’s help you produce the branding materials that bring it together properly.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/products" className="btn-primary">
                Shop Event Branding
              </Link>
              <Link
                to="/contact"
                className="border border-white px-4 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-navy"
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default EventBranding
