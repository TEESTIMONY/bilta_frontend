import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { buildWhatsAppUrl } from '../utils/whatsapp'

function Contact() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    businessName: '',
    phone: '',
    email: '',
    request: '',
    quantity: '',
    timeline: '',
    note: '',
  })

  const whatsappMessage = useMemo(() => {
    const lines = [
      'Hello Bilta, I would like to make an inquiry.',
      '',
      `First Name: ${form.firstName || '-'}`,
      `Last Name: ${form.lastName || '-'}`,
      `Business Name: ${form.businessName || '-'}`,
      `Phone: ${form.phone || '-'}`,
      `Email: ${form.email || '-'}`,
      `What I need: ${form.request || '-'}`,
      `Quantity: ${form.quantity || '-'}`,
      `Timeline: ${form.timeline || '-'}`,
      `Additional Note: ${form.note || '-'}`,
    ]
    return lines.join('\n')
  }, [form])

  const whatsappHref = buildWhatsAppUrl(whatsappMessage)

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const inputClass =
    'mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/15'

  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-slate-200 bg-gradient-to-b from-white to-[#F8FAFC] py-16 md:py-20">
          <div className="container-shell">
            <p className="text-sm font-semibold uppercase tracking-widest text-navy">Contact</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl">
              Let’s work on your next print project.
            </h1>
            <p className="mt-5 max-w-3xl text-[17px] leading-relaxed text-slate-600">
              Whether you need one item or a full business setup, we’re here to guide you from idea to
              delivery.
            </p>
          </div>
        </section>

        <section className="bg-[#F4F8FC] py-16">
          <div className="container-shell grid gap-5 md:grid-cols-2">
            <article className="border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-bold">Send us your request</h2>
              <p className="mt-3 text-sm text-slate-600">
                Tell us what you need and we’ll recommend the best options for your budget and timeline.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700">
                  First Name
                  <input value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)} className={inputClass} />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Last Name
                  <input value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)} className={inputClass} />
                </label>
                <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                  Business Name
                  <input value={form.businessName} onChange={(e) => updateField('businessName', e.target.value)} className={inputClass} />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Phone
                  <input value={form.phone} onChange={(e) => updateField('phone', e.target.value)} className={inputClass} />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Email
                  <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} className={inputClass} />
                </label>
                <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                  What do you need?
                  <textarea value={form.request} onChange={(e) => updateField('request', e.target.value)} rows={3} className={inputClass} />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Quantity
                  <input value={form.quantity} onChange={(e) => updateField('quantity', e.target.value)} className={inputClass} />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Timeline
                  <input value={form.timeline} onChange={(e) => updateField('timeline', e.target.value)} className={inputClass} placeholder="e.g. 3-5 days" />
                </label>
                <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                  Additional Note
                  <textarea value={form.note} onChange={(e) => updateField('note', e.target.value)} rows={3} className={inputClass} />
                </label>
              </div>

              <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-primary mt-6 inline-block">
                Chat with us on WhatsApp
              </a>
            </article>

            <article className="border border-slate-800 bg-navy p-7 text-white shadow-sm">
              <h2 className="text-2xl font-bold text-white">Support</h2>
              <p className="mt-3 text-sm text-slate-200">
                Need help deciding what to print? We’ll help you choose what makes sense for your goals.
              </p>
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                <li>
                  <span className="font-semibold text-white">Need a quick quote?</span>
                  <p>Chat with us on WhatsApp.</p>
                </li>
                <li>
                  <span className="font-semibold text-white">Not sure what to print?</span>
                  <p>Tell us about your business and we’ll help recommend what makes sense.</p>
                </li>
                <li>
                  <span className="font-semibold text-white">Need a more complete setup?</span>
                  <p>Ask about the Bilta Business Kit.</p>
                </li>
              </ul>
            </article>
          </div>

          <div className="container-shell mt-10 border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-extrabold text-slate-900">Need a complete print setup?</h2>
            <p className="mt-3 max-w-3xl text-sm text-slate-600">
              Explore our services and choose what fits your current stage, then contact us for a tailored quote.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/services" className="btn-primary">
                View Services
              </Link>
              <Link to="/products" className="btn-ghost">
                Browse Products
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Contact
