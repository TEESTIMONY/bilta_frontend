import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function BookPrinting() {
  return (
    <>
      <Navbar />
      <main>
        <section className="container-shell py-16 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-navy">Book Printing</p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Your book deserves better than average printing.</h1>
          <p className="mt-5 max-w-3xl text-[17px] leading-relaxed text-slate-600">
            Whether you’re printing a book, workbook, manual, journal, or educational material, Bilta helps you produce it cleanly, professionally, and with the quality it deserves.
          </p>
          <div className="mt-6 flex gap-3">
            <Link to="/products" className="btn-primary">Shop Book Printing</Link>
            <Link to="/contact" className="btn-ghost">Request a Quote</Link>
          </div>
        </section>

        <section className="bg-navy py-16">
          <div className="container-shell grid gap-6 lg:grid-cols-2">
            <article className="border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-extrabold">Print your work properly.</h2>
              <p className="mt-3 text-sm text-slate-600">
                A book is more than pages. It represents your ideas, your effort, your name, and your work. That’s why book printing should be done with care.
              </p>
            </article>
            <article className="border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-extrabold">We print</h2>
              <ul className="mt-4 grid gap-1 text-sm text-slate-700 sm:grid-cols-2">
                {['Books', 'Workbooks', 'Journals', 'Manuals', 'Notebooks', 'Educational materials', 'Custom publications'].map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="container-shell py-16">
          <div className="border border-slate-200 bg-navy p-8 text-white">
            <h2 className="text-3xl font-extrabold text-white">Ready to print your book?</h2>
            <p className="mt-3 max-w-3xl text-slate-200">
              Tell us what you’re printing and we’ll guide you on the best production option for it.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/products" className="btn-primary">
                Shop Book Printing
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default BookPrinting
