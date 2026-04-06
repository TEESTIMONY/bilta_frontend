import { ArrowRight, BookOpenText, BriefcaseBusiness, Package, Palette, Printer } from 'lucide-react'
import { Link } from 'react-router-dom'

const serviceItems = [
  {
    icon: Printer,
    title: 'Professional Printing',
    desc: 'High-quality print production for business, education and events.',
    includes: ['Business cards', 'Flyers & brochures', 'Posters & banners'],
  },
  {
    icon: Palette,
    title: 'Brand Identity Support',
    desc: 'Visual materials that make your brand consistent everywhere.',
    includes: ['Logo refinement', 'Brand colors', 'Templates'],
  },
  {
    icon: Package,
    title: 'Packaging & Labels',
    desc: 'Packaging systems that present your product professionally.',
    includes: ['Product labels', 'Custom packaging', 'Stickers'],
  },
  {
    icon: BookOpenText,
    title: 'Book & Author Production',
    desc: 'From manuscript print to polished book delivery support.',
    includes: ['Cover print', 'Book interior', 'Binding & finishing'],
  },
  {
    icon: BriefcaseBusiness,
    title: 'Corporate Materials',
    desc: 'Everyday brand assets for teams, offices, and organizations.',
    includes: ['Letterheads', 'Invoices & receipts', 'Company profiles'],
  },
]

function Services() {
  return (
    <section id="services" className="bg-[#F4F8FC] py-16 md:py-20">
      <div className="container-shell">
        <h2 className="max-w-3xl text-3xl font-extrabold sm:text-4xl">
          Everything your brand needs to show up better.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {serviceItems.map(({ icon: Icon, title, desc, includes }) => (
            <article
              key={title}
              className="group border border-slate-200 bg-white p-6 shadow-md transition hover:-translate-y-1 hover:border-yellow"
            >
              <div className="mb-4 inline-flex bg-yellow/20 p-3 text-navy">
                <Icon size={20} />
              </div>
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{desc}</p>
              <ul className="mt-4 space-y-1 text-sm text-slate-500">
                {includes.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="mt-5 inline-flex items-center gap-2 border-l-4 border-transparent pl-3 text-sm font-semibold text-navy transition group-hover:border-yellow"
              >
                Explore service <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services