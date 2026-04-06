import { Link } from 'react-router-dom'

function FinalCTA() {
  return (
    <section className="bg-yellow py-16 md:py-20">
      <div className="container-shell text-center">
        <h2 className="text-3xl font-extrabold text-navy sm:text-4xl">
          Let&apos;s help you show up properly.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[17px] text-navy/90">
          From business stationery and event branding to product labels and book production, Bilta
          gives you one reliable partner for print, branding and packaging.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/products"
            className="cursor-pointer border-2 border-navy px-5 py-3 font-bold text-navy transition hover:bg-navy hover:text-white active:scale-95"
          >
            Shop Products
          </Link>
          <a
            href="https://wa.me/YOURNUMBER"
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer border-2 border-navy px-5 py-3 font-bold text-navy transition hover:bg-navy hover:text-white active:scale-95"
          >
            Order via WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

export default FinalCTA