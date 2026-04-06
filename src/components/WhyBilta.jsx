import { Building2, CircleCheckBig, Gauge, Layers3, ShieldCheck } from 'lucide-react'

const features = [
  {
    icon: ShieldCheck,
    title: 'Consistent Quality Control',
    text: 'Every production batch follows checks for color, finishing, and brand consistency.',
  },
  {
    icon: Gauge,
    title: 'Faster Turnaround Workflow',
    text: 'Clear process steps reduce delays from request to final delivery.',
  },
  {
    icon: Layers3,
    title: 'End-to-End Production Stack',
    text: 'Design support, print execution, finishing, and packaging under one coordinated team.',
  },
  {
    icon: Building2,
    title: 'Built for Business Operations',
    text: 'We support corporate teams, event brands, product businesses, and institutions at scale.',
  },
]

function WhyBilta() {
  return (
    <section className="container-shell py-16 md:py-20">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-navy">Why Bilta</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-extrabold sm:text-4xl">
            Why businesses and event brands choose Bilta.
          </h2>
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
        Trusted by businesses, schools, churches, event planners, and independent creators.
      </div>
    </section>
  )
}

export default WhyBilta