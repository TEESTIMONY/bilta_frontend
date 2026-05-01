import { Link } from 'react-router-dom'

const kits = [
  ['Kit 01', 'Business Starter Kit', 'Business cards, flyers, stickers, thank-you cards, and product labels.', '/business-kits'],
  ['Kit 02', 'Event Branding Kit', 'Welcome signage, table branding, banners, tags, event stickers, and branded prints.', '/event-branding'],
  ['Kit 03', 'Packaging & Label Kit', 'Labels, stickers, inserts, tags, and packaging support prints.', '/services'],
  ['Kit 04', 'Author & Book Printing Kit', 'Books, journals, workbooks, manuals, and supporting print materials.', '/book-printing'],
  ['Kit 05', 'Office & Brand Materials', 'Letterheads, invoices, files, books, and branded stationery.', '/services'],
]

function Solutions() {
  return (
    <section className="bg-navy py-16 md:py-20">
      <div className="container-shell">
        <h2 className="max-w-3xl text-3xl font-extrabold text-white sm:text-4xl">
          Ready-made solutions for businesses and events.
        </h2>
        <p className="mt-4 max-w-4xl text-[17px] text-slate-200">
          Whether you’re starting small, refining an established brand, or hosting an event, we’ve
          built practical print solutions to help you look more prepared, packaged, and professional.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {kits.map(([label, title, desc, to]) => (
            <article
              key={title}
              className="border border-white/20 bg-white/10 p-6 text-white shadow-md transition hover:-translate-y-1"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-yellow">{label}</p>
              <h3 className="mt-2 text-xl font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm text-slate-200">{desc}</p>
              <Link to={to} className="mt-4 inline-block text-sm font-semibold text-yellow">
                Shop Now →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Solutions