import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MessageCircle,
  MonitorSmartphone,
  ClipboardCheck,
  ListChecks,
  Sparkles,
  Factory,
  Truck,
} from 'lucide-react'

const steps = [
  {
    title: 'Review your order',
    note: 'We review your files and request details carefully before production starts.',
    icon: ClipboardCheck,
  },
  {
    title: 'Confirm details',
    note: 'We confirm quantities, sizes, timelines, and important production specs.',
    icon: ListChecks,
  },
  {
    title: 'Refine what’s needed',
    note: 'Where needed, we guide better material choices and finishing options.',
    icon: Sparkles,
  },
  {
    title: 'Produce your job',
    note: 'Your work enters printing and finishing with quality checks in place.',
    icon: Factory,
  },
  {
    title: 'Notify when ready',
    note: 'We notify you when your job is ready for pickup, rider, or delivery.',
    icon: Truck,
  },
]

function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const current = steps[activeStep]

  const goPrev = () => setActiveStep((prev) => (prev === 0 ? steps.length - 1 : prev - 1))
  const goNext = () => setActiveStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1))

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1))
    }, 3200)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <section id="how-it-works" className="bg-[#F4F8FC] py-16 md:py-20">
      <div className="container-shell">
        <h2 className="text-3xl font-extrabold sm:text-4xl">Print made easier.</h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="home-grid-card border border-slate-200 bg-white p-6 shadow-md">
            <MonitorSmartphone className="text-navy" />
            <h3 className="mt-3 text-xl font-bold">Option 1: Shop online</h3>
            <p className="mt-2 text-sm text-slate-600">
              Add your product to cart, upload your files, and check out directly through the website.
            </p>
          </article>
          <article className="home-grid-card border border-slate-200 bg-white p-6 shadow-md">
            <MessageCircle className="text-navy" />
            <h3 className="mt-3 text-xl font-bold">Option 2: Order through WhatsApp</h3>
            <p className="mt-2 text-sm text-slate-600">
              Send us what you need, and we’ll guide you through the process from there.
            </p>
          </article>
        </div>

        <div className="mt-10 lg:hidden">
          <article className="border border-slate-300 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="inline-flex h-12 w-12 items-center justify-center bg-navy text-white">
                <current.icon size={22} />
              </span>
              <p className="text-xs font-bold uppercase tracking-widest text-yellow">0{activeStep + 1}</p>
            </div>

            <p className="mt-3 text-sm font-semibold text-slate-900">{current.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-600">{current.note}</p>
          </article>

          <div className="mt-3 flex items-center justify-between gap-3">
            <button onClick={goPrev} className="border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700">
              Previous
            </button>
            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`h-2.5 w-2.5 border ${activeStep === index ? 'bg-navy border-navy' : 'bg-white border-slate-400'}`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>
            <button onClick={goNext} className="border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700">
              Next
            </button>
          </div>
        </div>

        <div className="mt-10 hidden gap-4 lg:grid lg:grid-cols-3 xl:grid-cols-5">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="home-grid-card group border border-slate-300 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-yellow hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-12 w-12 items-center justify-center bg-navy text-white">
                  <step.icon size={22} />
                </span>
                <p className="text-xs font-bold uppercase tracking-widest text-yellow">0{index + 1}</p>
              </div>

              <p className="mt-3 text-sm font-semibold text-slate-900">{step.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{step.note}</p>

              {index < steps.length - 1 && (
                <div className="mt-3 hidden h-[2px] w-full bg-gradient-to-r from-yellow/70 to-transparent xl:block" />
              )}
            </article>
          ))}
        </div>

        <Link to="/products" className="btn-primary mt-8 inline-block">
          Start Your Order →
        </Link>
      </div>
    </section>
  )
}

export default HowItWorks
