import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const stats = [
  { value: 30, suffix: '+', label: 'Years of service' },
  { value: 5000, suffix: '+', label: 'Projects delivered' },
  { value: 98, suffix: '%', label: 'Repeat client trust' },
]

function About() {
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const [counts, setCounts] = useState(stats.map(() => 0))

  useEffect(() => {
    const nodes = document.querySelectorAll('.about-reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onMove = (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 16
      const y = (event.clientY / window.innerHeight - 0.5) * 16
      setParallax({ x, y })
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    const duration = 1200
    const start = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      setCounts(stats.map((item) => Math.floor(item.value * progress)))
      if (progress < 1) requestAnimationFrame(tick)
    }

    const frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-navy py-16 text-white md:py-20">
          <div className="container-shell">
          <div
            className="pointer-events-none absolute -left-8 top-10 h-28 w-28 rounded-full bg-yellow/25 blur-3xl animate-drift"
            style={{ transform: `translate(${parallax.x * 0.8}px, ${parallax.y * 0.8}px)` }}
          />
          <div
            className="pointer-events-none absolute right-10 top-1/4 h-20 w-20 rounded-full bg-sky-300/30 blur-3xl animate-drift"
            style={{ animationDelay: '0.7s', transform: `translate(${-parallax.x * 0.6}px, ${-parallax.y * 0.6}px)` }}
          />
          <p className="animate-fade-up text-sm font-semibold uppercase tracking-widest text-yellow">About Bilta</p>
          <h1 className="animate-fade-up animate-delay-1 mt-3 text-4xl font-extrabold text-white sm:text-5xl">Built on trust. Growing with intention.</h1>
          <p className="animate-fade-up animate-delay-2 mt-5 max-w-3xl text-[17px] leading-relaxed text-slate-100">
            Bilta is a print house built on over 30 years of service, consistency, and commitment
            to helping people and brands move forward.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {stats.map((item, index) => (
              <article
                key={item.label}
                className="animate-fade-up animate-float-soft border border-slate-200 bg-[#F8FAFC] p-4 transition duration-300 hover:-translate-y-1 hover:border-yellow hover:shadow-lg"
                style={{ animationDelay: `${index * 110}ms` }}
              >
                <p className="text-lg font-extrabold text-navy">{counts[index].toLocaleString()}{item.suffix}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-600">{item.label}</p>
              </article>
            ))}
          </div>
          </div>
        </section>

        <section className="about-reveal reveal bg-[#F4F8FC] py-16">
          <div className="container-shell">
            <h2 className="border-l-4 border-yellow pl-3 text-3xl font-extrabold sm:text-4xl">
              Our story started with one typewriter.
            </h2>
            <div className="mt-6 max-w-4xl space-y-4 text-[17px] leading-relaxed text-slate-600">
              <p>
                Bilta began over 30 years ago in Pen Cinema, Agege, with a single typewriter and a
                simple mission: to help people get things done.
              </p>
              <p>
                What started as a kiosk serving everyday typing and document needs became a trusted
                destination for customers who valued reliability, consistency, and service they could
                count on.
              </p>
              <p>
                Over the years, Bilta grew through work. It became more than a place to “just type.”
                It became a place people trusted through dependable service and consistent standards.
              </p>
              <p>
                Today, Bilta is evolving into a more modern print house refining our systems,
                improving our service, expanding our offerings, and helping businesses show up more
                professionally through print, branding, packaging, and digital support.
              </p>
              <p>We are still building. But we are building with vision.</p>
            </div>
          </div>
        </section>

        <section className="about-reveal reveal bg-navy py-16 text-white">
          <div className="container-shell">
          <h2 className="border-l-4 border-yellow pl-3 text-3xl font-extrabold text-white sm:text-4xl">
            The same consistency. Better systems. Broader vision.
          </h2>
          <p className="mt-5 max-w-4xl text-[17px] leading-relaxed text-slate-100">
            Bilta today combines decades of trusted service with a more modern approach to print,
            branding, packaging, event production, and business support.
          </p>
          <p className="mt-4 max-w-4xl text-[17px] leading-relaxed text-slate-100">
            We help customers think beyond “just printing” and make better decisions about what they
            need, how it should be produced, and how it should be presented. Because the work is not
            just about printing — it’s about what the print represents.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <article className="animate-fade-up animate-delay-1 border border-slate-200 bg-white p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:border-yellow hover:shadow-xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-navy">Our mission</p>
              <h3 className="mt-2 text-2xl font-extrabold">To be your print partner.</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                We help businesses, brands, authors, and event hosts print, brand, and package with
                clarity, quality, and confidence.
              </p>
            </article>

            <article className="animate-fade-up animate-delay-2 border border-slate-200 bg-white p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:border-yellow hover:shadow-xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-navy">Our vision</p>
              <h3 className="mt-2 text-2xl font-extrabold">To become a trusted print house serving brands across the world.</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                We are building Bilta into a world-class print house known for thoughtful service,
                quality execution, reliable systems, and brand-conscious production.
              </p>
            </article>
          </div>

          <section className="about-reveal reveal mt-10 border border-slate-200 bg-[#F4F8FC] p-6 md:p-8 animate-fade-up">
            <p className="text-sm font-semibold uppercase tracking-widest text-navy">What guides our work</p>
            <h3 className="mt-2 text-2xl font-extrabold">Our principles</h3>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                ['Excellence in execution', 'We care about quality, detail, and how your materials leave our hands.'],
                ['Integrity in production', 'We are intentional about what we produce and how we produce it.'],
                ['Service with clarity', 'We believe customers deserve communication that is clear, useful, and supportive.'],
                ['Presentation with purpose', 'We help customers make decisions that improve how their business, event, or brand is presented.'],
                ['Growth-minded support', 'We think in ways that help our customers show up better and scale smarter.'],
                ['Consistency', 'We value standards that can be trusted over time.'],
              ].map(([title, text], index) => (
                <article
                  key={title}
                  className="animate-fade-up border border-slate-200 bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-yellow hover:shadow-lg"
                  style={{ animationDelay: `${index * 95}ms` }}
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-yellow">0{index + 1}</p>
                  <h4 className="mt-1 text-base font-bold">{title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="about-reveal reveal mt-10 border-l-4 border-yellow bg-navy p-8 text-white md:p-10 animate-float-soft animate-glow-pulse">
            <h2 className="text-3xl font-extrabold text-white">Looking for a dependable print partner?</h2>
            <p className="mt-4 max-w-3xl text-slate-200">
              Whether you need branded materials, event production, packaging, books, or business essentials, Bilta is ready to help.
            </p>
            <Link to="/contact" className="btn-primary mt-6 inline-block">
              Work With Bilta
            </Link>
          </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default About