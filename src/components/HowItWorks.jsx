import { Link } from 'react-router-dom'
import { MessageCircle, MonitorSmartphone } from 'lucide-react'
import processChoose from '../assets/process-choose.svg'
import processDetails from '../assets/process-details.svg'
import processPreview from '../assets/process-preview.svg'
import processProduction from '../assets/process-production.svg'
import processDelivery from '../assets/process-delivery.svg'

const steps = [
  {
    title: 'Choose Product',
    note: 'Select the exact item category (cards, flyers, labels, books, packaging).',
    image: processChoose,
  },
  {
    title: 'Share Details',
    note: 'Send quantity, preferred size, finishing options, and your deadline clearly.',
    image: processDetails,
  },
  {
    title: 'Approve Preview',
    note: 'Review the layout preview and approve it before production starts.',
    image: processPreview,
  },
  {
    title: 'Production',
    note: 'Your order enters controlled print, finishing, and quality checks.',
    image: processProduction,
  },
  {
    title: 'Pickup/Delivery',
    note: 'Receive updates and collect your job or schedule direct delivery.',
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
            <h3 className="mt-3 text-xl font-bold">Shop Online</h3>
            <p className="mt-2 text-sm text-slate-600">
              Browse products, select options, and submit your order details from any device.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
            <MessageCircle className="text-navy" />
            <h3 className="mt-3 text-xl font-bold">Order via WhatsApp</h3>
            <p className="mt-2 text-sm text-slate-600">
              Send your request directly and receive guided support from our team.
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