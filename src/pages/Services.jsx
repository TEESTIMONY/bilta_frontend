import { ArrowRight, BookOpenText, BriefcaseBusiness, Package, Palette, Printer } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const categories = [
  {
    icon: Printer,
    accent: 'from-[#E8F0FF] to-white',
    title: 'Business Printing',
    body: 'Professional print materials that help your business communicate clearly, present better, and operate more professionally.',
    includes: [
      'Business Cards',
      'Flyers',
      'Posters',
      'Brochures',
      'Letterheads',
      'Invoices / Receipt Books',
      'Branded Documents',
      'Certificates',
    ],
    to: '/business-kits',
    cta: 'Shop Business Printing →',
  },
  {
    icon: Palette,
    accent: 'from-[#FFF5E7] to-white',
    title: 'Event Branding',
    body: 'Thoughtfully produced event branding that helps your event look coordinated, polished, and memorable.',
    includes: [
      'Welcome Signs',
      'Banners',
      'Event Tags',
      'Stickers',
      'Table Branding',
      'Seating Charts',
      'Souvenir Branding',
      'Event Signage',
    ],
    to: '/event-branding',
    cta: 'Shop Event Branding →',
  },
  {
    icon: Package,
    accent: 'from-[#E9FBF4] to-white',
    title: 'Packaging & Labels',
    body: 'Support materials that help your products look more complete, professional, and ready for customers.',
    includes: [
      'Product Labels',
      'Sticker Sheets',
      'Packaging Stickers',
      'Thank-you Cards',
      'Inserts',
      'Tags',
      'Branded Packaging Materials',
    ],
    to: '/products',
    cta: 'Shop Packaging & Labels →',
  },
  {
    icon: BookOpenText,
    accent: 'from-[#F7EDFF] to-white',
    title: 'Books & Publications',
    body: 'Clean, dependable book and publication printing for authors, educators, trainers, schools, and creators.',
    includes: [
      'Books',
      'Journals',
      'Manuals',
      'Workbooks',
      'Notebooks',
      'Booklets',
      'Educational Materials',
    ],
    to: '/book-printing',
    cta: 'Shop Book Printing →',
  },
  {
    icon: BriefcaseBusiness,
    accent: 'from-[#EEF4FF] to-white',
    title: 'Design & Support',
    body: 'Helpful support for customers who need more than just printing.',
    includes: ['Print File Setup', 'Design Support', 'Production Guidance', 'Website Design', 'Brand Visual Support'],
    to: '/contact',
    cta: 'Explore Support Services →',
  },
]

function Services() {
  return (
    <>
      <Navbar />
      <main>
        <section className="border-b border-slate-200 bg-gradient-to-b from-white to-[#F8FAFC] py-16 md:py-20">
          <div className="container-shell">
            <p className="text-sm font-semibold uppercase tracking-widest text-navy">Services</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
              Shop print and branding products built to help you show up properly.
            </h1>
            <p className="mt-5 max-w-3xl text-[17px] leading-relaxed text-slate-600">
              From everyday print essentials to event branding, packaging, and book production, Bilta
              offers products and services designed to help you present with more confidence and
              clarity.
            </p>
          </div>
        </section>

        <section className="bg-[#F4F8FC] py-16 md:py-20">
          <div className="container-shell">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-navy">What we offer</p>
                <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">Choose what fits your project</h2>
              </div>
              <Link to="/products" className="hidden items-center gap-2 text-sm font-semibold text-navy hover:underline md:inline-flex">
                View full products catalog <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {categories.map((category) => {
                const Icon = category.icon

                return (
                  <article
                    key={category.title}
                    className="group border border-slate-200 bg-white p-7 shadow-sm transition hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`inline-flex rounded-xl bg-gradient-to-br p-3 ${category.accent}`}>
                        <Icon size={18} className="text-navy" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-extrabold text-slate-900">{category.title}</h3>
                        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-700">{category.body}</p>
                      </div>
                    </div>

                    <ul className="mt-5 grid gap-x-4 gap-y-2 border-t border-slate-100 pt-5 text-sm text-slate-700 sm:grid-cols-2">
                      {category.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      to={category.to}
                      className="mt-6 inline-flex items-center border-b border-transparent text-sm font-semibold text-navy transition hover:border-navy"
                    >
                      {category.cta}
                    </Link>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Services
