import { Link } from 'react-router-dom'

function Mission() {
  return (
    <section className="bg-navy-deeper py-16 text-center text-white md:py-20">
      <div className="container-shell max-w-4xl">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          More than a print shop. A print partner.
        </h2>
        <p className="mt-5 text-[17px] leading-relaxed text-slate-200">
          Our mission is simple: help brands communicate clearly through quality print, practical
          branding tools, and functional packaging systems that fit their growth stage.
        </p>
        <p className="mt-4 text-[17px] leading-relaxed text-slate-200">
          At Bilta, we combine decades of craftsmanship with modern workflows so businesses can
          order confidently, deliver faster, and look professional at every customer touchpoint.
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