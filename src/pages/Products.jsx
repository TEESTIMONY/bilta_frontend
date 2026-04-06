import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { filters, products } from '../data/productsData'

function Products() {
  const [activeFilter, setActiveFilter] = useState(filters[0])
  const [searchTerm, setSearchTerm] = useState('')

  const visibleProducts = useMemo(() => {
    const filteredByCategory =
      activeFilter === 'All Products'
        ? products
        : products.filter((item) => item.category === activeFilter)

    const query = searchTerm.trim().toLowerCase()
    if (!query) return filteredByCategory

    return filteredByCategory.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query),
    )
  }, [activeFilter, searchTerm])

  const groupedProducts = useMemo(() => {
    const order = filters.filter((item) => item !== 'All Products')
    return order
      .map((category) => ({
        category,
        items: visibleProducts.filter((item) => item.category === category),
      }))
      .filter((group) => group.items.length > 0)
  }, [visibleProducts])

  return (
    <>
      <Navbar />
      <main>
        <section className="container-shell py-16 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-navy">Products</p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Print products built for business growth.</h1>
          <p className="mt-5 max-w-3xl text-[17px] leading-relaxed text-slate-600">
            Explore Bilta&apos;s core print and branding products. Need custom specs? Share your
            requirements and our team will recommend the most practical format and finish.
          </p>
        </section>

        <section className="bg-[#F4F8FC] py-16">
          <div className="container-shell grid min-w-0 gap-6 lg:grid-cols-[260px_1fr]">
            <aside className="min-w-0 lg:h-fit lg:border lg:border-slate-200 lg:bg-white lg:p-4 lg:shadow-sm">
              <h2 className="text-base font-bold text-slate-800 lg:mb-0">Filters</h2>
              <ul className="mt-3 flex w-full max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-1 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
                {filters.map((filter) => (
                  <li key={filter} className="shrink-0 lg:shrink">
                    <button
                      onClick={() => setActiveFilter(filter)}
                      className={`border px-3 py-2 text-left text-sm font-medium whitespace-nowrap transition lg:w-full ${
                        activeFilter === filter
                          ? 'border-navy bg-navy text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-navy hover:text-navy'
                      }`}
                    >
                      {filter}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            <div className="min-w-0">
              <div className="mb-4 flex items-center border border-slate-300 bg-white px-3 py-2">
                <Search size={16} className="mr-2 text-slate-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none"
                />
                <button className="border border-navy px-3 py-1 text-xs font-semibold text-navy">
                  Search
                </button>
              </div>

              <div className="space-y-8">
                {groupedProducts.map((group) => (
                  <section key={group.category}>
                    <h2 className="mb-3 text-lg font-bold text-navy">{group.category}</h2>
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      {group.items.map((product) => (
                        <article
                          key={product.title}
                          className="border border-slate-200 bg-white p-4 shadow-md transition hover:-translate-y-1"
                        >
                          <img
                            src={product.image}
                            alt={product.title}
                            className="h-40 w-full border border-slate-200 object-cover"
                          />
                          <h3 className="mt-4 text-lg font-bold">{product.title}</h3>
                          <p className="mt-2 text-sm text-slate-600">{product.description}</p>
                          <Link
                            to={`/products/${product.slug}`}
                            className="mt-4 inline-block cursor-pointer border-2 border-navy px-4 py-2 text-sm font-bold text-navy transition hover:bg-navy hover:text-white active:scale-95"
                          >
                            Order Now
                          </Link>
                        </article>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Products