import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { products } from '../data/productsData'

const categoryHighlights = {
  'Business Cards': ['Premium stock options', 'Matte / Gloss / Spot UV finishes', 'Fast turnaround for urgent orders'],
  'Flyers & Brochures': ['Single fold, bi-fold, and tri-fold formats', 'Campaign-friendly bulk print runs', 'High-color marketing output'],
  'Banners & Signage': ['Indoor and outdoor print materials', 'Durable inks for visibility', 'Multiple display sizes available'],
  'Packaging Labels': ['Waterproof and matte label options', 'Custom cut and shape support', 'Suitable for retail and logistics'],
  'Book Printing': ['Softcover and hardcover options', 'Neat binding and finishing', 'Ideal for manuals and catalogs'],
  'Office Stationery': ['Corporate identity consistency', 'Daily-use branded materials', 'Scalable print quantities'],
}

function ProductDetails() {
  const { slug } = useParams()
  const product = products.find((item) => item.slug === slug)

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="container-shell py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-navy">Product</p>
          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">Product not found.</h1>
          <p className="mt-4 max-w-2xl text-slate-600">
            The product you are looking for may have been removed or the link is incorrect.
          </p>
          <Link to="/products" className="btn-primary mt-6 inline-block">
            Back to Products
          </Link>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main>
        <section className="container-shell py-16 md:py-20">
          <Link to="/products" className="text-sm font-semibold text-navy hover:underline">
            ← Back to Products
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <div className="border border-slate-200 bg-white p-4 shadow-sm">
              <img
                src={product.image}
                alt={product.title}
                className="h-[280px] w-full border border-slate-200 object-cover sm:h-[360px]"
              />
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-navy">{product.category}</p>
              <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{product.title}</h1>
              <p className="mt-4 text-[17px] leading-relaxed text-slate-600">{product.description}</p>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-[#F4F8FC] p-5">
                <h2 className="text-base font-bold text-slate-800">Project Details</h2>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                  {(categoryHighlights[product.category] ?? []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/YOURNUMBER"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                >
                  Request Quote
                </a>
                <Link
                  to="/contact"
                  className="border-2 border-navy px-5 py-3 text-sm font-bold text-navy transition hover:bg-navy hover:text-white"
                >
                  Talk to Bilta
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default ProductDetails
