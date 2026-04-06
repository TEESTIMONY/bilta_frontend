import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Contact() {
  return (
    <>
      <Navbar />
      <main>
        <section className="container-shell py-16 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-navy">Contact</p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Let&apos;s discuss your print needs.</h1>
          <p className="mt-5 max-w-3xl text-[17px] leading-relaxed text-slate-600">
            Share your project details and our team will guide you through the best print,
            branding, and packaging options for your goals and budget.
          </p>
        </section>

        <section className="bg-[#F4F8FC] py-16">
          <div className="container-shell grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl bg-white p-7 shadow-md">
              <h2 className="text-2xl font-bold">Quick Contact</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>Email: hello@bilta.com</li>
                <li>Phone: +234 000 000 0000</li>
                <li>Address: Your Business Address, Nigeria</li>
              </ul>
              <a href="https://wa.me/YOURNUMBER" target="_blank" rel="noreferrer" className="btn-primary mt-6 inline-block">
                Order via WhatsApp
              </a>
            </article>

            <article className="rounded-2xl bg-navy p-7 text-white shadow-md">
              <h2 className="text-2xl font-bold text-white">Service Areas</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-200">
                <li>Business & Corporate Print</li>
                <li>Event Branding Materials</li>
                <li>Packaging & Label Production</li>
                <li>Book & Author Print Support</li>
              </ul>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Contact