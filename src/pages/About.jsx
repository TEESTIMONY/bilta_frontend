import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function About() {
  return (
    <>
      <Navbar />
      <main>
        <section className="container-shell py-16 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-navy">About Bilta</p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">30+ years of practical print expertise.</h1>
          <p className="mt-5 max-w-3xl text-[17px] leading-relaxed text-slate-600">
            Bilta has served businesses, institutions, event planners, and independent creators for
            over three decades. Our focus has always been simple: deliver quality print, branding,
            and packaging solutions that help people communicate clearly and sell confidently.
          </p>
        </section>

        <section className="bg-[#F4F8FC] py-16">
          <div className="container-shell grid gap-5 md:grid-cols-3">
            {[
              ['30+', 'Years of service'],
              ['5', 'Core service categories'],
              ['1000+', 'Projects delivered yearly'],
            ].map(([value, label]) => (
              <article key={label} className="rounded-2xl bg-white p-6 shadow-md">
                <p className="text-4xl font-extrabold text-navy">{value}</p>
                <p className="mt-2 text-sm text-slate-600">{label}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="container-shell py-16">
          <div className="rounded-3xl bg-navy p-8 text-white md:p-10">
            <h2 className="text-3xl font-extrabold text-white">Built from craftsmanship. Improved by systems.</h2>
            <p className="mt-4 max-w-3xl text-slate-200">
              We blend old-school quality control with modern production systems so every client gets
              clear communication, dependable timelines, and professional output.
            </p>
            <Link to="/contact" className="btn-primary mt-6 inline-block">
              Talk to Bilta
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default About