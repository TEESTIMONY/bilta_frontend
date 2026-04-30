import { Link } from 'react-router-dom'

function Mission() {
  return (
    <section className="bg-navy-deeper py-16 text-center text-white md:py-20">
      <div className="container-shell max-w-4xl">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          More than a print shop. A print partner.
        </h2>
        <p className="mt-5 text-[17px] leading-relaxed text-slate-200">
          Bilta exists to help businesses, brands, and events present themselves with more clarity,
          confidence, and professionalism.
        </p>
        <p className="mt-4 text-[17px] leading-relaxed text-slate-200">
          We believe the right print decisions can improve how people see your business, strengthen
          how your event is remembered, and support how your brand grows. That’s why we don’t just
          print stuff. We print them well.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/about" className="btn-primary">
            Learn More About Bilta
          </Link>
          <Link to="/products" className="cursor-pointer border-2 border-white px-5 py-3 font-bold text-white transition hover:bg-white hover:text-navy active:scale-95">
            Shop Products
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Mission