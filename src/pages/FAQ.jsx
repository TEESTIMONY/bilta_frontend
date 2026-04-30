import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const faqs = [
  {
    q: 'Do I have to come to the shop before placing an order?',
    a: 'No. Many orders can be started online or through WhatsApp.',
  },
  {
    q: 'Can I send my design through WhatsApp?',
    a: 'Yes. You can send your files, references, or order details through WhatsApp to begin the process.',
  },
  {
    q: 'What if I don’t know the right size or material for what I need?',
    a: 'That’s okay. We can help guide you based on what you’re trying to achieve.',
  },
  {
    q: 'Do you help check files before printing?',
    a: 'Yes. We review files before production to reduce common print mistakes.',
  },
  {
    q: 'Can I request delivery?',
    a: 'Yes, delivery or rider pickup may be available depending on the order and location.',
  },
  {
    q: 'Do you only work with businesses?',
    a: 'No. We also serve individuals, events, and personal projects. But our systems are especially useful for businesses and growing brands.',
  },
  {
    q: 'Can I order in small quantities?',
    a: 'For some products, yes. Quantity options depend on the item.',
  },
  {
    q: 'Do you offer design services too?',
    a: 'Yes, we offer design-related support depending on the project.',
  },
]

function FAQ() {
  return (
    <>
      <Navbar />
      <main>
        <section className="container-shell py-16 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-navy">FAQ</p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Frequently asked questions</h1>
          <p className="mt-5 max-w-3xl text-[17px] leading-relaxed text-slate-600">
            Here are a few common questions about how Bilta works.
          </p>
        </section>

        <section className="bg-[#F4F8FC] py-16">
          <div className="container-shell space-y-4">
            {faqs.map((item) => (
              <article key={item.q} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold">{item.q}</h2>
                <p className="mt-2 text-sm text-slate-600">{item.a}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default FAQ
