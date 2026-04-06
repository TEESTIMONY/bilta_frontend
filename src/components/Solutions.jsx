import { Link } from 'react-router-dom'

const kits = [
  ['Kit 01', 'Business Starter Kit', 'Cards, letterhead, invoice, and profile essentials.'],
  ['Kit 02', 'Event Branding Kit', 'Banners, programs, tags, and coordinated event collateral.'],
  ['Kit 03', 'Packaging & Label Kit', 'Product labels, packaging sleeves, and branded stickers.'],
  ['Kit 04', 'Author & Book Kit', 'Book cover print, interior layout support, and finishing.'],
  ['Kit 05', 'Office & Brand Materials', 'Files, folders, ID cards, signage, and daily office tools.'],
]

function Solutions() {
  return (
    <section className="bg-navy py-16 md:py-20">
      <div className="container-shell">
        <h2 className="max-w-3xl text-3xl font-extrabold text-white sm:text-4xl">
          Ready-made solutions for businesses and events.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {kits.map(([label, title, desc]) => (
            <article
              key={title}
              className="border border-white/20 bg-white/10 p-6 text-white shadow-md transition hover:-translate-y-1"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-yellow">{label}</p>
              <h3 className="mt-2 text-xl font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm text-slate-200">{desc}</p>
              <Link to="/contact" className="mt-4 inline-block text-sm font-semibold text-yellow">
                Request this kit →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Solutions