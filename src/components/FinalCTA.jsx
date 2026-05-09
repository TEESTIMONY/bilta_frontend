import { Link } from 'react-router-dom'
import { buildWhatsAppUrl } from '../utils/whatsapp'

function FinalCTA() {
  return (
    <section className="home-cta-stage bg-yellow py-16 md:py-20">
      <div className="container-shell text-center">
        <h2 className="text-3xl font-extrabold text-navy sm:text-4xl">
          Let&apos;s help you show up properly.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-[17px] text-navy/90">
          Whether you’re building a brand, planning an event, printing a book, or preparing business
          materials, Bilta is here to help you do it well.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/contact"
            className="cursor-pointer border-2 border-navy px-5 py-3 font-bold text-navy transition hover:bg-navy hover:text-white active:scale-95"
          >
            Request a Quote
          </Link>
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer border-2 border-navy px-5 py-3 font-bold text-navy transition hover:bg-navy hover:text-white active:scale-95"
          >
            Chat on WhatsApp
          </a>
        </div>  
      </div>
    </section>
  )
}

export default FinalCTA
