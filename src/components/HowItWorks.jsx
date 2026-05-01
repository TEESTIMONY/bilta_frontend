import { Link } from 'react-router-dom'
import { MessageCircle, MonitorSmartphone } from 'lucide-react'
import processChoose from '../assets/process-choose.svg'
import processDetails from '../assets/process-details.svg'
import processPreview from '../assets/process-preview.svg'
import processProduction from '../assets/process-production.svg'
import processDelivery from '../assets/process-delivery.svg'

const steps = [
  {
    title: 'Review your order',
    note: 'We review your files and request details carefully before production starts.',
    image: processChoose,
  },
  {
    title: 'Confirm details',
    note: 'We confirm quantities, sizes, timelines, and important production specs.',
    image: processDetails,
  },
  {
    title: 'Refine what’s needed',
    note: 'Where needed, we guide better material choices and finishing options.',
    image: processPreview,
  },
  {
    title: 'Produce your job',
    note: 'Your work enters printing and finishing with quality checks in place.',
    image: processProduction,
  },
  {
    title: 'Notify when ready',
    note: 'We notify you when your job is ready for pickup, rider, or delivery.',
    image: processDelivery,
  },
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#F4F8FC] py-16 md:py-20">
      <div className="container-shell">
        <h2 className="text-3xl font-extrabold sm:text-4xl">Print made easier.</h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
            <MonitorSmartphone className="text-navy" />
            <h3 className="mt-3 text-xl font-bold">Option 1: Shop online</h3>
            <p className="mt-2 text-sm text-slate-600">
              Add your product to cart, upload your files, and check out directly through the website.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
            <MessageCircle className="text-navy" />
            <h3 className="mt-3 text-xl font-bold">Option 2: Order through WhatsApp</h3>
            <p className="mt-2 text-sm text-slate-600">
              Send us what you need, and we’ll guide you through the process from there.
            </p>
          </article>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {steps.map(({ title, note, image }, index) => (
            <article key={title} className="border border-slate-300 bg-white shadow-sm">
              <img src={image} alt={title} className="h-32 w-full border-b border-slate-200 object-cover" />
              <div className="p-3">
                <p className="text-xs font-bold uppercase tracking-widest text-navy">Step 0{index + 1}</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{note}</p>
              </div>
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