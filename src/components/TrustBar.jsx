import { Award, BriefcaseBusiness, Building2, CalendarDays, MessageCircleMore } from 'lucide-react'

const badges = [
  { icon: Award, text: '30+ Years of Service' },
  { icon: Building2, text: 'Print, Branding & Packaging in One Place' },
  { icon: BriefcaseBusiness, text: 'Trusted by Businesses & Individuals' },
  { icon: CalendarDays, text: 'Business, Event & Book Production' },
  { icon: MessageCircleMore, text: 'Online and WhatsApp Order Support' },
]

function TrustBar() {
  return (
    <section className="bg-navy py-7">
      <div className="container-shell grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {badges.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-3 rounded-xl bg-white/10 p-3 text-white">
            <span className="rounded-lg bg-yellow p-2 text-navy">
              <Icon size={16} />
            </span>
            <p className="text-sm font-medium leading-snug">{text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TrustBar