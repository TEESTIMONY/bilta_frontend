import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const orderOptions = [
  {
    title: 'Option 1: Order directly from the website',
    body: 'Browse products, choose your specifications, upload your files, add to cart, and check out directly through the website.',
    bestFor: [
      'you already know what you need',
      'you have your files ready',
      'you want a faster self-service process',
    ],
  },
  {
    title: 'Option 2: Order through WhatsApp',
    body: 'If you need help deciding what to print, choosing the right format, or figuring out what works best for your business or event, simply send us your request on WhatsApp.',
    bestFor: [
      'you need guidance',
      'you have multiple items',
      'your project is custom',
      'you’re planning an event',
      'you want help making the best production decisions',
    ],
  },
]

const processSteps = [
  {
    step: 'Step 2',
    title: 'We review and confirm your order',
    body: 'Once we receive your request, we review the details to ensure your files, sizes, quantities, and production choices are correct before printing begins.',
    points: [
      'better material choices',
      'stronger finishing options',
      'print sizes that work better',
      'presentation upgrades that improve your result',
    ],
  },
  {
    step: 'Step 3',
    title: 'We produce your job',
    body: 'Once confirmed, your order moves into production. Depending on your request, this may include printing, cutting, lamination, packaging, labeling, binding, or finishing.',
  },
  {
    step: 'Step 4',
    title: 'We notify you when it’s ready',
    body: 'As soon as your order is ready, we’ll let you know so you can:',
    points: ['pick it up', 'send a rider', 'or request delivery where available'],
  },
]

function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="container-shell py-16 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-navy">How It Works</p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">A clearer, easier way to print.</h1>
          <p className="mt-5 max-w-3xl text-[17px] leading-relaxed text-slate-600">
            Whether you prefer to shop directly on the website or send your request through
            WhatsApp, Bilta makes the process easier from start to finish.
          </p>
        </section>

        <section className="bg-[#F4F8FC] py-16">
          <div className="container-shell grid gap-5 md:grid-cols-2">
            {orderOptions.map((option) => (
              <article key={option.title} className="border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-extrabold">{option.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{option.body}</p>
                <p className="mt-4 text-sm font-semibold text-slate-800">This option works best if:</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  {option.bestFor.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="container-shell py-16">
          <div className="grid gap-5 lg:grid-cols-3">
            {processSteps.map((item) => (
              <article key={item.step} className="border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-navy">{item.step}</p>
                <h3 className="mt-2 text-2xl font-extrabold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.body}</p>

                {item.points ? (
                  <>
                    {item.step === 'Step 2' ? (
                      <p className="mt-4 text-sm font-semibold text-slate-800">We may also guide you on:</p>
                    ) : null}
                    <ul className="mt-2 space-y-2 text-sm text-slate-700">
                      {item.points.map((point) => (
                        <li key={point} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </article>
            ))}
          </div>

          <div className="mt-10 border border-slate-200 bg-[#F4F8FC] p-6 md:p-8">
            <h2 className="text-3xl font-extrabold text-slate-900">Ready to place your order?</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
              Choose the easiest route for you and let’s get started.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/products" className="btn-primary">
                Shop Online
              </Link>
              <a href="https://wa.me/YOURNUMBER" target="_blank" rel="noreferrer" className="btn-ghost">
                Order on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default HowItWorksPage
