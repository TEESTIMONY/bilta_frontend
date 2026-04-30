import { Building2, CircleCheckBig, Gauge, Layers3, ShieldCheck } from 'lucide-react'

const features = [
  {
    icon: Layers3,
    title: 'We think beyond the print',
    text: 'We don’t just ask, “What do you want to print?” We ask, “What does your brand need?”',
  },
  {
    icon: ShieldCheck,
    title: 'We care about the details',
    text: 'From layout to finish, small details change how your business is perceived.',
  },
  {
    icon: Gauge,
    title: 'We believe service matters',
    text: 'Fast is good. But thoughtful, clear, and dependable is better.',
  },
  {
    icon: Building2,
    title: 'We’re building with intention',
    text: 'Bilta is growing into a more modern print and brand support system — one that values both legacy and progress.',
  },
]

function WhyBilta() {
  return (
    <section className="container-shell py-16 md:py-20">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-navy">Why Bilta</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-extrabold sm:text-4xl">Why Bilta?</h2>
          <p className="mt-4 max-w-3xl text-[17px] text-slate-600">
            Because printing isn’t just about putting ink on paper. It’s about helping your business
            show up with clarity, care, and confidence.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:col-span-4">
          <div className="border border-slate-200 bg-[#F4F8FC] p-3">
            <p className="text-2xl font-extrabold text-navy">30+</p>
            <p className="text-xs uppercase tracking-wide text-slate-600">Years Experience</p>
          </div>
          <div className="border border-slate-200 bg-[#F4F8FC] p-3">
            <p className="text-2xl font-extrabold text-navy">1000+</p>
            <p className="text-xs uppercase tracking-wide text-slate-600">Annual Jobs</p>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {features.map(({ icon: Icon, title, text }, idx) => (
          <article key={title} className="border border-slate-200 bg-white p-6 shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{text}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-500">0{idx + 1}</span>
                <span className="mt-2 block text-navy">
                  <Icon size={18} />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2 border border-slate-200 bg-[#F4F8FC] px-4 py-3 text-sm text-slate-700">
        <CircleCheckBig size={16} className="text-navy" />
        Trusted by businesses, event hosts, schools, creators, and individuals.
      </div>
    </section>
  )
}

export default WhyBilta