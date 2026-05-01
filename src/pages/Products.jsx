import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getProductsData } from '../services/productsService'

function getShortDescription(text = '', limit = 80) {
  if (!text) return ''
  if (text.length <= limit) return text
  return `${text.slice(0, limit).trimEnd()}...`
}

function formatPrice(value) {
  const raw = String(value ?? '').trim()
  if (!raw) return 'Price on request'

  const numericCandidate = raw.replace(/[₦,\s]/g, '')
  if (/^\d+(\.\d+)?$/.test(numericCandidate)) {
    const amount = Number(numericCandidate)
    if (Number.isFinite(amount)) {
      return `₦${amount.toLocaleString('en-NG')}`
    }
  }

  return raw
}

function Products() {
  const [products, setProducts] = useState([])
  const [filters, setFilters] = useState(['All Products'])
  const [activeFilter, setActiveFilter] = useState('All Products')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadProducts() {
      setIsLoading(true)
      const data = await getProductsData()
      if (!isMounted) return

      setProducts(data.products)
      setFilters(data.filters)
      setActiveFilter((current) => (data.filters.includes(current) ? current : data.filters[0] || 'All Products'))
      setIsLoading(false)
    }

    loadProducts()

    return () => {
      isMounted = false
    }
  }, [])

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
  }, [activeFilter, products, searchTerm])

  const groupedProducts = useMemo(() => {
    const order = filters.filter((item) => item !== 'All Products')
    return order
      .map((category) => ({
        category,
        items: visibleProducts.filter((item) => item.category === category),
      }))
      .filter((group) => group.items.length > 0)
  }, [filters, visibleProducts])

  return (
    <>
      <Navbar />
      <main>
        <section className="container-shell py-16 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-navy">Shop</p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Shop print products built to help you present better.</h1>
          <p className="mt-5 max-w-3xl text-[17px] leading-relaxed text-slate-600">
            Choose from business printing, event branding, packaging, books, and ready-made kits
            designed to help your brand, event, or project show up properly.
          </p>
        </section>

        <section className="bg-[#F4F8FC] py-16">
          <div className="mx-auto grid w-full max-w-[92rem] min-w-0 gap-6 px-4 sm:px-6 lg:grid-cols-[300px_1fr] lg:px-8">
            <aside className="hide-scrollbar min-w-0 lg:sticky lg:top-[72px] lg:max-h-[calc(100vh-88px)] lg:overflow-y-auto lg:h-fit lg:border lg:border-slate-200 lg:bg-white lg:p-4 lg:shadow-sm">
              <h2 className="text-base font-bold text-slate-800 lg:mb-0">Filters</h2>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Shop by category</p>
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
              {isLoading && (
                <div className="mb-4 border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                  Loading products...
                </div>
              )}

              <div className="z-40 mb-4 flex items-center border border-slate-300 bg-white px-3 py-2 shadow-sm lg:sticky lg:top-[72px]">
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

              <h2 className="mb-4 text-2xl font-extrabold">Featured products</h2>

              <div className="space-y-8">
                {groupedProducts.map((group) => (
                  <section key={group.category}>
                    <h2 className="mb-3 text-lg font-bold text-navy">{group.category}</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      {group.items.map((product) => (
                        <Link
                          key={product.title}
                          to={`/products/${product.slug}`}
                          state={{ product }}
                          className="group block border border-slate-200 bg-white p-4 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                        >
                          <div className="overflow-hidden border border-slate-200">
                            <img
                              src={product.image}
                              alt={product.title}
                              loading="lazy"
                              decoding="async"
                              className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          <h3 className="mt-4 text-lg font-bold transition-colors duration-300 group-hover:text-navy">{product.title}</h3>
                          <p className="mt-2 text-sm text-slate-600">{getShortDescription(product.description, 80)}</p>
                          <p className="mt-2 text-sm font-semibold text-navy">{formatPrice(product.price)}</p>
                          <span className="mt-4 inline-block border-2 border-navy px-4 py-2 text-sm font-bold text-navy transition group-hover:bg-navy group-hover:text-white">
                            {product.enableDesignUpload ? 'START DESIGN' : 'ORDER NOW'}
                          </span>
                        </Link>
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